import { Router } from "express";
import { getWishlist, addToWishlist, removeFromWishlist } from "../controllers/users.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.use(authMiddleware);
router.get("/me/wishlist", getWishlist);
router.post("/me/wishlist", addToWishlist);
router.delete("/me/wishlist/:productId", removeFromWishlist);

export default router;
