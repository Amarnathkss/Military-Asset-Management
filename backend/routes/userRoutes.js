import express from "express";

import { authenticateToken } from "../middlewares/authMiddleware.js";

import { authorizeRoles } from "../middlewares/rbacMiddleware.js";

const router = express.Router();

router.get(
    "/me",
    authenticateToken,
    (req, res) => {
        res.json({
            message: "Authenticated successfully.",
            user: req.user,
        });
    }
);

router.get(
    "/admin-test",
    authenticateToken,
    authorizeRoles("ADMIN"),
    (req, res) => {
        res.json({
            message: "You have ADMIN access.",
        });
    }
);

export default router;