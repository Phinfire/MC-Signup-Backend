import express, { Request, Response } from 'express';
import { removeSignup } from '../../db/registrations';
import { removeAssignment } from '../../db/assignments';
import { requireAdminAuth } from '../../middleware/auth';

const router = express.Router();

router.delete('/', requireAdminAuth, async (req: Request, res: Response) => {
    try {
        const { discordId } = req.body;
        if (!discordId) {
            return res.status(400).json({ error: 'Missing discordId' });
        }
        if (typeof discordId !== 'string') {
            return res.status(400).json({ error: 'discordId must be a string' });
        }
        const removed = await removeSignup(discordId);
        if (removed) {
            await removeAssignment(discordId);
            res.json({ success: true, message: 'Signup and associated assignment removed successfully' });
        } else {
            res.status(404).json({ error: 'No signup found for the specified discordId' });
        }
    } catch (err) {
        console.error('Error removing signup:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

export default router;
