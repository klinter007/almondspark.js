import { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';
import crypto from 'crypto';

// In a real application, the password would be properly hashed and stored securely
// For development, we'll store it in an environment variable
// You should set this in your environment or .env.local file
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || 
  // Default hash of 'almondspark_admin' - replace this with your own hashed password in production
  '5f4dcc3b5aa765d61d8327deb882cf99'; // This is just a placeholder MD5 hash

// A simple rate limiting implementation
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 5; // Max 5 failed attempts in the window
const attempts: Record<string, { count: number, resetTime: number }> = {};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const ipStr = typeof ip === 'string' ? ip : Array.isArray(ip) ? ip[0] : 'unknown';

  // Check rate limiting
  if (attempts[ipStr]) {
    const attempt = attempts[ipStr];
    
    // Reset counter if the time window has passed
    if (Date.now() > attempt.resetTime) {
      attempts[ipStr] = { count: 1, resetTime: Date.now() + RATE_LIMIT_WINDOW };
    } else if (attempt.count >= MAX_REQUESTS) {
      return res.status(429).json({ 
        message: 'Too many login attempts, please try again later',
        retryAfter: Math.ceil((attempt.resetTime - Date.now()) / 1000)
      });
    } else {
      attempt.count++;
    }
  } else {
    attempts[ipStr] = { count: 1, resetTime: Date.now() + RATE_LIMIT_WINDOW };
  }

  // Get the password from the request body
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  // Hash the provided password for comparison
  // Using MD5 here as a simple example - in production use a better algorithm like bcrypt
  const hashedPassword = crypto
    .createHash('md5')
    .update(password)
    .digest('hex');

  // Check if passwords match
  if (hashedPassword === ADMIN_PASSWORD_HASH) {
    // Reset attempts on successful login
    if (attempts[ipStr]) {
      attempts[ipStr].count = 0;
    }

    // Create a session token (in a real app, use a JWT or a secure random token)
    const sessionToken = crypto.randomBytes(32).toString('hex');
    
    // Store this token securely (in a real app, use a database)
    // For simplicity, we're not implementing full token storage/validation here
    
    // Set a secure HTTP-only cookie
    res.setHeader('Set-Cookie', cookie.serialize('admin_token', sessionToken, {
      httpOnly: true,            // Prevents JavaScript access
      secure: process.env.NODE_ENV === 'production',  // Only send over HTTPS in production
      sameSite: 'strict',        // Prevents CSRF attacks
      maxAge: 3600,              // 1 hour
      path: '/',                 // Available across the site
    }));

    return res.status(200).json({ success: true });
  } else {
    // Failed login attempt
    return res.status(401).json({ message: 'Invalid password' });
  }
}