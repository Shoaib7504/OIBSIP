import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, ShoppingBag, Menu, X, Pizza } from "lucide-react";
import { useCart } from "../../context/CartContext";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItemsCount, setIsCartOpen, setIsSearchOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#hero" },
    { name: "Menu", href: "#menu" },
    { name: "Deals", href: "#deals" },
    { name: "Customize", href: "#customize" },
    { name: "About Us", href: "#about" },
    { name: "Contact", href: "#footer" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-[#FFFDF7]/95 backdrop-blur-md shadow-xs border-b border-[#941508]/10 py-2.5"
            : "bg-transparent py-4 sm:py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a
              href="#hero"
              className="flex items-center gap-2.5 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#941508] rounded-xl p-1"
              aria-label="PizzaCrave Homepage"
            >
              <div className="w-10 h-10 rounded-full bg-[#941508] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform shrink-0">
                <Pizza size={22} className="rotate-12" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#941508] leading-tight">
                  Pizza<span className="text-[#F49A13]">Crave</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#7A5C55] -mt-0.5">
                  Artisan Pizzeria
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-7 lg:gap-9" aria-label="Main Navigation">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-semibold text-[#351B17] hover:text-[#941508] transition-colors relative py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#941508] rounded-lg px-2 group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#941508] scale-x-0 transition-transform duration-300 group-hover:scale-x-100 rounded-full" />
                </a>
              ))}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Button */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="w-11 h-11 rounded-full flex items-center justify-center text-[#351B17] hover:bg-[#941508]/10 hover:text-[#941508] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#941508]"
                aria-label="Search Pizzas"
                title="Search Pizzas (Cmd+K)"
              >
                <Search size={20} aria-hidden="true" />
              </button>

              {/* Cart Button */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative w-11 h-11 rounded-full flex items-center justify-center bg-[#FFF0B8] border border-[#E8D595] text-[#941508] hover:bg-[#941508] hover:text-white transition-colors shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#941508]"
                aria-label={`Shopping cart with ${totalItemsCount} items`}
                title="View Cart"
              >
                <ShoppingBag size={20} aria-hidden="true" />
                {totalItemsCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-[#941508] text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs pointer-events-none"
                    aria-hidden="true"
                  >
                    {totalItemsCount}
                  </motion.span>
                )}
              </button>

              {/* Mobile Menu Hamburger */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden w-11 h-11 rounded-full flex items-center justify-center text-[#351B17] hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#941508]"
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-[60px] sm:top-[68px] left-0 right-0 z-30 bg-[#FFFDF7] border-b border-[#941508]/15 shadow-xl px-6 py-6 md:hidden overflow-hidden"
          >
            <nav className="flex flex-col gap-2" aria-label="Mobile Navigation">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-bold text-[#351B17] hover:text-[#941508] py-2.5 px-3 rounded-xl hover:bg-[#FFF0B8]/40 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
