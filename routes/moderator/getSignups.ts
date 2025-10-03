import express, { Request, Response } from 'express';
import { getAllSignups } from '../../db/registrations';
import { requireAdminAuth, requireModeratorAuth } from '../../middleware/auth';

const router = express.Router();

router.get('/', requireModeratorAuth, async (req: Request, res: Response) => {
    try {
        const signups = await getAllSignups(true);
        res.json({ signups });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

export default router;