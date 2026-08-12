import pool from "../config/db.js";

export const getAuditLogs = async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT
                al.id,
                al.user_id,
                u.username,
                u.role,
                al.action,
                al.details,
                al.created_at
            FROM audit_logs al
            LEFT JOIN users u
                ON u.id = al.user_id
            ORDER BY al.created_at DESC;
            `
        );

        return res.status(200).json({
            logs: result.rows,
        });
    } catch (error) {
        console.error("Get audit logs error:", error);

        return res.status(500).json({
            message: "Failed to fetch audit logs.",
        });
    }
};