import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  Pizza,
  LayoutDashboard,
  ShieldCheck,
  User,
  LogIn,
  LogOut,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const { totalItemsCount, setIsCartOpen, setIsSearchOpen, showToast } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const isHome = location.pathname === "/";

  // Track window scroll for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsUserDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Close dropdown and mobile menu on route change
  useEffect(() => {
    setIsUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
    showToast("Logged out successfully. See you again soon!", "info");
    navigate("/login", { replace: true });
  };

  // Landing page section links
  const sectionLinks = [
    { name: "Home", href: "/#hero" },
    { name: "Menu", href: "/#menu" },
    { name: "Deals", href: "/#deals" },
    { name: "Customize", href: "/#customize" },
    { name: "About Us", href: "/#about" },
    { name: "Contact", href: "/#footer" },
  ];

  // Route view links (filtered strictly by admin privileges)
  const navRoutes = [
    {
      name: "My Orders",
      path: "/dashboard",
      icon: LayoutDashboard,
      show: true,
    },
    {
      name: "Admin",
      path: "/admin",
      icon: ShieldCheck,
      show: isAdmin === true, // Strictly hidden if user is not admin
    },
  ].filter((route) => route.show);

  // Extract user display initial and first name
  const displayName = user?.name || user?.fullName || "Pizza Craver";
  const firstName = displayName.split(" ")[0];
  const userInitial = firstName.charAt(0).toUpperCase() || "P";

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
            {/* Brand Logo */}
            <Link
              to="/"
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
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Main Navigation">
              {/* Section links */}
              {isHome ? (
                sectionLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href.replace("/", "")}
                    className="text-sm font-semibold text-[#351B17] hover:text-[#941508] transition-colors relative py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#941508] rounded-lg px-2.5 group"
                  >
                    {link.name}
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#941508] scale-x-0 transition-transform duration-300 group-hover:scale-x-100 rounded-full" />
                  </a>
                ))
              ) : (
                <Link
                  to="/"
                  className="text-xs font-bold text-[#941508] hover:text-[#C92719] px-3 py-1.5 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#941508] hover:bg-[#FFF0B8]/50"
                >
                  ← Back to Menu
                </Link>
              )}

              {/* Separator */}
              <div className="w-px h-5 bg-[#351B17]/15 mx-1" aria-hidden="true" />

              {/* Dashboard & Admin Routes (Admin route strictly omitted if not admin) */}
              {navRoutes.map((route) => {
                const Icon = route.icon;
                const isActive = location.pathname === route.path;
                return (
                  <Link
                    key={route.path}
                    to={route.path}
                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#941508] min-h-[36px] ${
                      isActive
                        ? "bg-[#941508] text-white shadow-xs"
                        : "text-[#351B17] hover:bg-[#FFF0B8] border border-transparent hover:border-[#E8D595]"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon size={14} aria-hidden="true" />
                    {route.name}
                  </Link>
                );
              })}

              {/* User Authentication Status Section */}
              {isAuthenticated ? (
                /* Advanced User Profile Dropdown */
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    aria-expanded={isUserDropdownOpen}
                    aria-haspopup="true"
                    className={`inline-flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full font-bold text-xs transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#941508] border cursor-pointer ${
                      isUserDropdownOpen
                        ? "bg-[#FFF0B8] border-[#941508] text-[#941508] shadow-sm"
                        : "bg-white/80 hover:bg-[#FFF0B8]/60 border-[#E8D595] text-[#351B17]"
                    }`}
                  >
                    {/* User Avatar Circle */}
                    <div className="w-7 h-7 rounded-full bg-[#941508] text-white font-black text-xs flex items-center justify-center shadow-2xs">
                      {userInitial}
                    </div>

                    <span className="max-w-[100px] truncate">{firstName}</span>

                    {isAdmin && (
                      <span className="px-1.5 py-0.2 bg-[#941508] text-white text-[9px] font-black uppercase rounded-full tracking-wider">
                        Admin
                      </span>
                    )}

                    <ChevronDown
                      size={14}
                      className={`text-[#7A5C55] transition-transform duration-200 ${
                        isUserDropdownOpen ? "rotate-180 text-[#941508]" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Popover */}
                  <AnimatePresence>
                    {isUserDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 8 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-[#E8D595] shadow-xl overflow-hidden z-50 text-left"
                        role="menu"
                        aria-label="User account menu"
                      >
                        {/* Dropdown Header Card */}
                        <div className="p-4 bg-gradient-to-br from-[#FFF0B8]/60 via-[#FFFDF7] to-white border-b border-[#E8D595]/60">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-[#941508] text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0">
                              {userInitial}
                            </div>
                            <div className="overflow-hidden">
                              <p className="font-extrabold text-sm text-[#351B17] truncate leading-tight">
                                {displayName}
                              </p>
                              <p className="text-xs text-[#7A5C55] truncate font-medium">
                                {user?.email || "customer@pizzacrave.com"}
                              </p>
                            </div>
                          </div>

                          {/* Role & Crave Status Badge */}
                          <div className="flex items-center gap-2 mt-1">
                            {isAdmin ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-[#941508] text-white tracking-wide">
                                <ShieldCheck size={11} />
                                Store Administrator
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF0B8] text-[#941508] border border-[#E8D595]">
                                <Sparkles size={11} className="text-[#F49A13]" />
                                VIP Pizza Craver
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Navigation Items */}
                        <div className="p-2 space-y-1">
                          <Link
                            to="/dashboard"
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-[#351B17] hover:bg-[#FFF0B8]/60 hover:text-[#941508] transition-colors"
                            role="menuitem"
                          >
                            <LayoutDashboard size={16} className="text-[#941508]" />
                            <span>My Orders &amp; Live Tracking</span>
                          </Link>

                          {/* Admin Dashboard: STRICTLY visible only if user is admin */}
                          {isAdmin && (
                            <Link
                              to="/admin"
                              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-[#941508] bg-[#FFF0B8]/40 hover:bg-[#FFF0B8] transition-colors border border-[#E8D595]/50"
                              role="menuitem"
                            >
                              <ShieldCheck size={16} className="text-[#941508]" />
                              <span>Admin Inventory &amp; Control</span>
                            </Link>
                          )}

                          <a
                            href="/#customize"
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-[#351B17] hover:bg-[#FFF0B8]/60 hover:text-[#941508] transition-colors"
                            role="menuitem"
                          >
                            <Pizza size={16} className="text-[#F49A13]" />
                            <span>Craft Custom Pizza</span>
                          </a>
                        </div>

                        {/* Dropdown Footer: Logout Button */}
                        <div className="p-2 border-t border-gray-100 bg-[#FFFDF7]/50">
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            role="menuitem"
                          >
                            <LogOut size={14} />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Guest State: Sign In Button */
                <Link
                  to="/login"
                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#941508] min-h-[36px] shadow-2xs ${
                    location.pathname === "/login" || location.pathname === "/register"
                      ? "bg-[#941508] text-white shadow-xs"
                      : "text-white bg-[#941508] hover:bg-[#7d1106]"
                  }`}
                  aria-current={location.pathname === "/login" ? "page" : undefined}
                >
                  <LogIn size={14} aria-hidden="true" />
                  <span>Sign In</span>
                </Link>
              )}
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
              {/* Authenticated User Card Header in Mobile */}
              {isAuthenticated && (
                <div className="p-3.5 mb-2 bg-[#FFF0B8]/60 border border-[#E8D595] rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#941508] text-white font-black text-sm flex items-center justify-center shadow-xs">
                      {userInitial}
                    </div>
                    <div>
                      <p className="font-extrabold text-sm text-[#351B17] leading-tight">
                        {displayName}
                      </p>
                      <p className="text-[11px] text-[#7A5C55] font-medium">
                        {user?.email || "customer@pizzacrave.com"}
                      </p>
                    </div>
                  </div>
                  {isAdmin && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-[#941508] text-white uppercase tracking-wider">
                      Admin
                    </span>
                  )}
                </div>
              )}

              {/* Section links */}
              {isHome ? (
                sectionLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href.replace("/", "")}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-base font-bold text-[#351B17] hover:text-[#941508] py-2.5 px-3 rounded-xl hover:bg-[#FFF0B8]/40 transition-colors"
                  >
                    {link.name}
                  </a>
                ))
              ) : (
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-bold text-[#941508] py-2.5 px-3 rounded-xl hover:bg-[#FFF0B8]/40 transition-colors"
                >
                  ← Back to Menu
                </Link>
              )}

              {/* Divider */}
              <div className="h-px bg-[#351B17]/10 my-2" aria-hidden="true" />

              {/* Route links (Admin strictly omitted if not admin) */}
              {navRoutes.map((route) => {
                const Icon = route.icon;
                const isActive = location.pathname === route.path;
                return (
                  <Link
                    key={route.path}
                    to={route.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 text-base font-bold py-2.5 px-3 rounded-xl transition-colors text-left ${
                      isActive
                        ? "bg-[#941508] text-white"
                        : "text-[#351B17] hover:text-[#941508] hover:bg-[#FFF0B8]/40"
                    }`}
                  >
                    <Icon size={18} aria-hidden="true" />
                    {route.name}
                  </Link>
                );
              })}

              {/* Mobile Auth Actions */}
              <div className="pt-2 border-t border-[#351B17]/10 flex flex-col gap-2">
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-sm bg-red-600 text-white shadow-xs cursor-pointer hover:bg-red-700 transition-colors"
                  >
                    <LogOut size={16} />
                    Sign Out ({firstName})
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-sm bg-[#941508] text-white shadow-xs"
                    >
                      <LogIn size={16} />
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl font-bold text-xs text-[#941508] bg-[#FFF0B8] border border-[#E8D595]"
                    >
                      Create New Account
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
