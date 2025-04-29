/*
 * Fully‑working Gemini 2.0 Flash‑Exp client
 * ------------------------------------------------------------
 * Notes
 * 1.  npm i @google/genai            ← NEW SDK (not @google/generative‑ai)
 * 2.  Each user provides their own API key through the interface
 * 3.  The image endpoint **must** be called with
 *        config: { responseModalities: ["TEXT", "IMAGE"] }
 *     Image‑only output is not allowed.
 */

import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import sharp from 'sharp';
import { put, list, del } from '@vercel/blob';

// >>> NEW GOOGLE SDK <<<
import {
  GoogleGenAI,
  type Content,
  type GenerationConfig,
} from "@google/genai";

// ---------------------------------------------------------------------------
// Environment detection
// ---------------------------------------------------------------------------

// Check if running in a read-only environment like Vercel
const isVercelServerless = process.env.VERCEL === '1';

// ---------------------------------------------------------------------------
// Paths & bootstrap helpers
// ---------------------------------------------------------------------------

const GEMINI_STRIPS_DIR = path.join(process.cwd(), "gemini_strips");
const LOGIC_DIR = path.join(process.cwd(), "utils");
const INDEX_PATH = path.join(LOGIC_DIR, "index.json");

const ensureDirectoriesExist = () => {
  if (!fs.existsSync(GEMINI_STRIPS_DIR)) fs.mkdirSync(GEMINI_STRIPS_DIR, { recursive: true });
  if (!fs.existsSync(LOGIC_DIR)) fs.mkdirSync(LOGIC_DIR, { recursive: true });
};

const copyRuleFiles = () => {
  const rulesPromptSrc = path.join(process.cwd(), "flask_files/logic/rules_prompt.txt");
  const rulesStyleSrc = path.join(process.cwd(), "flask_files/logic/rules_style.txt");
  const rulesPromptDest = path.join(LOGIC_DIR, "rules_prompt.txt");
  const rulesStyleDest = path.join(LOGIC_DIR, "rules_style.txt");

  if (fs.existsSync(rulesPromptSrc) && !fs.existsSync(rulesPromptDest)) fs.copyFileSync(rulesPromptSrc, rulesPromptDest);
  if (fs.existsSync(rulesStyleSrc) && !fs.existsSync(rulesStyleDest)) fs.copyFileSync(rulesStyleSrc, rulesStyleDest);
};

const initIndexIfNeeded = () => {
  if (!fs.existsSync(INDEX_PATH)) {
    const flaskIndexPath = path.join(process.cwd(), "flask_files/logic/index.json");
    if (fs.existsSync(flaskIndexPath)) {
      fs.copyFileSync(flaskIndexPath, INDEX_PATH);
    } else {
      fs.writeFileSync(INDEX_PATH, JSON.stringify([], null, 2));
    }
  }
};

const copyExistingImages = () => {
  const flaskImagesDir = path.join(process.cwd(), "flask_files/gemini_strips");
  if (!fs.existsSync(flaskImagesDir)) return;
  for (const f of fs.readdirSync(flaskImagesDir)) {
    if (f.endsWith(".png") && !fs.existsSync(path.join(GEMINI_STRIPS_DIR, f))) {
      fs.copyFileSync(path.join(flaskImagesDir, f), path.join(GEMINI_STRIPS_DIR, f));
    }
  }
};

export const initialize = () => {
  ensureDirectoriesExist();
  copyRuleFiles();
  initIndexIfNeeded();
  copyExistingImages();
};

// ---------------------------------------------------------------------------
// Helpers – rules & GoogleGenAI client
// ---------------------------------------------------------------------------

const loadRulesPrompt = (): string => {
  const p = path.join(LOGIC_DIR, "rules_prompt.txt");
  return fs.existsSync(p) ? fs.readFileSync(p, "utf-8").trim() : "Generate a comic strip based on the following instruction.";
};

const loadRulesStyle = (): string => {
  const p = path.join(LOGIC_DIR, "rules_style.txt");
  return fs.existsSync(p) ? fs.readFileSync(p, "utf-8").trim() : "";
};

const initClient = (apiKey: string) => new GoogleGenAI({ apiKey });

const composePromptHop1 = (sentence: string) => `${loadRulesPrompt()}\n\nINSTRUCTION: "${sentence.trim()}"`;

