import express, { Request, Response } from 'express';
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import { CLIENT_ID, CLIENT_SECRET, JWT_SECRET } from '../config';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    const { code, redirectUri }: { code?: string; redirectUri?: string } = req.body;
    if (!code || !redirectUri) {
        return res.status(400).json({ error: 'Missing code or redirectUri' });
    }

    const tokenResp = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
            scope: 'identify'
        })
    });
    if (!tokenResp.ok) {
        return res.status(401).json({ error: 'Token exchange failed' });
    }
    const tokenData = (await tokenResp.json()) as { access_token: string };
    const userResp = await fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    if (!userResp.ok) {
        return res.status(401).json({ error: 'User fetch failed' });
    }
    const user = await userResp.json() as { id: string };
    const discordId = user.id;
    const token = jwt.sign({ discordId }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ user, token });
});

export default router;
