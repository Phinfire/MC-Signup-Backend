import express, { Request, Response } from 'express';
import { authenticateToken } from '../../middleware/auth';
import { getAssignmentForUser } from '../../middleware/assignments';

const router = express.Router();

router.get('/', authenticateToken, async (req: Request, res: Response) => {
    const discordId = req.user!.discordId;
    try {
        const picks = await getAssignmentForUser(discordId);
        const assignment = await getAssignmentForUser(discordId);
        if (!picks) {
            return res.status(400).json({ error: 'No picks found for user.' });
        }
        if (!assignment) {
            return res.status(204).json({ error: 'No assignment found for user.' });
        }
        res.json({ assignment });
    } catch (err) {
        return res.status(500).json({ error: 'Internal error', details: err instanceof Error ? err.message : err });
    }
});

export default router;