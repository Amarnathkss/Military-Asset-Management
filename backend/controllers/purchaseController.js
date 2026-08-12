import pool from "../config/db.js";

export const createPurchase = async (req, res) => {
    const client = await pool.connect();

    try {
        const {
            baseId,
            equipmentTypeId,
            quantity,
        } = req.body;

        if (!baseId || !equipmentTypeId || !quantity) {
            return res.status(400).json({
                message: "baseId, equipmentTypeId and quantity are required.",
            });
        }

        if (quantity <= 0) {
            return res.status(400).json({
                message: "Quantity must be greater than zero.",
            });
        }

        await client.query("BEGIN");

        const purchaseResult = await client.query(
            `
            INSERT INTO purchases
                (base_id, equipment_type_id, quantity, created_by)
            VALUES
                ($1, $2, $3, $4)
            RETURNING id, base_id, equipment_type_id, quantity;
            `,
            [
                baseId,
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
                ($1, 'PURCHASE', $2);
            `,
            [
                req.user.userId,
                `Purchased ${quantity} units of equipment type ${equipmentTypeId} for base ${baseId}.`,
            ]
        );

        await client.query("COMMIT");

        return res.status(201).json({
            message: "Purchase recorded successfully.",
            purchase: purchaseResult.rows[0],
        });
    } catch (error) {
        await client.query("ROLLBACK");

        console.error("Purchase error:", error);

        return res.status(500).json({
            message: "Failed to record purchase.",
        });
    } finally {
        client.release();
    }
};

export const getPurchases = async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT
                p.id,
                p.base_id,
                p.equipment_type_id,
                p.quantity,
                p.created_at
            FROM purchases p
            ORDER BY p.created_at DESC;
            `
        );

        return res.status(200).json({
            purchases: result.rows,
        });
    } catch (error) {
        console.error("Get purchases error:", error);

        return res.status(500).json({
            message: "Failed to fetch purchase history.",
        });
    }
};