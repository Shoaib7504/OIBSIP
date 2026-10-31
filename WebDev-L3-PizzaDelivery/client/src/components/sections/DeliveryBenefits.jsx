import React from "react";
import { motion } from "motion/react";
import { Zap, ShieldCheck, MapPin, ArrowRight } from "lucide-react";
import { SectionHeader } from "../common/SectionHeader";
import { Button } from "../common/Button";
import deliveryRiderSvg from "../../assets/images/delivery-rider.svg";

export const DeliveryBenefits = () => {
  const benefits = [
    {
      icon: Zap,
      title: "Fast Delivery",
      desc: "Guaranteed at your doorstep in under 30 minutes, or your next pizza is on us.",
    },
    {
      icon: ShieldCheck,
      title: "100% Fresh Ingredients",
      desc: "Locally sourced garden vegetables, imported mozzarella, and non-GMO grains.",
    },
    {
      icon: MapPin,
      title: "Track Your Order in Real-Time",
      desc: "Watch our rider zoom across town straight to your door with live GPS updates.",
    },
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-[#FFF0B8]/40 border-y border-[#E8D595]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="From Our Oven to Your Door in 30 Minutes!"
          subtitle="Our specialized thermal-insulated carrier boxes keep your crust crispy and cheese piping hot during transit."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-12">
          {/* Left: 3 Checkpoint Benefits (Col 4) */}
          <div className="lg:col-span-4 space-y-5">
            {benefits.map((b, idx) => {
              const Icon = b.icon;
              return (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="flex items-start gap-3.5 p-4 bg-white/90 rounded-2xl border border-[#941508]/10 shadow-xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#941508] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-[#351B17]">{b.title}</h3>
                    <p className="text-xs text-[#7A5C55] mt-1 leading-relaxed">
                      {b.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Center: Motorcycle Delivery Rider Illustration (Col 5) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, type: "spring" }}
            className="lg:col-span-5 flex items-center justify-center p-4"
          >
            <motion.div
              animate={{ x: [-6, 6, -6], y: [-2, 2, -2] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-full max-w-sm sm:max-w-md drop-shadow-xl"
            >
              <img
                src={deliveryRiderSvg}
                alt="Express pizza delivery scooter rider"
                className="w-full h-auto select-none pointer-events-none"
              />
            </motion.div>
          </motion.div>

          {/* Right: Guarantee & CTA (Col 3) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 bg-white p-6 rounded-3xl border border-[#941508]/15 shadow-sm text-center lg:text-left space-y-4"
          >
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#941508] bg-[#FFF0B8] px-3 py-1 rounded-full border border-[#E8D595] inline-block">
              Express Delivery
            </span>
            <h3 className="text-lg font-black text-[#351B17] leading-snug">
              Hot, Steamy, and Never Soggy!
            </h3>
            <p className="text-xs text-[#7A5C55] leading-relaxed">
              Equipped with smart heating bags maintaining 165°F optimal heat so the crust stays crunch-perfect.
            </p>
            <a href="#menu" className="block pt-2">
              <Button variant="primary" size="md" className="w-full" icon={ArrowRight}>
                Order Now
              </Button>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
