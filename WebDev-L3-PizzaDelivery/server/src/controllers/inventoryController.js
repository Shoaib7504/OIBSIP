import Inventory from "../models/Inventory.js";

//get all inventory items
export const getAllInventory=async(req,res,next)=>{
    try {
        const inventory=await Inventory.find().sort({
            category:1,
            name:1
        });
        res.status(200).json({
            success:true,
            count:inventory.length,
            data:inventory
        })
    } catch (error) {
        next(error)
    }
}

//Update inventory stock and threshold
export const updateInventoryItem = async (req, res, next) => {
  try {
    const { stock, threshold } = req.body;

    if (stock === undefined && threshold === undefined) {
      return res.status(400).json({
        success: false,
        message: "Stock or threshold is required",
      });
    }

    const updates = {}

    if (stock !== undefined) {
      if (!Number.isFinite(stock) || stock < 0) {
        return res.status(400).json({
          success: false,
          message: "Stock must be a non-negative number",
        });
      }

      updates.stock = stock
    }

    if (threshold !== undefined) {
      if (!Number.isFinite(threshold) || threshold < 0) {
        return res.status(400).json({
          success: false,
          message: "Threshold must be a non-negative number",
        });
      }

      updates.threshold = threshold
    }

    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Inventory updated successfully",
      data: item,
    });
  } catch (error) {
    next(error);
  }
};