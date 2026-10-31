import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, ShoppingBag, Check } from "lucide-react";
import confetti from "canvas-confetti";
import { useCart } from "../../context/CartContext";
import { Button } from "../common/Button";
import { PIZZA_IMAGES } from "../../data/pizzasData";

const CRUST_OPTIONS = [
  { id: "sourdough", name: "Hand-Tossed Sourdough", price: 0, desc: "Classic airy & bubbly Italian crust" },
  { id: "thin", name: "Thin & Crispy", price: 0, desc: "Light cracker-like crunch" },
  { id: "cheese-burst", name: "Cheese Burst", price: 2.50, desc: "Crust filled with warm molten mozzarella" },
  { id: "gluten-free", name: "Gluten-Free Cauliflower", price: 2.00, desc: "Healthy 100% gluten-free option" },
];

const SAUCE_OPTIONS = [
  { id: "marinara", name: "San Marzano Marinara", price: 0, color: "#C92719" },
  { id: "arrabiata", name: "Spicy Arrabiata", price: 0.50, color: "#941508" },
  { id: "garlic", name: "Creamy Garlic White Sauce", price: 0.75, color: "#FFF0B8" },
  { id: "bbq", name: "Smoky Texas BBQ", price: 0.75, color: "#7A3515" },
];

const CHEESE_OPTIONS = [
  { id: "standard", name: "Standard 100% Mozzarella", price: 0 },
  { id: "double", name: "Double Cheese Overload", price: 1.50 },
  { id: "vegan", name: "Plant-Based Dairy-Free Cheese", price: 1.25 },
];

const TOPPING_OPTIONS = [
  { id: "pepperoni", name: "Crispy Pepperoni", price: 1.50, isVeg: false },
  { id: "chicken", name: "Grilled Herb Chicken", price: 1.75, isVeg: false },
  { id: "mushrooms", name: "Sautéed Mushrooms", price: 1.00, isVeg: true },
  { id: "olives", name: "Kalamata Black Olives", price: 0.90, isVeg: true },
  { id: "corn", name: "Golden Sweet Corn", price: 0.80, isVeg: true },
  { id: "jalapeno", name: "Pickled Jalapeños", price: 0.80, isVeg: true },
  { id: "paneer", name: "Marinated Paneer Cubes", price: 1.50, isVeg: true },
  { id: "basil", name: "Fresh Garden Basil", price: 0.50, isVeg: true },
];

