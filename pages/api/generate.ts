import type { NextApiRequest, NextApiResponse } from 'next';
import { generateStrip } from '../../utils/geminiUtils';

type GenerateResponse = {
  image_base64?: string;
  filename?: string;
  image_url?: string;
  error?: string;
  errorType?: 'api_key' | 'service_unavailable' | 'general';
  canGenerate?: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GenerateResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sentence, apiKey } = req.body;

    if (!sentence || typeof sentence !== 'string') {
      return res.status(400).json({ error: 'Invalid request. "sentence" is required.' });
    }

    if (!apiKey || typeof apiKey !== 'string') {
      return res.status(400).json({ 
        error: 'Please provide your Gemini API key. Get one from https://ai.google.dev/',
        errorType: 'api_key',
        canGenerate: false 
      });
    }

    // Generate comic strip using the user-provided API key
    const { imageBase64, imagePath, imageUrl } = await generateStrip(apiKey, sentence);
    
    // Extract filename from the path
    const filename = imagePath.split('/').pop() || 'almondspark-image.png';

    // Return the image as base64 and the URL if available (from Vercel Blob)
    return res.status(200).json({ 
      image_base64: imageBase64,
      filename: filename,
      image_url: imageUrl
    });
  } catch (error) {
    console.error('Error generating comic strip:', error);
    
    // Check for specific error types
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Handle 503 Service Unavailable errors
    if (errorMessage.includes('503') || errorMessage.includes('unavailable')) {
      return res.status(503).json({
        error: 'The Gemini model is currently overloaded. Please wait a few minutes and try again.',
        errorType: 'service_unavailable'
      });
    }
    
    // Handle API key errors
    if (errorMessage.toLowerCase().includes('api key') || 
        errorMessage.toLowerCase().includes('unauthorized') || 
        errorMessage.toLowerCase().includes('permission') ||
        errorMessage.toLowerCase().includes('credential')) {
      return res.status(401).json({
        error: 'Your API key appears to be invalid or has insufficient permissions. Please check your key in Settings.',
        errorType: 'api_key'
      });
    }
    
    // Generic error
    return res.status(500).json({ 
      error: 'Sorry, something went wrong. Please try again in a few minutes or contact us if the problem persists.',
      errorType: 'general'
    });
  }
}