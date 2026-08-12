import express from "express";

import { createTransfer, getTransfers } from "../controllers/transferController.js";

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
    createTransfer
);

router.get(
    "/",
    authenticateToken,
    authorizeRoles(
        "ADMIN",
        "LOGISTICS_OFFICER"
    ),
    getTransfers
);

export default router;