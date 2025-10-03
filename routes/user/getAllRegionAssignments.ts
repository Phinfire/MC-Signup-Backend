import express, { Request, Response } from 'express';
import { authenticateToken } from '../../middleware/auth';
import { getAssignmentForUser } from '../../middleware/assignments';
import { getAllAssignments } from '../../db/assignments';

const router = express.Router();

router.get('/', authenticateToken, async (req: Request, res: Response) => {
    try {
        const assignments = await getAllAssignments();
        if (assignments.length === 0) {
            return res.status(204).send();
        }
        res.json({ assignments: assignments });
    } catch (err) {
        return res.status(500).json({ error: 'Internal error', details: err instanceof Error ? err.message : err });
    }
});

export default router;