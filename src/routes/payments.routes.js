import { Router } from "express";
import { authMiddleware as authenticate } from "../middleware/auth.js";
import { createPaymentIntent } from "../controllers/payments.controller.js";

const router = Router();

router.post("/create-intent", authenticate, createPaymentIntent);

export default router;
