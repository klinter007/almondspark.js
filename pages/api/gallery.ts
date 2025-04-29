import type { NextApiRequest, NextApiResponse } from 'next';
import { getGallery, initialize } from '../../utils/geminiUtils';

type GalleryResponse = {
  gallery: Array<{
    id: string;
    sentence: string;
    filename: string;
    image_base64: string;
  }>;
  error?: string;
}

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
    
    // Get parameters from query
    const { search, limit } = req.query;
    const searchTerm = typeof search === 'string' ? search : '';
    // Default limit to 5 items
    const itemLimit = typeof limit === 'string' ? parseInt(limit, 10) : 5;
    
    // Get gallery items with the specified limit
    const galleryData = getGallery(searchTerm, itemLimit);
    
    return res.status(200).json(galleryData);
  } catch (error) {
    console.error('Error retrieving gallery:', error);
    return res.status(500).json({ 
      error: `Error retrieving gallery: ${error instanceof Error ? error.message : 'Unknown error'}` 
    });
  }
}