import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { updateRegistration } from '../db/registrations';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    const { token, picks } = req.body;
    if (!token || !picks) {
        return res.status(400).json({ error: 'Missing token or picks' });
    }
    let payload;
    try {
        payload = jwt.verify(token, JWT_SECRET) as { discordId: string };
    } catch {
        return res.status(401).json({ error: 'Invalid token' });
    }
    const discordId = payload.discordId;
    await updateRegistration(discordId, picks);
    res.json({ success: true, discordId, picks });
});

export default router;
