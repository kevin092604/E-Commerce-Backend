import { Router } from "express";
import { createOrder, getMyOrders, getOrder } from "../controllers/orders.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.use(authMiddleware);
router.post("/", createOrder);
router.get("/", getMyOrders);
router.get("/:id", getOrder);

export default router;
