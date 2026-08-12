import express from "express";

import { createExpenditure } from "../controllers/expenditureController.js";

import { authenticateToken } from "../middlewares/authMiddleware.js";

import { authorizeRoles, enforceRequestBase } from "../middlewares/rbacMiddleware.js";

const router = express.Router();

router.post(
    "/",
    authenticateToken,
    authorizeRoles("ADMIN", "BASE_COMMANDER"),
    enforceRequestBase,
    createExpenditure
);

export default router;