// ---------------------------------------------------------------------------
//  HOP‑1  (text → prompt)
// ---------------------------------------------------------------------------

export const generateImagePrompt = async (apiKey: string, sentence: string): Promise<string> => {
  const ai = initClient(apiKey);

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp", // text‑only endpoint
    contents: composePromptHop1(sentence),
  });

  if (!response.text) {
    throw new Error("No text returned in the response.");
  }

  return response.text.trim();
};

// ---------------------------------------------------------------------------
//  HOP‑2  (prompt [+ ref image] → native image)
// ---------------------------------------------------------------------------

export const generateImage = async (apiKey: string, imagePrompt: string): Promise<Buffer> => {
  const ai = initClient(apiKey);

  // Build multimodal contents array
  const styleRefPath = path.join(process.cwd(), "utils/style_ref1.jpg");
  if (!fs.existsSync(styleRefPath)) throw new Error(`Style reference missing → ${styleRefPath}`);

  // Resize and re-encode the style image
  const styleImageBuffer = fs.readFileSync(styleRefPath);
  const resizedImageBuffer = await sharp(styleImageBuffer)
    .resize(512, 512, { fit: 'cover' }) // Resize to 512x512 pixels
    .jpeg({ quality: 80 }) // Re-encode as JPEG with 80% quality
    .toBuffer();

  const styleImageBase64 = resizedImageBuffer.toString("base64");

  const contents: Content[] = [
    { text: imagePrompt },
    { inlineData: { mimeType: "image/jpeg", data: styleImageBase64 } },
  ] as unknown as Content[]; // Cast – SDK typings still in flux

  // NB: Gemini requires both TEXT & IMAGE in responseModalities when hitting the image‑generation model
  const config: Partial<GenerationConfig> = {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore – `responseModalities` not in the preview typings yet
    responseModalities: ["TEXT", "IMAGE"],
  };

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp-image-generation",
    contents,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore – preview SDK
    config,
  });

  // The SDK flattens parts to `response.parts` (preview); fall back to old shape if not present
  const parts: any[] = (response as any).parts || (response as any).candidates?.[0]?.content?.parts || [];

  for (const part of parts) {
    if (part.inlineData?.data) return Buffer.from(part.inlineData.data, "base64");
  }
  throw new Error("No inline image returned by Gemini.");
};

// ---------------------------------------------------------------------------
//  Orchestration – combine both hops, store file + index
// ---------------------------------------------------------------------------

export const generateStrip = async (
  apiKey: string,
  sentence: string
): Promise<{ imagePath: string; imageBase64: string; imageUrl?: string }> => {
  initialize();

  // Next sequence number ----------------------------------------------------
  const id = uuidv4();
  let nextNum = 1;
  try {
    const records = JSON.parse(fs.readFileSync(INDEX_PATH, "utf-8"));
    if (records.length) {
      const m = /([0-9]+)\.png$/.exec(records[records.length - 1].filename);
      if (m) nextNum = parseInt(m[1]) + 1;
    }
  } catch {/* ignore */}

  const filename = `${nextNum.toString().padStart(6, "0")}.png`;
  const imagePath = path.join(GEMINI_STRIPS_DIR, filename);

  // --- run both hops -------------------------------------------------------
  const prompt = await generateImagePrompt(apiKey, sentence);
  const imageBuffer = await generateImage(apiKey, prompt);
  
  let imageUrl;
  
  // Store in Vercel Blob if in serverless environment, otherwise store locally
  if (isVercelServerless) {
    try {
      // Generate a unique filename for Vercel Blob by adding a UUID suffix
      const uniqueBlobFilename = `comics/${nextNum.toString().padStart(6, "0")}-${id.substring(0, 8)}.png`;
      
      // Upload to Vercel Blob with the unique filename
      const blob = await put(uniqueBlobFilename, imageBuffer, {
        access: 'public',
        contentType: 'image/png'
      });
      imageUrl = blob.url;
      
      // Since we can't write to the filesystem, we'll update the index differently
      await updateImageIndex(id, sentence, filename, imageUrl);
    } catch (error) {
      console.error('Error uploading to Vercel Blob:', error);
      throw new Error('Failed to upload image to Vercel Blob');
    }
  } else {
    // Local storage for development
    fs.writeFileSync(imagePath, new Uint8Array(imageBuffer)); // Cast Buffer to Uint8Array
    updateImageIndex(id, sentence, filename);
  }

  return { 
    imagePath, 
    imageBase64: imageBuffer.toString("base64"),
    imageUrl 
  };
};

