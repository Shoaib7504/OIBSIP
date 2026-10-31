import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Info, AlertTriangle, X } from "lucide-react";
import { useCart } from "../../context/CartContext";

export const Toast = () => {
  const { toast } = useCart();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#351B17] text-white rounded-2xl shadow-2xl border border-white/10 max-w-sm"
        >
          {toast.type === "info" ? (
            <Info className="text-blue-400 shrink-0" size={20} />
          ) : toast.type === "warning" ? (
            <AlertTriangle className="text-[#F49A13] shrink-0" size={20} />
          ) : (
            <CheckCircle2 className="text-emerald-400 shrink-0" size={20} />
          )}
          <p className="text-sm font-medium text-white/95">{toast.message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

