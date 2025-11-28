import pool from './pool';
import { createMegacampaignsTable, createMegacampaign } from './megacampaigns';

export async function seedMegacampaigns() {
    try {
        await createMegacampaignsTable();
        
        // Check if table already has data
        const result = await pool.query('SELECT COUNT(*) FROM megacampaigns');
        const count = parseInt(result.rows[0].count, 10);
        
        if (count > 0) {
            console.log(`[Seed] Megacampaigns table already has ${count} record(s), skipping seed.`);
            return;
        }

        console.log('[Seed] Seeding megacampaigns table...');

        const campaigns = [
            {
                id: '1',
                name: '2nd',
                regionDeadlineDate: '2025-09-12T23:00:00',
                startDeadlineDate: '2025-09-19T23:59:59',
                firstSessionDate: '2025-09-21T18:30:00',
                firstEu4Session: null
            }
        ];

        for (const campaign of campaigns) {
            await createMegacampaign(campaign);
        }

        console.log('[Seed] Megacampaigns seeded successfully!');
    } catch (err) {
        console.error('[Seed] Error seeding megacampaigns:', err);
    }
}
