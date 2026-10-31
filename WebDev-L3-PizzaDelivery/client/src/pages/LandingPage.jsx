import React from "react";
import { Hero } from "../components/sections/Hero";
import { DealsBanner } from "../components/sections/DealsBanner";
import { CustomerFavorites } from "../components/sections/CustomerFavorites";
import { PizzaCustomizerSection } from "../components/sections/PizzaCustomizerSection";
import { RegularFlavours } from "../components/sections/RegularFlavours";
import { AboutUs } from "../components/sections/AboutUs";
import { DeliveryBenefits } from "../components/sections/DeliveryBenefits";
import { Testimonials } from "../components/sections/Testimonials";

export const LandingPage = () => {
  return (
    <>
      <Hero />
      <DealsBanner />
      <CustomerFavorites />
      <PizzaCustomizerSection />
      <RegularFlavours />
      <AboutUs />
      <DeliveryBenefits />
      <Testimonials />
    </>
  );
};

