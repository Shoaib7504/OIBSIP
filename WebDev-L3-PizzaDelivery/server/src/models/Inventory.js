import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            required: true,
            enum: [
                "Pizza Bases",
                "Sauces",
                "Cheeses",
                "Vegetables",
                "Meats",
            ],
        },

        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },

        threshold: {
            type: Number,
            required: true,
            min: 0,
            default: 20,
        },
        lowStockAlertSent: {
            type: Boolean,
            default: false,
        },
        unit: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate inventory items
inventorySchema.index(
    { name: 1, category: 1 },
    { unique: true }
);

export default mongoose.model("Inventory", inventorySchema);