export const CustomizerModal = () => {
  const { isCustomizerOpen, setIsCustomizerOpen, addToCart } = useCart();
  const [activeTab, setActiveTab] = useState("crust");

  const [selectedCrust, setSelectedCrust] = useState(CRUST_OPTIONS[0]);
  const [selectedSauce, setSelectedSauce] = useState(SAUCE_OPTIONS[0]);
  const [selectedCheese, setSelectedCheese] = useState(CHEESE_OPTIONS[0]);
  const [selectedToppings, setSelectedToppings] = useState(["basil", "mushrooms"]);

  const basePizzaPrice = 10.99;
  const toppingsTotal = selectedToppings.reduce((sum, toppingId) => {
    const item = TOPPING_OPTIONS.find((t) => t.id === toppingId);
    return sum + (item ? item.price : 0);
  }, 0);

  const totalPrice = Number(
    (
      basePizzaPrice +
      selectedCrust.price +
      selectedSauce.price +
      selectedCheese.price +
      toppingsTotal
    ).toFixed(2)
  );

  const toggleTopping = (toppingId) => {
    setSelectedToppings((prev) =>
      prev.includes(toppingId)
        ? prev.filter((id) => id !== toppingId)
        : [...prev, toppingId]
    );
  };

  const handleAddCustomPizza = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.5 },
    });

    const customPizza = {
      id: `custom-${Date.now()}`,
      name: "Custom Masterpiece Pizza",
      price: totalPrice,
      image: PIZZA_IMAGES.customizerBase,
      description: `${selectedCrust.name}, ${selectedSauce.name}, ${selectedCheese.name} with ${
        selectedToppings.length ? selectedToppings.join(", ") : "no extra toppings"
      }`,
    };

    addToCart(customPizza, "Medium", {
      crust: selectedCrust.name,
      sauce: selectedSauce.name,
      cheese: selectedCheese.name,
      toppings: selectedToppings,
    });

    setIsCustomizerOpen(false);
  };

  return (
    <AnimatePresence>
      {isCustomizerOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCustomizerOpen(false)}
            className="fixed inset-0 bg-black/65 backdrop-blur-xs"
          />

          <div className="min-h-screen px-4 text-center flex items-center justify-center p-2 sm:p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-4xl bg-[#FFFDF7] rounded-3xl shadow-2xl border border-[#941508]/15 text-left overflow-hidden relative z-10 flex flex-col md:flex-row max-h-[92vh]"
            >
              {/* Left Column: Live Visual Pizza Preview */}
              <div className="md:w-5/12 bg-[#FFF0B8]/50 p-6 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-[#E8D595] relative overflow-hidden">
                <div className="absolute inset-0 bg-doodle-pattern opacity-30 pointer-events-none" />

                <div className="w-full text-center relative z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#941508] text-white text-xs font-bold uppercase tracking-wider">
                    <Sparkles size={13} /> Live Pizza Preview
                  </span>
                  <h3 className="text-xl font-black text-[#351B17] mt-2">
                    Build Your Dream Pizza
                  </h3>
                </div>

                {/* Pizza Plate & Animated Layers */}
                <div className="relative my-6 w-52 h-52 sm:w-64 sm:h-64 flex items-center justify-center">
                  {/* Outer Crust Plate */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="w-full h-full rounded-full shadow-2xl border-6 border-[#FFFDF7] overflow-hidden relative"
                  >
                    <img
                      src={PIZZA_IMAGES.customizerBase}
                      alt="Custom pizza preview"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>

                  {/* Sauce indicator glow */}
                  <div
                    className="absolute inset-4 rounded-full opacity-35 pointer-events-none blur-sm"
                    style={{ backgroundColor: selectedSauce.color }}
                  />

                  {/* Toppings floating chips overlay */}
                  <div className="absolute inset-0 flex flex-wrap items-center justify-center p-6 gap-1 pointer-events-none">
                    {selectedToppings.map((tId, idx) => (
                      <motion.span
                        key={tId + idx}
                        initial={{ scale: 0, y: -10 }}
                        animate={{ scale: 1, y: 0 }}
                        className="px-2 py-0.5 rounded-full bg-white/90 text-[#941508] text-[10px] font-extrabold shadow-sm border border-[#941508]/20 backdrop-blur-xs"
                      >
                        +{TOPPING_OPTIONS.find((t) => t.id === tId)?.name.split(" ")[0]}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Summary Badges */}
                <div className="w-full bg-white/80 rounded-2xl p-3 border border-[#941508]/10 text-xs space-y-1 relative z-10 shadow-xs">
                  <div className="flex justify-between">
                    <span className="text-[#7A5C55]">Crust:</span>
                    <span className="font-bold text-[#351B17]">{selectedCrust.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7A5C55]">Sauce:</span>
                    <span className="font-bold text-[#351B17]">{selectedSauce.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7A5C55]">Cheese:</span>
                    <span className="font-bold text-[#351B17]">{selectedCheese.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7A5C55]">Toppings:</span>
                    <span className="font-bold text-[#941508]">
                      {selectedToppings.length} selected
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Customization Controls */}
              <div className="md:w-7/12 flex flex-col justify-between p-6 sm:p-8 bg-[#FFFDF7] overflow-y-auto">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-black/10">
                    <h4 className="font-extrabold text-lg text-[#351B17]">
                      Customize Your Ingredients
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsCustomizerOpen(false)}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 text-[#7A5C55]"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-2 my-4 border-b border-black/10 pb-3 overflow-x-auto">
                    {[
                      { key: "crust", label: "1. Crust" },
                      { key: "sauce", label: "2. Sauce" },
                      { key: "cheese", label: "3. Cheese" },
                      { key: "toppings", label: "4. Toppings" },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                          activeTab === tab.key
                            ? "bg-[#941508] text-white shadow-xs"
                            : "bg-white text-[#7A5C55] hover:text-[#351B17] border border-black/10"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab Panels */}
                  <div className="py-2">
                    {/* Crust Tab */}
                    {activeTab === "crust" && (
                      <div className="space-y-2.5">
                        <p className="text-xs text-[#7A5C55] mb-2">Select your handmade dough base:</p>
                        {CRUST_OPTIONS.map((crust) => (
                          <div
                            key={crust.id}
                            onClick={() => setSelectedCrust(crust)}
                            className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                              selectedCrust.id === crust.id
                                ? "bg-[#FFF0B8]/60 border-[#941508] shadow-xs"
                                : "bg-white border-black/10 hover:border-[#941508]/40"
                            }`}
                          >
                            <div>
                              <h5 className="font-bold text-sm text-[#351B17]">{crust.name}</h5>
                              <p className="text-xs text-[#7A5C55]">{crust.desc}</p>
                            </div>
                            <span className="text-xs font-bold text-[#941508]">
                              {crust.price > 0 ? `+$${crust.price.toFixed(2)}` : "Included"}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Sauce Tab */}
                    {activeTab === "sauce" && (
                      <div className="space-y-2.5">
                        <p className="text-xs text-[#7A5C55] mb-2">Select your slow-simmered sauce:</p>
                        {SAUCE_OPTIONS.map((sauce) => (
                          <div
                            key={sauce.id}
                            onClick={() => setSelectedSauce(sauce)}
                            className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                              selectedSauce.id === sauce.id
                                ? "bg-[#FFF0B8]/60 border-[#941508] shadow-xs"
                                : "bg-white border-black/10 hover:border-[#941508]/40"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className="w-4 h-4 rounded-full border border-black/20"
                                style={{ backgroundColor: sauce.color }}
                              />
                              <h5 className="font-bold text-sm text-[#351B17]">{sauce.name}</h5>
                            </div>
                            <span className="text-xs font-bold text-[#941508]">
                              {sauce.price > 0 ? `+$${sauce.price.toFixed(2)}` : "Included"}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Cheese Tab */}
                    {activeTab === "cheese" && (
                      <div className="space-y-2.5">
                        <p className="text-xs text-[#7A5C55] mb-2">Select your cheese level:</p>
                        {CHEESE_OPTIONS.map((cheese) => (
                          <div
                            key={cheese.id}
                            onClick={() => setSelectedCheese(cheese)}
                            className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                              selectedCheese.id === cheese.id
                                ? "bg-[#FFF0B8]/60 border-[#941508] shadow-xs"
                                : "bg-white border-black/10 hover:border-[#941508]/40"
                            }`}
                          >
                            <h5 className="font-bold text-sm text-[#351B17]">{cheese.name}</h5>
                            <span className="text-xs font-bold text-[#941508]">
                              {cheese.price > 0 ? `+$${cheese.price.toFixed(2)}` : "Included"}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Toppings Tab */}
                    {activeTab === "toppings" && (
                      <div>
                        <p className="text-xs text-[#7A5C55] mb-2">Pick your favorite toppings:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {TOPPING_OPTIONS.map((topping) => {
                            const isChecked = selectedToppings.includes(topping.id);
                            return (
                              <div
                                key={topping.id}
                                onClick={() => toggleTopping(topping.id)}
                                className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                                  isChecked
                                    ? "bg-[#FFF0B8]/70 border-[#941508]"
                                    : "bg-white border-black/10 hover:border-[#941508]/40"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-4 h-4 rounded-md flex items-center justify-center ${
                                      isChecked
                                        ? "bg-[#941508] text-white"
                                        : "border border-gray-300 bg-gray-50"
                                    }`}
                                  >
                                    {isChecked && <Check size={12} />}
                                  </div>
                                  <span className="text-xs font-semibold text-[#351B17] truncate">
                                    {topping.name}
                                  </span>
                                </div>
                                <span className="text-[11px] font-bold text-[#941508]">
                                  +${topping.price.toFixed(2)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Total & Order Button */}
                <div className="pt-6 mt-6 border-t border-black/10 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-[#7A5C55] block">Custom Total</span>
                    <span className="text-2xl font-black text-[#941508]">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>

                  <Button
                    onClick={handleAddCustomPizza}
                    variant="primary"
                    size="lg"
                    icon={ShoppingBag}
                  >
                    Add Dream Pizza to Cart
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

