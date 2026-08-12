import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate request
        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required.",
            });
        }

        // Find user
        const result = await pool.query(
            `
            SELECT
                id,
                username,
                password_hash,
                role,
                base_id
            FROM users
            WHERE username = $1
            `,
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid username or password.",
            });
        }

        const user = result.rows[0];

        // Compare entered password with stored bcrypt hash
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid username or password.",
            });
        }

        // Create JWT
        const token = jwt.sign(
            {
                userId: user.id,
                role: user.role,
                baseId: user.base_id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "1d",
            }
        );

        return res.status(200).json({
            message: "Login successful.",
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                baseId: user.base_id,
            },
        });
    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Internal server error.",
        });
    }
};