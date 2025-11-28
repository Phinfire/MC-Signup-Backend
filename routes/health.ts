import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../db/pool';
import { createSignupsTable } from '../db/registrations';
import { JWT_SECRET, ADMIN_DISCORD_ID, MODERATOR_IDS } from '../config';

const router = express.Router();

type UserRole = 'admin' | 'moderator' | 'user';

function getUserRole(authHeader?: string): UserRole | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.substring(7);
    try {
        const payload = jwt.verify(token, JWT_SECRET) as { discordId: string };
        const discordId = payload.discordId;
        if (discordId === ADMIN_DISCORD_ID) {
            return 'admin';
        }
        if (MODERATOR_IDS.includes(discordId)) {
            return 'moderator';
        }
        return 'user';
    } catch {
        return null;
    }
}

router.get('/', async (req: Request, res: Response) => {
    let db_up = false;
    let num_signups = 0;
    try {
        await createSignupsTable();
        const client = await pool.connect();
        const result = await client.query('SELECT COUNT(*) FROM signups');
        num_signups = parseInt(result.rows[0].count, 10);
        client.release();
        db_up = true;
    } catch {
        db_up = false;
    }

    const authHeader = req.headers.authorization;
    const userRole = getUserRole(authHeader);

    const response: any = {
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        db_up,
        num_signups
    };
    response.user_role = userRole;

    res.status(200).json(response);
});

export default router;