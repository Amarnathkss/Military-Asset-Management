import pool from "../config/db.js";

export const getDashboardMetrics = async (req, res) => {
    try {
        let {
            baseId,
            equipmentTypeId,
            startDate,
            endDate,
        } = req.query;

        // Base Commanders can only see their own base
        if (req.user.role === "BASE_COMMANDER") {
            baseId = req.user.baseId;
        }

        const params = [];
        let paramIndex = 1;

        const addParam = (value) => {
            params.push(value);
            return `$${paramIndex++}`;
        };

        const baseCondition = baseId
            ? `AND base_id = ${addParam(baseId)}`
            : "";

        const equipmentCondition = equipmentTypeId
            ? `AND equipment_type_id = ${addParam(equipmentTypeId)}`
            : "";

        const startCondition = startDate
            ? `AND created_at >= ${addParam(startDate)}`
            : "";

        const endCondition = endDate
            ? `AND created_at <= ${addParam(endDate)}`
            : "";

        const result = await pool.query(
            `
            WITH purchase_summary AS (
                SELECT COALESCE(SUM(quantity), 0) AS purchases
                FROM purchases
                WHERE 1=1
                ${baseCondition}
                ${equipmentCondition}
                ${startCondition}
                ${endCondition}
            ),

            transfer_in_summary AS (
                SELECT COALESCE(SUM(quantity), 0) AS transfers_in
                FROM transfers
                WHERE status = 'COMPLETED'
                ${baseId
                ? `AND destination_base_id = ${addParam(baseId)}`
                : ""}
                ${equipmentTypeId
                ? `AND equipment_type_id = ${addParam(equipmentTypeId)}`
                : ""}
                ${startDate
                ? `AND created_at >= ${addParam(startDate)}`
                : ""}
                ${endDate
                ? `AND created_at <= ${addParam(endDate)}`
                : ""}
            ),

            transfer_out_summary AS (
                SELECT COALESCE(SUM(quantity), 0) AS transfers_out
                FROM transfers
                WHERE status = 'COMPLETED'
                ${baseId
                ? `AND source_base_id = ${addParam(baseId)}`
                : ""}
                ${equipmentTypeId
                ? `AND equipment_type_id = ${addParam(equipmentTypeId)}`
                : ""}
                ${startDate
                ? `AND created_at >= ${addParam(startDate)}`
                : ""}
                ${endDate
                ? `AND created_at <= ${addParam(endDate)}`
                : ""}
            ),

            assignment_summary AS (
                SELECT COALESCE(SUM(quantity), 0) AS assigned
                FROM assignments
                WHERE 1=1
                ${baseCondition}
                ${equipmentCondition}
                ${startCondition}
                ${endCondition}
            ),

            expenditure_summary AS (
                SELECT COALESCE(SUM(quantity), 0) AS expended
                FROM expenditures
                WHERE 1=1
                ${baseCondition}
                ${equipmentCondition}
                ${startCondition}
                ${endCondition}
            )

            SELECT
                purchases,
                transfers_in,
                transfers_out,
                assigned,
                expended,

                (
                    purchases
                    + transfers_in
                    - transfers_out
                ) AS net_movement,

                (
                    purchases
                    + transfers_in
                    - transfers_out
                    - assigned
                    - expended
                ) AS closing_balance

            FROM purchase_summary,
                 transfer_in_summary,
                 transfer_out_summary,
                 assignment_summary,
                 expenditure_summary;
            `,
            params
        );

        const metrics = result.rows[0];

        return res.status(200).json({
            openingBalance: 0,
            purchases: Number(metrics.purchases),
            transfersIn: Number(metrics.transfers_in),
            transfersOut: Number(metrics.transfers_out),
            netMovement: Number(metrics.net_movement),
            assigned: Number(metrics.assigned),
            expended: Number(metrics.expended),
            closingBalance: Number(metrics.closing_balance),
        });
    } catch (error) {
        console.error("Dashboard metrics error:", error);

        return res.status(500).json({
            message: "Failed to calculate dashboard metrics.",
        });
    }
};