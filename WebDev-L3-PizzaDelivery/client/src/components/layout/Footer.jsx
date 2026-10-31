import React, { useState } from "react";
import { Pizza, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "../common/Button";
import { useCart } from "../../context/CartContext";

// Clean vector social icons
const FacebookIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const TwitterIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TikTokIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.88-4.49V8.89a8.28 8.28 0 0 0 5-1.74l-1.11-2.46z" />
  </svg>
);

export const Footer = () => {
  const [email, setEmail] = useState("");
  const { showToast } = useCart();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      showToast("Please enter a valid email address", "warning");
      return;
    }
    showToast("🎉 Welcome to the PizzaCrave Club! Check your inbox for 15% off.");
    setEmail("");
  };

  return (
    <footer id="footer" className="bg-[#941508] text-white pt-16 pb-8 overflow-hidden relative" aria-labelledby="footer-brand">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/35 pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/20">
          {/* Brand Info (Col 4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#F49A13] border border-white/20">
                <Pizza size={22} className="rotate-12" aria-hidden="true" />
              </div>
              <span id="footer-brand" className="text-2xl font-black tracking-tight text-white">
                Pizza<span className="text-[#F49A13]">Crave</span>
              </span>
            </div>
            <p className="text-sm text-white/90 leading-relaxed pr-4">
              Hand-stretched sourdough, imported San Marzano tomatoes, and 100% whole-milk mozzarella. Baked in a wood-fired hearth at 800°F and delivered in 30 minutes!
            </p>
            {/* Social Links with Real Vector Icons and accessible labels */}
            <div className="flex items-center gap-3 pt-2" aria-label="Social media channels">
              {[
                { name: "Facebook", icon: FacebookIcon, href: "#facebook" },
                { name: "Instagram", icon: InstagramIcon, href: "#instagram" },
                { name: "Twitter/X", icon: TwitterIcon, href: "#twitter" },
                { name: "TikTok", icon: TikTokIcon, href: "#tiktok" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#F49A13] hover:text-[#351B17] transition-all min-h-[44px] min-w-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    aria-label={`Follow PizzaCrave on ${item.name}`}
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links (Col 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#FFF0B8]">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-white/90">
              <li>
                <a href="#hero" className="hover:text-white transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-white rounded">
                  Home
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-white transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-white rounded">
                  Our Menu
                </a>
              </li>
              <li>
                <a href="#deals" className="hover:text-white transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-white rounded">
                  Today's Deals
                </a>
              </li>
              <li>
                <a href="#customize" className="hover:text-white transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-white rounded">
                  Pizza Studio
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-white rounded">
                  Our Story
                </a>
              </li>
            </ul>
          </div>

          {/* Contact (Col 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#FFF0B8]">
              Contact Us
            </h3>
            <div className="space-y-2.5 text-xs text-white/90">
              <div className="flex items-center gap-2.5">
                <Phone size={15} className="text-[#F49A13] shrink-0" aria-hidden="true" />
                <span>+1 (800) 749-9227</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={15} className="text-[#F49A13] shrink-0" aria-hidden="true" />
                <span>hello@pizzacrave.com</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin size={15} className="text-[#F49A13] shrink-0 mt-0.5" aria-hidden="true" />
                <span>24 Italian Piazza, Little Italy, NY 10013</span>
              </div>
            </div>
          </div>

          {/* Newsletter & Photo (Col 3) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="rounded-2xl overflow-hidden border border-white/20 shadow-md h-24 relative group">
              <img
                src="https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=600&auto=format&fit=crop&q=80"
                alt="Happy customers enjoying fresh artisan pizza"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2.5" aria-hidden="true">
                <p className="text-xs font-semibold text-white">Join 15,000+ Pizza Lovers</p>
              </div>
            </div>

            <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFF0B8]">
              Get 15% Off Your Next Order
            </h3>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <label htmlFor="newsletter-email" className="sr-only">
                Email Address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/15 border border-white/30 rounded-full px-4 py-2.5 text-xs text-white placeholder-white/70 focus:outline-none focus:border-[#F49A13] focus-visible:ring-2 focus-visible:ring-white flex-1 min-h-[44px]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#F49A13] hover:bg-[#de8b10] text-[#351B17] font-bold text-xs rounded-full transition-transform active:scale-95 cursor-pointer shadow-sm min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/70 gap-4">
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
