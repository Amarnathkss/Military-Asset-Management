import pool from "../config/db.js";
import { getAvailableQuantity } from "../services/inventoryService.js";

export const createExpenditure = async (req, res) => {
    const client = await pool.connect();

    try {
        const {
            baseId,
            equipmentTypeId,
            quantity,
            reason,
        } = req.body;

        if (
            !baseId ||
            !equipmentTypeId ||
            !quantity
        ) {
            return res.status(400).json({
                message:
                    "baseId, equipmentTypeId and quantity are required.",
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
            INSERT INTO expenditures
                (
                    base_id,
                    equipment_type_id,
                    quantity,
                    reason,
                    recorded_by
                )
            VALUES
                ($1, $2, $3, $4, $5)
            RETURNING *;
            `,
            [
                baseId,
                equipmentTypeId,
                quantity,
                reason || null,
                req.user.userId,
            ]
        );

        await client.query(
            `
            INSERT INTO audit_logs
                (user_id, action, details)
            VALUES
                ($1, 'EXPENDITURE', $2);
            `,
            [
                req.user.userId,
                `Expended ${quantity} units of equipment type ${equipmentTypeId} at base ${baseId}. Reason: ${reason || "Not specified"}.`,
            ]
        );

        await client.query("COMMIT");

        return res.status(201).json({
            message: "Expenditure recorded successfully.",
            expenditure: result.rows[0],
        });
    } catch (error) {
        await client.query("ROLLBACK");

        console.error("Expenditure error:", error);

        return res.status(500).json({
            message: "Failed to record expenditure.",
        });
    } finally {
        client.release();
    }
};