import { NextApiRequest, NextApiResponse } from 'next';

// CORS middleware
export function corsMiddleware(req: NextApiRequest, res: NextApiResponse, next: () => void) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  next();
}

// Rate limiting middleware (basic implementation)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function rateLimitMiddleware(
  limit: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
) {
  return (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    const key = Array.isArray(ip) ? ip[0] : ip;
    
    const now = Date.now();
    const windowStart = now - windowMs;
    
    const record = requestCounts.get(key);
    
    if (!record || record.resetTime < windowStart) {
      requestCounts.set(key, { count: 1, resetTime: now + windowMs });
      next();
      return;
    }
    
    if (record.count >= limit) {
      res.status(429).json({ error: 'Too many requests' });
      return;
    }
    
    record.count++;
    next();
  };
}

// Content-Type middleware
export function contentTypeMiddleware(req: NextApiRequest, res: NextApiResponse, next: () => void) {
  // Set default content type for API responses
  if (!res.getHeader('Content-Type')) {
    res.setHeader('Content-Type', 'application/json');
  }
  
  next();
}

// Compose multiple middlewares
export function composeMiddlewares(...middlewares: Array<(req: NextApiRequest, res: NextApiResponse, next: () => void) => void>) {
  return (req: NextApiRequest, res: NextApiResponse, handler: () => Promise<void>) => {
    let index = 0;
    
    function next(): void {
      if (index >= middlewares.length) {
        handler();
        return;
      }
      
      const middleware = middlewares[index++];
      middleware(req, res, next);
    }
    
    next();
  };
}
