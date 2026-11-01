import { Router } from "express";
import { createOrder, getAllOrders, getMyOrders, getOrderById, updateOrderStatus } from "../controllers/orderController.js";
import { protect,adminOnly } from "../middleware/authMiddleware.js";
const router = Router();

// Customer and Admin
router.post("/", protect, createOrder);

// Admin only
router.get("/", protect, adminOnly, getAllOrders);
// get logged in user orders
router.get("/my-orders", protect, getMyOrders);
router.patch("/:id/status", protect, adminOnly, updateOrderStatus);

// Logged-in users
router.get("/:id", protect, getOrderById);



export default router;
