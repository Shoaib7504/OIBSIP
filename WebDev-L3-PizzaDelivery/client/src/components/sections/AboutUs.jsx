import React from "react";
import { motion } from "motion/react";
import { Heart, Award, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "../common/Button";
import { PIZZA_IMAGES } from "../../data/pizzasData";
import chefBadge from "../../assets/images/chef-decoration.svg";

export const AboutUs = () => {
  return (
    <section id="about" className="py-16 md:py-24 relative overflow-hidden bg-[#FFFDF7]" aria-labelledby="about-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column (Col 7) */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF0B8] border border-[#E8D595] text-[#941508] text-xs font-bold">
              <Heart size={14} className="fill-[#941508]" aria-hidden="true" />
              <span>Authentic Italian Passion</span>
            </div>

            <h2
              id="about-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#351B17] tracking-tight leading-tight"
            >
              Made with Love, <br className="hidden sm:inline" />
              <span className="text-[#941508]">Delivered with Care!</span>
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#7A5C55] leading-relaxed">
              <p>
                At <strong className="text-[#351B17]">PizzaCrave</strong>, our journey began in Naples with a singular obsession: honoring traditional artisan pizza-making. We ferment our signature sourdough for 48 hours to develop an airy, easily digestible crust with authentic blistered leopard spots.
              </p>
              <p>
                Every single morning, our kitchen prepares fresh batches of rich San Marzano tomato sauce, infuses extra-virgin olive oil with aromatic garlic, and grates pure whole-milk mozzarella. No artificial additives, no shortcuts—ever.
              </p>
              <p>
                Baked in our custom 800°F wood-fired hearth in just 90 seconds, each pizza is sealed in insulated, heat-retaining thermal packaging so it reaches your dining table piping hot, crispy, and full of flavor.
              </p>
            </div>

            {/* Feature Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#FFF0B8] flex items-center justify-center text-[#941508] shrink-0">
                  <Award size={18} aria-hidden="true" />
                </div>
                <span className="text-xs font-bold text-[#351B17]">Master Pizzaiolo Certified</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#FFF0B8] flex items-center justify-center text-[#941508] shrink-0">
                  <Sparkles size={18} aria-hidden="true" />
                </div>
                <span className="text-xs font-bold text-[#351B17]">48h Slow-Fermented Dough</span>
              </div>
            </div>

            <div className="pt-4">
              <a href="#menu" tabIndex={-1}>
                <Button variant="primary" size="lg" icon={ArrowRight}>
                  Explore Our Pizzas
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Right Image Presentation with Chef Badge (Col 5) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            {/* Background Warm Card Frame */}
            <div className="relative w-full max-w-md aspect-square rounded-[36px] bg-gradient-to-br from-[#941508] to-[#C92719] p-4 sm:p-6 shadow-2xl overflow-hidden flex items-center justify-center">
              {/* Inner Pizza Photo on wooden board */}
              <div className="w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-inner border-2 border-white/20 relative group">
                <img
                  src={PIZZA_IMAGES.storyPizza}
                  alt="Artisan wood-fired pizza presented on a rustic wooden peel board"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" aria-hidden="true" />
                <span className="absolute bottom-4 left-4 text-xs font-bold text-white bg-black/40 backdrop-blur-xs px-3 py-1 rounded-full border border-white/20">
                  Oven-Fresh Hearth Baked
                </span>
              </div>
            </div>

            {/* Overlapping Chef Badge Illustration */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -right-4 sm:-bottom-8 sm:-right-6 w-24 h-24 sm:w-28 sm:h-28 z-20 drop-shadow-2xl"
              aria-hidden="true"
            >
              <img
                src={chefBadge}
                alt=""
                className="w-full h-full object-contain pointer-events-none"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
