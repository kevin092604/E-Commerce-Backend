import { Router } from "express";
import { getReviews, createReview, deleteReview } from "../controllers/reviews.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router({ mergeParams: true });

router.get("/", getReviews);
router.post("/", authMiddleware, createReview);
router.delete("/:id", authMiddleware, deleteReview);

export default router;
