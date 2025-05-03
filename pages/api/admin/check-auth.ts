import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Check for admin_token cookie
  const cookies = req.cookies;
  
  if (!cookies.admin_token) {
    return res.status(401).json({ authenticated: false });
  }
  
  // In a real application, you would validate the token against your storage
  // (database, Redis, etc.) to make sure it's still valid
  
  // For this simplified example, we'll just check if the cookie exists
  return res.status(200).json({ authenticated: true });
}