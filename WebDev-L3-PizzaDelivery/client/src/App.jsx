import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
} from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { OrderInventoryProvider } from "./context/OrderInventoryContext";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";

// Modals & Overlays
import { CartDrawer } from "./components/layout/CartDrawer";
import { CustomizerModal } from "./components/modals/CustomizerModal";
import { QuickViewModal } from "./components/modals/QuickViewModal";
import { SearchModal } from "./components/modals/SearchModal";
import { Toast } from "./components/common/Toast";

// Pages
import { LandingPage } from "./pages/LandingPage";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { UserDashboard } from "./components/dashboard/UserDashboard";
import { AdminDashboard } from "./components/dashboard/AdminDashboard";
import { AuthProvider } from "./context/AuthContext";

/**
 * Scroll to top on route transition
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}

/**
 * Floating Quick Navigation Switcher on screen edge
 */
function FloatingRouteSwitcher() {
  const location = useLocation();

  const links = [
    { label: "🍕 Menu", path: "/" },
    { label: "📦 My Orders", path: "/dashboard" },
    { label: "🛡️ Admin", path: "/admin" },
    { label: "👤 Sign In", path: "/login" },
  ];

  return (
    <div
      className="fixed bottom-5 right-5 z-40 bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-[#E8D595] p-1.5 flex items-center gap-1 text-xs"
      role="toolbar"
      aria-label="Route Switcher"
    >
      {links.map((link) => {
        const isActive = location.pathname === link.path;
        return (
          <Link
            key={link.path}
            to={link.path}
            className={`px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer ${isActive
                ? "bg-[#941508] text-white shadow-2xs"
                : "text-[#351B17] hover:bg-[#FFF0B8]/60"
              }`}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}

function AppContent() {
  return (
    <div className="min-h-screen bg-[#FFFDF7] text-[#351B17] font-['Inter',sans-serif] selection:bg-[#941508] selection:text-white flex flex-col">
      <ScrollToTop />

      {/* Sticky Animated Header */}
      <Navbar />

      {/* Main Routed Content */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Quick Floating Route Switcher (Bottom-Right) */}
      <FloatingRouteSwitcher />

      {/* Interactive Overlays */}
      <CartDrawer />
      <CustomizerModal />
      <QuickViewModal />
      <SearchModal />
      <Toast />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <CartProvider>
          <OrderInventoryProvider>
            <AppContent />
          </OrderInventoryProvider>
        </CartProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
