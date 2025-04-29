import type { NextApiRequest, NextApiResponse } from 'next';
import { generateStrip } from '../../utils/geminiUtils';

type GenerateResponse = {
  image_base64?: string;
  filename?: string;
  image_url?: string;
  error?: string;
  errorType?: 'api_key' | 'service_unavailable' | 'general';
  canGenerate?: boolean;
  retryAfter?: number; // New field for retry delay
  retriesLeft?: number; // New field for remaining retries
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
    const { sentence, apiKey, retryCount = 0 } = req.body;

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
    
    // Handle 503 Service Unavailable errors with retry logic
    if (errorMessage.includes('503') || errorMessage.toLowerCase().includes('unavailable')) {
      const retryCount = parseInt(req.body.retryCount || '0');
      
      // Define retry delays (in seconds)
      const retryDelays = [10, 15, 20];
      
      // Check if we still have retries left
      if (retryCount < retryDelays.length) {
        const currentDelay = retryDelays[retryCount];
        const retriesLeft = retryDelays.length - retryCount - 1;
        
        return res.status(503).json({
          error: `The Gemini model is currently overloaded. We'll try again in ${currentDelay} seconds.`,
          errorType: 'service_unavailable',
          retryAfter: currentDelay,
          retriesLeft: retriesLeft
        });
      } else {
        // No more retries left
        return res.status(503).json({
          error: 'Sorry, the Gemini model is currently too busy. Please try again later.',
          errorType: 'service_unavailable'
        });
      }
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