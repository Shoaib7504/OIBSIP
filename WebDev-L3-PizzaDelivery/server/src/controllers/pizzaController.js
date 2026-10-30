import Pizza from "../models/Pizza.js";

// get all pizzas
export const getAllPizzas = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: "i" };

    const pizzas = await Pizza.find(filter).sort({ createdAt: -1 });

    // check if all pizzas in this category are out of stock
    const inStock = pizzas.filter((p) => p.stock > 0);
    const outOfStock = pizzas.filter((p) => p.stock === 0);

    res.json({
      success: true,
      count: pizzas.length,
      inStockCount: inStock.length,
      outOfStockCount: outOfStock.length,
      data: pizzas,
      ...(category && inStock.length === 0 && pizzas.length > 0 && {
        message: `All ${category} pizzas are currently out of stock`,
      }),
    });
  } catch (err) {
    next(err);
  }
};

// get one pizza
export const getPizzaById = async (req, res, next) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    if (!pizza) return res.status(404).json({ success: false, message: "Pizza not found" });
    res.json({ success: true, data: pizza });
  } catch (err) {
    next(err);
  }
};

// create pizza
export const createPizza = async (req, res, next) => {
  try {
    const pizza = await Pizza.create(req.body);
    res.status(201).json({ success: true, data: pizza });
  } catch (err) {
    next(err);
  }
};

// update pizza
export const updatePizza = async (req, res, next) => {
  try {
    const pizza = await Pizza.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!pizza) return res.status(404).json({ success: false, message: "Pizza not found" });
    res.json({ success: true, data: pizza });
  } catch (err) {
    next(err);
  }
};

// delete pizza
export const deletePizza = async (req, res, next) => {
  try {
    const pizza = await Pizza.findByIdAndDelete(req.params.id);
    if (!pizza) return res.status(404).json({ success: false, message: "Pizza not found" });
    res.json({ success: true, message: "Pizza deleted" });
  } catch (err) {
    next(err);
  }
};
