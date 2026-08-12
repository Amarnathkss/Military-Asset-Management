import express from "express";

import { createPurchase } from "../controllers/purchaseController.js";

import { authenticateToken } from "../middlewares/authMiddleware.js";

import { authorizeRoles } from "../middlewares/rbacMiddleware.js";

const router = express.Router();

router.post(
    "/",
    authenticateToken,
    authorizeRoles(
        "ADMIN",
        "LOGISTICS_OFFICER"
    ),
    createPurchase
);

export default router;