import express, { Request, Response } from 'express';
import { updateSignup } from '../db/registrations';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticateToken, async (req: Request, res: Response) => {
    const { picks } = req.body;
    if (!picks) {
        return res.status(400).json({ error: 'Missing picks' });
    }
    const discordId = req.user!.discordId;
    try {
        await updateSignup(discordId, picks);
        res.json({ success: true, discordId, picks });
    } catch (err) {
        return res.status(500).json({ error: 'Internal error', details: err instanceof Error ? err.message : err });
    }
});

export default router;