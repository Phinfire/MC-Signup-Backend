import pool from './pool';
import { StartAssignment } from '../entities/StartAssignment';

export async function createAssignmentsTable() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS start_assignments (
            discord_id VARCHAR(32) PRIMARY KEY,
            region_key TEXT NOT NULL,
            start_key TEXT,
            start_data JSONB
        );
    `);
}

export async function getAllAssignments(): Promise<StartAssignment[]> {
    await createAssignmentsTable();
    const result = await pool.query('SELECT * FROM start_assignments');
    return result.rows.map(row => ({
        discord_id: row.discord_id,
        region_key: row.region_key,
        start_key: row.start_key,
        start_data: row.start_data
    }));
}

function createAssignmentFor(discordId: string, regionKey: string, startKey: string | null, startData: object | null) {
    return pool.query(
        'INSERT INTO start_assignments (discord_id, region_key, start_key, start_data) VALUES ($1, $2, $3, $4)',
        [discordId, regionKey, startKey, startData]
    );
}

function updateAssignedRegion(discordId: string, regionKey: string) {
    return pool.query(
        'UPDATE start_assignments SET region_key = $1 WHERE discord_id = $2',
        [regionKey, discordId]
    );
}

export async function setStartingPosition(discordId: string, startKey: string, startData: object) {
    await createAssignmentsTable();
    await pool.query(
        'UPDATE start_assignments SET start_key = $1, start_data = $2 WHERE discord_id = $3',
        [startKey, startData, discordId]
    );
}

export async function updateAssignments(assignments: StartAssignment[]) {
    for (const assignment of assignments) {
        await pool.query(
            `INSERT INTO start_assignments (discord_id, region_key, start_key)
             VALUES ($1, $2, $3)
             ON CONFLICT (discord_id)
             DO UPDATE SET region_key = EXCLUDED.region_key, start_key = EXCLUDED.start_key`,
            [assignment.discord_id, assignment.region_key, assignment.start_key]
        );
    }
}

export async function removeAssignment(discordId: string): Promise<boolean> {
    await createAssignmentsTable();
    const result = await pool.query(
        'DELETE FROM start_assignments WHERE discord_id = $1',
        [discordId]
    );
    return result.rowCount !== null && result.rowCount > 0;
}