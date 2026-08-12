import bcrypt from "bcryptjs";
import pool from "../config/db.js";
import "dotenv/config";

const seedDatabase = async () => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // BASES

        const basesResult = await client.query(`
            INSERT INTO bases (name, location)
            VALUES
                ('Fort Alpha', 'Alpha Region'),
                ('Fort Bravo', 'Bravo Region'),
                ('Fort Charlie', 'Charlie Region')
            ON CONFLICT DO NOTHING
            RETURNING id, name;
        `);

        console.log("Bases:", basesResult.rows);

        // EQUIPMENT TYPES

        const equipmentResult = await client.query(`
            INSERT INTO equipment_types (name, category)
            VALUES
                ('M4 Rifle', 'WEAPON'),
                ('5.56mm Ammunition', 'AMMUNITION'),
                ('Humvee', 'VEHICLE'),
                ('Pistol', 'WEAPON')
            RETURNING id, name;
        `);

        console.log("Equipment:", equipmentResult.rows);

        // Get Fort Alpha ID
        const alphaResult = await client.query(
            `SELECT id FROM bases WHERE name = 'Fort Alpha'`
        );

        const alphaId = alphaResult.rows[0].id;

        // USERS

        const adminPassword = await bcrypt.hash(
            "AdminPass123!",
            10
        );

        const commanderPassword = await bcrypt.hash(
            "CommandPass123!",
            10
        );

        const logisticsPassword = await bcrypt.hash(
            "LogisticsPass123!",
            10
        );

        await client.query(
            `
            INSERT INTO users
                (username, password_hash, role, base_id)
            VALUES
                ($1, $2, 'ADMIN', NULL),
                ($3, $4, 'BASE_COMMANDER', $5),
                ($6, $7, 'LOGISTICS_OFFICER', $5)
            ON CONFLICT (username) DO NOTHING;
            `,
            [
                "admin_user",
                adminPassword,
                "commander_alpha",
                commanderPassword,
                alphaId,
                "logistics_officer",
                logisticsPassword
            ]
        );

        // INITIAL PURCHASE DATA

        const adminResult = await client.query(
            `SELECT id FROM users WHERE username = 'admin_user'`
        );

        const adminId = adminResult.rows[0].id;

        const rifleResult = await client.query(
            `SELECT id FROM equipment_types WHERE name = 'M4 Rifle'`
        );

        const ammoResult = await client.query(
            `SELECT id FROM equipment_types WHERE name = '5.56mm Ammunition'`
        );

        const rifleId = rifleResult.rows[0].id;
        const ammoId = ammoResult.rows[0].id;

        await client.query(
            `
            INSERT INTO purchases
                (base_id, equipment_type_id, quantity, created_by)
            VALUES
                ($1, $2, 100, $3),
                ($1, $4, 1000, $3);
            `,
            [alphaId, rifleId, adminId, ammoId]
        );

        // AUDIT LOG

        await client.query(
            `
            INSERT INTO audit_logs
                (user_id, action, details)
            VALUES
                ($1, 'SEED', 'Initial system data created');
            `,
            [adminId]
        );

        await client.query("COMMIT");

        console.log("Database seeded successfully.");
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Seed failed:", error);
    } finally {
        client.release();
        await pool.end();
    }
};

seedDatabase();