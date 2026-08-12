import pool from "../config/db.js";
import { getAvailableQuantity } from "../services/inventoryService.js";

export const createAssignment = async (req, res) => {
    const client = await pool.connect();

    try {
        const {
            baseId,
            equipmentTypeId,
            personnelName,
            quantity,
        } = req.body;

        if (
            !baseId ||
            !equipmentTypeId ||
            !personnelName ||
            !quantity
        ) {
            return res.status(400).json({
                message:
                    "baseId, equipmentTypeId, personnelName and quantity are required.",
            });
        }

        if (quantity <= 0) {
            return res.status(400).json({
                message: "Quantity must be greater than zero.",
            });
        }

        await client.query("BEGIN");

        const availableQuantity = await getAvailableQuantity(
            client,
            baseId,
            equipmentTypeId
        );

        if (availableQuantity < quantity) {
            await client.query("ROLLBACK");

            return res.status(400).json({
                message: "Insufficient available inventory.",
                availableQuantity,
                requestedQuantity: quantity,
            });
        }

        const result = await client.query(
            `
            INSERT INTO assignments
                (
                    base_id,
                    equipment_type_id,
                    personnel_name,
                    quantity,
                    assigned_by
                )
            VALUES
                ($1, $2, $3, $4, $5)
            RETURNING *;
            `,
            [
                baseId,
                equipmentTypeId,
                personnelName,
                quantity,
                req.user.userId,
            ]
        );

        await client.query(
            `
            INSERT INTO audit_logs
                (user_id, action, details)
            VALUES
                ($1, 'ASSIGNMENT', $2);
            `,
            [
                req.user.userId,
                `Assigned ${quantity} units of equipment type ${equipmentTypeId} to ${personnelName} at base ${baseId}.`,
            ]
        );

        await client.query("COMMIT");

        return res.status(201).json({
            message: "Assignment recorded successfully.",
            assignment: result.rows[0],
        });
    } catch (error) {
        await client.query("ROLLBACK");

        console.error("Assignment error:", error);

        return res.status(500).json({
            message: "Failed to record assignment.",
        });
    } finally {
        client.release();
    }
};