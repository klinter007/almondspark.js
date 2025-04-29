import type { NextApiRequest, NextApiResponse } from 'next';
import { getGallery, initialize } from '../../../utils/geminiUtils';

type GalleryResponse = {
  gallery: Array<{
    id: string;
    sentence: string;
    filename: string;
    image_base64: string;
  }>;
  error?: string;
}

// This is a special admin endpoint that returns all gallery items
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GalleryResponse | { error: string }>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Initialize environment
    initialize();
    
    // Get all gallery items without a limit
    const galleryData = getGallery('', 0); // 0 means get all items
    
    return res.status(200).json(galleryData);
  } catch (error) {
    console.error('Error retrieving gallery:', error);
    return res.status(500).json({ 
      error: `Error retrieving gallery: ${error instanceof Error ? error.message : 'Unknown error'}` 
    });
  }
}