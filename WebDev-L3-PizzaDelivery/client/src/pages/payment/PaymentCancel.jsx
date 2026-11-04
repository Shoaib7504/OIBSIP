import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  XCircle,
  CreditCard,
  ArrowRight,
  RefreshCw,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";
import { createCheckoutSession } from "../../services/paymentServices";
import { Button } from "../../components/common/Button";

export const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("orderId");

  const [isRetrying, setIsRetrying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRetryPayment = async () => {
    if (!orderId) {
      navigate("/dashboard");
      return;
    }

    try {
      setIsRetrying(true);
      setErrorMessage("");

      const res = await createCheckoutSession(orderId);

      if (res?.data?.checkoutUrl) {
        window.location.href = res.data.checkoutUrl;
      } else {
        throw new Error("Could not obtain checkout URL. Please try from your dashboard.");
      }
    } catch (err) {
      console.error("Retry payment error:", err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Could not initiate Stripe checkout. Please try again from your dashboard.";
      setErrorMessage(msg);
      setIsRetrying(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white rounded-3xl border border-[#E8D595] shadow-xl p-8 sm:p-10 text-center"
      >
        <div className="space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
            <XCircle className="w-12 h-12" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Payment Not Completed
            </span>
            <h1 className="text-3xl font-black text-[#351B17] mt-3">
              Checkout Cancelled
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              No money was charged. Your pizza order is safely saved in your account
              with payment status as <strong className="text-amber-700">Pending</strong>.
            </p>
          </div>

          {orderId && (
            <div className="bg-[#FFFDF7] rounded-2xl border border-[#E8D595]/60 p-4 text-xs sm:text-sm text-left">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Saved Order ID</span>
                <span className="font-mono font-bold text-[#351B17]">
                  #{orderId}
                </span>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-semibold text-left">
              {errorMessage}
            </div>
          )}

          <div className="pt-2 flex flex-col gap-3">
            {orderId && (
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                icon={CreditCard}
                disabled={isRetrying}
                onClick={handleRetryPayment}
              >
                {isRetrying ? "Preparing Stripe..." : "Retry Payment with Stripe"}
              </Button>
            )}

            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => navigate("/dashboard")}
            >
              View Order in Dashboard
            </Button>

            <button
              type="button"
              onClick={() => navigate("/#menu")}
              className="text-xs text-gray-500 hover:text-[#941508] font-bold flex items-center justify-center gap-1.5 pt-2 transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} /> Back to explore menu
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

