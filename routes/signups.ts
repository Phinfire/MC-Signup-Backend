import express, { Request, Response } from 'express';
import { getPickCounts, getAllSignups } from '../db/registrations';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const counts = await getPickCounts();
        res.json({ counts });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

export default router;