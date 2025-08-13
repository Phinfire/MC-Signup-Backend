import express, { Request, Response } from 'express';
import pool from '../db/pool';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    let db_up = false;
    try {
        const client = await pool.connect();
        client.release();
        db_up = true;
    } catch {
        db_up = false;
    }
    res.status(200).json({
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        db_up
    });
});

export default router;
