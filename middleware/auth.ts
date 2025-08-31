import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

declare global {
    namespace Express {
        interface Request {
            user?: {
                discordId: string;
            };
        }
    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }
    const token = authHeader.substring(7);
    try {
        const payload = jwt.verify(token, JWT_SECRET) as { discordId: string };
        req.user = { discordId: payload.discordId };
        next();
    } catch {
        return res.status(401).json({ error: 'Invalid token' });
    }
};
