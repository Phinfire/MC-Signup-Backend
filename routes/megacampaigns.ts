import express, { Request, Response } from 'express';
import { requireAdminAuth } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';
import { getAllMegacampaigns, createMegacampaign, MegaCampaign } from '../db/megacampaigns';

const router = express.Router();

/**
 * GET /api/megacampaigns
 * Get all megacampaigns (public access)
 */
router.get('/', asyncHandler(async (req: Request, res: Response) => {
    const campaigns = await getAllMegacampaigns();
    res.json(campaigns);
}));

/**
 * POST /api/megacampaigns
 * Create a new megacampaign (admin only)
 */
router.post('/', requireAdminAuth, asyncHandler(async (req: Request, res: Response) => {
    const { name, regionDeadlineDate, startDeadlineDate, firstSessionDate, firstEu4Session } = req.body;

    if (!name || !regionDeadlineDate || !startDeadlineDate || !firstSessionDate) {
        return res.status(400).json({ error: 'Missing required fields: name, regionDeadlineDate, startDeadlineDate, firstSessionDate' });
    }

    const newCampaign: MegaCampaign = {
        id: Date.now().toString(),
        name,
        regionDeadlineDate,
        startDeadlineDate,
        firstSessionDate,
        firstEu4Session: firstEu4Session || null
    };

    const savedCampaign = await createMegacampaign(newCampaign);
    res.status(201).json(savedCampaign);
}));

export default router;
