import express from "express";

import { createPurchase, getPurchases } from "../controllers/purchaseController.js";

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

router.get(
    "/",
    authenticateToken,
    authorizeRoles(
        "ADMIN",
        "LOGISTICS_OFFICER"
    ),
    getPurchases
);

export default router;