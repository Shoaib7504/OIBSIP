import React from "react";
import { CartProvider } from "./context/CartContext";
import { Navbar } from "./components/layout/Navbar";
import { Hero } from "./components/sections/Hero";
import { DealsBanner } from "./components/sections/DealsBanner";
import { CustomerFavorites } from "./components/sections/CustomerFavorites";
import { PizzaCustomizerSection } from "./components/sections/PizzaCustomizerSection";
import { RegularFlavours } from "./components/sections/RegularFlavours";
import { AboutUs } from "./components/sections/AboutUs";
import { DeliveryBenefits } from "./components/sections/DeliveryBenefits";
import { Testimonials } from "./components/sections/Testimonials";
import { Footer } from "./components/layout/Footer";

// Modals & Overlays
import { CartDrawer } from "./components/layout/CartDrawer";
import { CustomizerModal } from "./components/modals/CustomizerModal";
import { QuickViewModal } from "./components/modals/QuickViewModal";
import { SearchModal } from "./components/modals/SearchModal";
import { Toast } from "./components/common/Toast";

function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-[#FFFDF7] text-[#351B17] font-['Inter',sans-serif] selection:bg-[#941508] selection:text-white flex flex-col">
        {/* Sticky Animated Header */}
        <Navbar />

        {/* Main Content Sections */}
        <main className="flex-1">
          <Hero />
          <DealsBanner />
          <CustomerFavorites />
          <PizzaCustomizerSection />
          <RegularFlavours />
          <AboutUs />
          <DeliveryBenefits />
          <Testimonials />
        </main>

        {/* Global Footer */}
        <Footer />

        {/* Interactive Overlays */}
        <CartDrawer />
        <CustomizerModal />
        <QuickViewModal />
        <SearchModal />
        <Toast />
      </div>
    </CartProvider>
  );
}

export default App;
