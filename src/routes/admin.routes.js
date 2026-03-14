import { Router } from "express";
import { getStats, getAllOrders, updateOrderStatus, getAllUsers, updateUserRole } from "../controllers/admin.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { adminMiddleware } from "../middleware/admin.js";

const router = Router();

router.use(authMiddleware, adminMiddleware);
router.get("/stats", getStats);
router.get("/orders", getAllOrders);
router.patch("/orders/:id/status", updateOrderStatus);
router.get("/users", getAllUsers);
router.patch("/users/:id/role", updateUserRole);

export default router;
