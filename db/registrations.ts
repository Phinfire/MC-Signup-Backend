import pool from './pool';

export async function createRegistrationsTable() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS registrations (
            discord_id VARCHAR(32) NOT NULL,
            pick VARCHAR(128) NOT NULL,
            PRIMARY KEY (discord_id, pick)
        );
    `);
}

export async function updateRegistration(user: string, picks: string[]) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        for (const pick of picks) {
            await client.query(
                'INSERT INTO registrations (discord_id, pick) VALUES ($1, $2) ON CONFLICT DO NOTHING',
                [user, pick]
            );
        }
        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

export async function getPickCounts() {
    const result = await pool.query('SELECT pick, COUNT(*) as count FROM registrations GROUP BY pick');
    const counts: Record<string, number> = {};
    result.rows.forEach(row => {
        counts[row.pick] = Number(row.count);
    });
    return counts;
}
