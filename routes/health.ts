import express, { Request, Response } from 'express';
import pool from '../db/pool';
import { createSignupsTable } from '../db/registrations';

const router = express.Router();

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
    res.status(200).json({
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        db_up,
        num_signups
    });
});

export default router;
