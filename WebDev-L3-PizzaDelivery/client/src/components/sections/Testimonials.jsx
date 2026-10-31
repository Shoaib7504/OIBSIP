import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Quote, CheckCircle } from "lucide-react";
import { SectionHeader } from "../common/SectionHeader";
import { RatingStars } from "../common/RatingStars";
import { testimonials } from "../../data/testimonialsData";

export const Testimonials = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-[#FFFDF7]" aria-labelledby="testimonials-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="What Our Customers Say"
          subtitle="Join thousands of happy pizza lovers who trust PizzaCrave for game nights, family dinners, and midnight cravings"
        />

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {testimonials.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={shouldReduceMotion ? {} : { y: -6 }}
              className="bg-white rounded-3xl p-6 border border-[#941508]/10 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between relative group"
            >
              {/* Quote mark decoration */}
              <div className="absolute top-5 right-5 text-[#FFF0B8] group-hover:text-[#F49A13]/40 transition-colors pointer-events-none" aria-hidden="true">
                <Quote size={32} />
              </div>

              <div>
                {/* Header: Avatar, Name, Verified */}
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={item.avatar}
                    alt={`Customer portrait of ${item.name}`}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#941508]/20 shadow-2xs shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-[#351B17] flex items-center gap-1">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-[#7A5C55] flex items-center gap-1">
                      <CheckCircle size={11} className="text-emerald-600" aria-hidden="true" />
                      {item.role}
                    </p>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="mb-3">
                  <RatingStars rating={item.rating} showNumber={false} size={15} />
                </div>

                {/* Testimonial Quote */}
                <p className="text-xs text-[#7A5C55] leading-relaxed italic">
                  "{item.text}"
                </p>
              </div>

              {/* Bottom bar with semantic Rating */}
              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-[#F49A13] uppercase tracking-wider">
                <span>Verified Order</span>
                <RatingStars rating={5} showNumber={false} size={12} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
