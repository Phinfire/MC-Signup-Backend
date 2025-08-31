import express, { Request, Response } from 'express';
import { getAllSignups } from '../db/registrations';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.get('/admin/signups', async (req: Request, res: Response) => {
    const masterPw = process.env.MASTER_PW;
    const providedPw = req.headers['x-master-pw'] || req.query.masterpw;
    if (!providedPw || providedPw !== masterPw) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const signups = await getAllSignups();
        res.json({ signups });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

export default router;
