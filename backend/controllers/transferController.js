import pool from "../config/db.js";
import { getAvailableQuantity } from "../services/inventoryService.js";

export const createTransfer = async (req, res) => {
    const client = await pool.connect();

    try {
        const {
            sourceBaseId,
            destinationBaseId,
            equipmentTypeId,
            quantity,
        } = req.body;

        if (
            !sourceBaseId ||
            !destinationBaseId ||
            !equipmentTypeId ||
            !quantity
        ) {
            return res.status(400).json({
                message: "All transfer fields are required.",
            });
        }

        if (sourceBaseId === destinationBaseId) {
            return res.status(400).json({
                message: "Source and destination bases must be different.",
            });
        }

        if (quantity <= 0) {
            return res.status(400).json({
                message: "Quantity must be greater than zero.",
            });
        }

        await client.query("BEGIN");

        /*
         * Serialize transfers involving this base/equipment combination.
         * This helps prevent concurrent transfers from spending
         * the same available stock.
         */
        await client.query(
            `SELECT pg_advisory_xact_lock(hashtext($1))`,
            [`${sourceBaseId}:${equipmentTypeId}`]
        );

        const availableQuantity = await getAvailableQuantity(
            client,
            sourceBaseId,
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

        const transferResult = await client.query(
            `
            INSERT INTO transfers
                (
                    source_base_id,
                    destination_base_id,
                    equipment_type_id,
                    quantity,
                    status,
                    initiated_by
                )
            VALUES
                ($1, $2, $3, $4, 'COMPLETED', $5)
            RETURNING *;
            `,
            [
                sourceBaseId,
                destinationBaseId,
                equipmentTypeId,
                quantity,
                req.user.userId,
            ]
        );

        await client.query(
            `
            INSERT INTO audit_logs
                (user_id, action, details)
            VALUES
                ($1, 'TRANSFER', $2);
            `,
            [
                req.user.userId,
                `Transferred ${quantity} units of equipment type ${equipmentTypeId} from base ${sourceBaseId} to base ${destinationBaseId}.`,
            ]
        );

        await client.query("COMMIT");

        return res.status(201).json({
            message: "Transfer completed successfully.",
            transfer: transferResult.rows[0],
        });
    } catch (error) {
        await client.query("ROLLBACK");

        console.error("Transfer error:", error);

        return res.status(500).json({
            message: "Transfer failed.",
        });
    } finally {
        client.release();
    }
};