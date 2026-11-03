import { Router } from "express";
import { getAllInventory, updateInventoryItem } from "../controllers/inventoryController.js";
import {protect,adminOnly,} from "../middleware/authMiddleware.js";

const router = Router();

// Admin-only inventory routes
router.use(protect, adminOnly);

router.get("/", getAllInventory);
router.patch("/:id", updateInventoryItem );

export default router;