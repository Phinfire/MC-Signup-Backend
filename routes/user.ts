import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return res.status(401).json({ error: 'Missing or invalid Authorization header' });
		}
		const token = authHeader.slice(7);
		let payload: any;
		try {
			payload = jwt.verify(token, JWT_SECRET);
		} catch (err) {
			return res.status(401).json({ error: 'Invalid or expired token' });
		}
		const discordId = payload.discordId;
		if (!discordId) {
			return res.status(400).json({ error: 'Token missing discordId' });
		}
		// Fetch user info from Discord
		// Note: You need an access token to fetch user info from Discord API. If you want to avoid this, you can return just the discordId.
		// For demonstration, just return the discordId from the token.
		res.json({ discordId });
	} catch (err) {
		return res.status(500).json({ error: 'Internal error', details: err instanceof Error ? err.message : err });
	}
});

export default router;