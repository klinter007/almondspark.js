import type { NextApiRequest, NextApiResponse } from 'next';
import { initialize, deleteGalleryItem } from '../../../../utils/geminiUtils';
import fs from 'fs';
import path from 'path';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean; message: string } | { error: string }>
) {
  const { id } = req.query;

  // Ensure id is a string
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid item ID' });
  }

  // Only allow DELETE requests
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Initialize environment
    initialize();
    
    // Delete the gallery item
    const result = await deleteGalleryItem(id);
    
    if (result.success) {
      return res.status(200).json({ success: true, message: 'Item deleted successfully' });
    } else {
      return res.status(404).json({ error: result.message });
    }
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    return res.status(500).json({ 
      error: `Error deleting gallery item: ${error instanceof Error ? error.message : 'Unknown error'}` 
    });
  }
}