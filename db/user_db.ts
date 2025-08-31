import pool from './pool';

let userTableHasBeenCreated = false;

export async function createUsersTable() {
	if (userTableHasBeenCreated) return;
	await pool.query(`
		CREATE TABLE IF NOT EXISTS discord_users (
			discord_id VARCHAR(32) PRIMARY KEY,
			user_json JSONB NOT NULL
		);
	`);
	userTableHasBeenCreated = true;
}

export async function insertDiscordUser(discordId: string, userJson: object) {
    await createUsersTable();
		await pool.query(
			`INSERT INTO discord_users (discord_id, user_json)
			 VALUES ($1, $2)
			 ON CONFLICT (discord_id) DO UPDATE SET user_json = EXCLUDED.user_json;`,
			[discordId, userJson]
		);
}

export async function getDiscordUser(discordId: string): Promise<object | null> {
    const result = await pool.query(
        `SELECT user_json FROM discord_users WHERE discord_id = $1;`,
        [discordId]
    );
    return result.rows[0]?.user_json || null;
}
