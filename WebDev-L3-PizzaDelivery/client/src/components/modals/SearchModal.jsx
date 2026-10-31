import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, Plus } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { regularFlavours, customerFavorites } from "../../data/pizzasData";
import { VegBadge } from "../common/Badge";

export const SearchModal = () => {
  const { isSearchOpen, setIsSearchOpen, addToCart, setActivePizzaModal } = useCart();
  const [searchTerm, setSearchTerm] = useState("");

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    if (isSearchOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  const allPizzas = useMemo(() => {
    return [...customerFavorites, ...regularFlavours];
  }, []);

  const filteredPizzas = useMemo(() => {
    if (!searchTerm.trim()) return allPizzas.slice(0, 5);
    const query = searchTerm.toLowerCase();
    return allPizzas.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
  }, [searchTerm, allPizzas]);

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Search Menu"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSearchOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            aria-hidden="true"
          />

          <div className="min-h-screen px-4 text-center flex items-start justify-center pt-20 pb-6">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-xl bg-[#FFFDF7] rounded-3xl shadow-2xl border border-[#941508]/15 text-left overflow-hidden relative z-10"
            >
              {/* Search Bar Input */}
              <div className="p-4 border-b border-[#941508]/10 flex items-center gap-3 bg-white">
                <Search size={22} className="text-[#941508] shrink-0" aria-hidden="true" />
                <label htmlFor="search-pizza-input" className="sr-only">
                  Search Pizzas
                </label>
                <input
                  id="search-pizza-input"
                  type="text"
                  placeholder="Search for Margherita, Pepperoni, Veggie, BBQ..."
                  autoFocus
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-base font-medium text-[#351B17] placeholder-[#7A5C55]/60 focus:outline-none min-h-[44px]"
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 text-gray-500 min-h-[44px] min-w-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#941508]"
                  aria-label="Close search"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>

              {/* Results List */}
              <div className="max-h-96 overflow-y-auto p-4 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-[#7A5C55] px-1">
                  {searchTerm.trim() ? "Search Results" : "Popular Suggestions"}
                </p>

                {filteredPizzas.length === 0 ? (
                  <div className="py-8 text-center text-[#7A5C55]">
                    <p className="font-semibold text-sm">No pizzas found matching "{searchTerm}"</p>
                    <p className="text-xs mt-1">Try searching for cheese, paneer, chicken or veggie</p>
                  </div>
                ) : (
                  filteredPizzas.map((pizza) => (
                    <div
                      key={pizza.id}
                      className="flex items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-black/5 hover:border-[#941508]/30 hover:shadow-xs transition-all group"
                    >
                      <button
                        type="button"
                        className="flex items-center gap-3 flex-1 min-w-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#941508] rounded-xl p-1"
                        onClick={() => {
                          setIsSearchOpen(false);
                          setActivePizzaModal(pizza);
                        }}
                        aria-label={`View details for ${pizza.name}`}
                      >
                        <img
                          src={pizza.image}
                          alt=""
                          aria-hidden="true"
                          className="w-14 h-14 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-[#351B17] truncate">
                              {pizza.name}
                            </h4>
                            <VegBadge isVeg={pizza.isVeg} />
                          </div>
                          <p className="text-xs text-[#7A5C55] truncate max-w-xs mt-0.5">
                            {pizza.description}
                          </p>
                          <span className="text-xs font-bold text-[#941508]">
                            ${pizza.price.toFixed(2)}
                          </span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => addToCart(pizza)}
                        className="w-10 h-10 rounded-full bg-[#FFF0B8] hover:bg-[#941508] text-[#941508] hover:text-white transition-colors flex items-center justify-center shrink-0 shadow-2xs min-h-[44px] min-w-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#941508]"
                        aria-label={`Add ${pizza.name} to cart`}
                        title="Add to cart"
                      >
                        <Plus size={18} aria-hidden="true" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