// ---------------------------------------------------------------------------
//  Gallery helpers
// ---------------------------------------------------------------------------

export const updateImageIndex = async (id: string, sentence: string, filename: string, imageUrl?: string) => {
  if (isVercelServerless) {
    // In serverless, we'll need to fetch the existing index, modify it, and then store it back
    // This is just a placeholder for now - in production you'd use a database
    // For simplicity, we're still using the file-based index in serverless mode
    try {
      let records: any[] = [];
      if (fs.existsSync(INDEX_PATH)) {
        try { records = JSON.parse(fs.readFileSync(INDEX_PATH, "utf-8")); } catch {/* ignore */ }
      }
      records.push({ id, sentence, filename, imageUrl });
      fs.writeFileSync(INDEX_PATH, JSON.stringify(records, null, 2));
    } catch (error) {
      console.error('Error updating image index in serverless environment:', error);
      // In a production app, you would store this in a database instead
    }
  } else {
    // Local development - file-based approach
    let records: any[] = [];
    if (fs.existsSync(INDEX_PATH)) {
      try { records = JSON.parse(fs.readFileSync(INDEX_PATH, "utf-8")); } catch {/* ignore */ }
    }
    records.push({ id, sentence, filename, imageUrl });
    fs.writeFileSync(INDEX_PATH, JSON.stringify(records, null, 2));
  }
};

export const deleteGalleryItem = async (id: string) => {
  if (!fs.existsSync(INDEX_PATH)) return { success: false, message: "Index not found" } as const;
  let records: any[] = JSON.parse(fs.readFileSync(INDEX_PATH, "utf-8"));
  const idx = records.findIndex((r) => r.id === id);
  if (idx === -1) return { success: false, message: "Item not found" } as const;

  const filename = records[idx].filename;
  const imageUrl = records[idx].imageUrl;
  
  // If we have an imageUrl (Vercel Blob), delete from Blob storage
  if (isVercelServerless && imageUrl) {
    try {
      // Delete from Vercel Blob storage
      await del(imageUrl);
    } catch (error) {
      console.error('Error deleting from Vercel Blob:', error);
      // Continue with index deletion even if blob deletion fails
    }
  } else {
    // Local file system deletion
    const imagePath = path.join(GEMINI_STRIPS_DIR, filename);
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
  }

  records.splice(idx, 1);
  fs.writeFileSync(INDEX_PATH, JSON.stringify(records, null, 2));
  return { success: true, message: "Item deleted" } as const;
};

export const getGallery = (search = "", limit = 50) => {
  if (!fs.existsSync(INDEX_PATH)) return { gallery: [] };
  let records: any[] = JSON.parse(fs.readFileSync(INDEX_PATH, "utf-8"));

  if (search) {
    records = records.filter((r) => r.sentence.toLowerCase().includes(search.toLowerCase()));
    records = records.map((r) => ({
      ...r,
      sentence: r.sentence.replace(new RegExp(search, "gi"), (m: string) => `<mark>${m}</mark>`), // Explicitly type `m` as `string`
    }));
  }

  if (limit && records.length > limit) records = records.sort(() => 0.5 - Math.random()).slice(0, limit);

  const gallery = records.map((rec) => {
    // If we have an imageUrl (from Vercel Blob), prioritize it
    if (rec.imageUrl) {
      return { 
        ...rec, 
        image_url: rec.imageUrl,
        // Optionally don't include base64 since we have a URL
        image_base64: "" 
      };
    }
    
    // Otherwise fall back to local file system for development
    const imgPath = path.join(GEMINI_STRIPS_DIR, rec.filename);
    const base64 = fs.existsSync(imgPath) ? fs.readFileSync(imgPath).toString("base64") : "";
    return { ...rec, image_base64: base64 };
  });

  return { gallery };
};

/*
 * listAvailableModels – the preview SDK does not yet expose this.
 * Keeping the stub to avoid breaking external imports.
 */
export const listAvailableModels = async () => {
  console.error("listAvailableModels() not yet supported in @google/genai preview SDK");
};

export { GEMINI_STRIPS_DIR };
