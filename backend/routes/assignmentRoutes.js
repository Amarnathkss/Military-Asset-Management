import express from "express";

import { createAssignment } from "../controllers/assignmentController.js";

import { authenticateToken } from "../middlewares/authMiddleware.js";

import { authorizeRoles, enforceRequestBase } from "../middlewares/rbacMiddleware.js";

const router = express.Router();

router.post(
    "/",
    authenticateToken,
    authorizeRoles("ADMIN", "BASE_COMMANDER"),
    enforceRequestBase,
    createAssignment
);

export default router;