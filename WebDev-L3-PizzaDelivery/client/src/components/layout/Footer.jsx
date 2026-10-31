import React, { useState } from "react";
import { Pizza, Phone, Mail, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "../common/Button";
import { useCart } from "../../context/CartContext";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { showToast } = useCart();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      showToast("Please enter a valid email address", "warning");
      return;
    }
    setIsSubscribed(true);
    showToast("🎉 Welcome to the PizzaCrave Club! Check your inbox for 15% off.");
    setEmail("");
  };

  return (
    <footer id="footer" className="bg-[#941508] text-white pt-16 pb-8 overflow-hidden relative">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/15">
          {/* Brand Info (Col 4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#F49A13] border border-white/20">
                <Pizza size={22} className="rotate-12" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Pizza<span className="text-[#F49A13]">Crave</span>
              </span>
            </div>
            <p className="text-sm text-white/80 leading-relaxed pr-4">
              Hand-stretched sourdough, imported San Marzano tomatoes, and 100% whole-milk mozzarella. Baked in a wood-fired hearth at 800°F and delivered in 30 minutes!
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {["Facebook", "Instagram", "Twitter", "TikTok"].map((network) => (
                <a
                  key={network}
                  href={`#${network.toLowerCase()}`}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/90 hover:bg-[#F49A13] hover:text-[#351B17] transition-all text-xs font-bold"
                  title={network}
                >
                  {network[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links (Col 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#FFF0B8]">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <a href="#hero" className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-white transition-colors">
                  Our Menu
                </a>
              </li>
              <li>
                <a href="#deals" className="hover:text-white transition-colors">
                  Today's Deals
                </a>
              </li>
              <li>
                <a href="#customize" className="hover:text-white transition-colors">
                  Pizza Studio
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  Our Story
                </a>
              </li>
            </ul>
          </div>

          {/* Contact (Col 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#FFF0B8]">
              Contact Us
            </h4>
            <div className="space-y-2.5 text-xs text-white/80">
              <div className="flex items-center gap-2.5">
                <Phone size={15} className="text-[#F49A13] shrink-0" />
                <span>+1 (800) 749-9227</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={15} className="text-[#F49A13] shrink-0" />
                <span>hello@pizzacrave.com</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin size={15} className="text-[#F49A13] shrink-0 mt-0.5" />
                <span>24 Italian Piazza, Little Italy, NY 10013</span>
              </div>
            </div>
          </div>

          {/* Newsletter & Photo (Col 3) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="rounded-2xl overflow-hidden border border-white/20 shadow-md h-24 relative group">
              <img
                src="https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=600&auto=format&fit=crop&q=80"
                alt="Friends eating pizza"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2.5">
                <p className="text-xs font-semibold text-white">Join 15,000+ Pizza Lovers</p>
              </div>
            </div>

            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFF0B8]">
              Get 15% Off Your Next Order
            </h4>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border border-white/25 rounded-full px-4 py-2 text-xs text-white placeholder-white/60 focus:outline-none focus:border-[#F49A13] flex-1"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#F49A13] hover:bg-[#de8b10] text-[#351B17] font-bold text-xs rounded-full transition-transform active:scale-95 cursor-pointer shadow-sm"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-4">
          <p>© 2026 PizzaCrave Pizzeria. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#cookies" className="hover:text-white transition-colors">
              Cookie Preferences
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

