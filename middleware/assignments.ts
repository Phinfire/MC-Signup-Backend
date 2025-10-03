import { getAllAssignments } from '../db/assignments';
import pool from '../db/pool';
import { getAllSignups } from '../db/registrations';
import { StartAssignment } from '../entities/StartAssignment';

export async function getAssignmentsForAllSignedUpUsers() {
    const allSignups = await getAllSignups();
    const allAssignments = await getAllAssignments();

    const result: { discord_id: string; region_key: string | null; province_key: string | null }[] = [];
    for (const signup of allSignups) {
        const userAssignments = allAssignments.filter(assignment => assignment.discord_id === signup.discord_id);
        if (userAssignments.length) {
            const assignment = userAssignments[0];
            result.push({
                discord_id: signup.discord_id,
                region_key: assignment.region_key,
                province_key: assignment.start_key,
            });
        } else {
            result.push({
                discord_id: signup.discord_id,
                region_key: null,
                province_key: null
            });
        }
    }
    return result;
}

export async function getAssignmentForUser(discordId: string) {
    const allAssignments = await getAllAssignments();
    const assignments = allAssignments.filter(assignment => assignment.discord_id === discordId);
    return assignments.length > 0 ? assignments[0] : null;
}