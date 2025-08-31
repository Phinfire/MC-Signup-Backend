import express, { Request, Response } from 'express';
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import { CLIENT_ID, CLIENT_SECRET, JWT_SECRET } from '../config';
import { logAuth } from '../db/auth_logs';
import { insertDiscordUser } from '../db/user_db';

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
    try {
        const { code, redirectUri }: { code?: string; redirectUri?: string } = req.body;

        if (!code || !redirectUri) {
            return res.status(400).json({ error: "Missing code or redirectUri" });
        }
        const tokenResp = await fetch("https://discord.com/api/oauth2/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: "authorization_code",
                code,
                redirect_uri: redirectUri,
            }),
        });
        if (!tokenResp.ok) {
            const errText = await tokenResp.text();
            return res.status(401).json({ error: "Token exchange failed", details: errText });
        }
        const tokenData = (await tokenResp.json()) as { access_token?: string };
        if (!tokenData.access_token) {
            return res.status(401).json({ error: "No access token in response" });
        }
        const discordUserResp = await fetch("https://discord.com/api/users/@me", {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });
        if (!discordUserResp.ok) {
            const errText = await discordUserResp.text();
            return res.status(401).json({ error: "User fetch failed", details: errText });
        }
        const user = (await discordUserResp.json()) as { id?: string };
        if (!user.id) {
            return res.status(401).json({ error: "No user id in response" });
        }
        await logAuth(user.id);
        await insertDiscordUser(user.id, user);
        let token: string;
        try {
            token = jwt.sign({ discordId: user.id }, JWT_SECRET, { expiresIn: "30d" });
        } catch (err) {
            return res.status(500).json({ error: "JWT signing failed" });
        }
        res.json({ user, token });
    } catch (err) {
        return res.status(500).json({
            error: "Internal error",
            details: err instanceof Error ? err.message : err,
        });
    }
});

export default router;