import pool from './pool';

let authTableCreated = false;

export async function createAuthTable() {
    if (authTableCreated) return;
    await pool.query(`
        CREATE TABLE IF NOT EXISTS authentications (
            id SERIAL PRIMARY KEY,
            discord_id VARCHAR(64) NOT NULL,
            authenticated_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
    `);
    authTableCreated = true;
}

export async function logAuth(discordId: string) {
    await createAuthTable();
    await pool.query(
        `INSERT INTO authentications (discord_id, authenticated_at) VALUES ($1, NOW())`,
        [discordId]
    );
}

export async function getAuthLogs(discordId: string) {
    await createAuthTable();
    const result = await pool.query(
        `SELECT * FROM authentications WHERE discord_id = $1 ORDER BY authenticated_at DESC`,
        [discordId]
    );
    return result.rows;
}
