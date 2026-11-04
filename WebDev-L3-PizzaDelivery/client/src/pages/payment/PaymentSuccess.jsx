import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  ShoppingBag,
  ExternalLink,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import confetti from "canvas-confetti";
import { getSessionStatus } from "../../services/paymentServices";
import { Button } from "../../components/common/Button";

export const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");

  const [state, setState] = useState("loading"); // "loading" | "success" | "delayed" | "error"
  const [orderData, setOrderData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const pollCountRef = useRef(0);
  const confettiFiredRef = useRef(false);

  useEffect(() => {
    if (!sessionId) {
      setState("error");
      setErrorMessage("No checkout session found in the URL.");
      return;
    }

    let isMounted = true;
    let timerId = null;

    const checkPayment = async () => {
      try {
        pollCountRef.current += 1;
        const res = await getSessionStatus(sessionId);

        if (!isMounted) return;

        if (res?.success && res?.data) {
          setOrderData(res.data);

          if (res.data.paymentStatus === "Completed") {
            setState("success");
            if (!confettiFiredRef.current) {
              confettiFiredRef.current = true;
              confetti({
                particleCount: 150,
                spread: 90,
                origin: { y: 0.6 },
              });
            }
            return;
          }
        }

        // Keep polling if still Pending up to 8 times (~16s)
        if (pollCountRef.current < 8) {
          timerId = setTimeout(checkPayment, 2000);
        } else {
          // Webhook might be slightly delayed
          setState("delayed");
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Payment status polling error:", err);
        if (pollCountRef.current < 4) {
          timerId = setTimeout(checkPayment, 2500);
        } else {
          setState("delayed");
        }
      }
    };

    checkPayment();

    return () => {
      isMounted = false;
      if (timerId) clearTimeout(timerId);
    };
  }, [sessionId]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white rounded-3xl border border-[#E8D595] shadow-xl p-8 sm:p-10 text-center"
      >
        {state === "loading" && (
          <div className="space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#FFF0B8] flex items-center justify-center animate-pulse">
              <RefreshCw className="w-10 h-10 text-[#941508] animate-spin" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#351B17]">
                Verifying Payment...
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                We're securely confirming your transaction with Stripe. Hang tight!
              </p>
            </div>
          </div>
        )}

        {state === "success" && (
          <div className="space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12, stiffness: 200 }}
              className="w-20 h-20 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-md"
            >
              <CheckCircle2 className="w-12 h-12" />
            </motion.div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Payment Confirmed
              </span>
              <h1 className="text-3xl font-black text-[#351B17] mt-3">
                Order Received!
              </h1>
              <p className="text-sm text-gray-600 mt-2">
                Thank you! Your payment was verified successfully and our pizza master
                is already spinning up your order.
              </p>
            </div>

            {orderData && (
              <div className="bg-[#FFFDF7] rounded-2xl border border-[#E8D595]/60 p-4 text-left space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-500">Order ID</span>
                  <span className="font-mono font-bold text-[#351B17]">
                    #{orderData.orderId}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-500">Amount Paid</span>
                  <span className="font-bold text-[#941508] text-base">
                    ${Number(orderData.totalAmount || 0).toFixed(2)} USD
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-500">Payment Status</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                    <CheckCircle2 size={14} /> Completed
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Kitchen Status</span>
                  <span className="font-bold text-[#351B17]">
                    {orderData.status || "Placed"}
                  </span>
                </div>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Button
                variant="primary"
                size="lg"
                className="w-full flex-1"
                icon={ShoppingBag}
                onClick={() => navigate("/dashboard")}
              >
                Track in Dashboard
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => navigate("/#menu")}
              >
                Back to Menu
              </Button>
            </div>
          </div>
        )}

        {state === "delayed" && (
          <div className="space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
              <Clock className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Payment Processing
              </span>
              <h2 className="text-2xl font-black text-[#351B17] mt-3">
                Confirmation in Progress
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                We've received your checkout request from Stripe. Our system confirms
                all payments through verified webhooks. Your order will update in
                your dashboard momentarily.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Button
                variant="primary"
                size="lg"
                className="w-full flex-1"
                onClick={() => navigate("/dashboard")}
              >
                View in My Orders
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => window.location.reload()}
              >
                Check Again
              </Button>
            </div>
          </div>
        )}

        {state === "error" && (
          <div className="space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-[#351B17]">
                Unable to Verify Payment
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                {errorMessage || "We could not find the payment details for this session."}
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Button
                variant="primary"
                size="lg"
                className="w-full flex-1"
                onClick={() => navigate("/dashboard")}
              >
                Go to My Orders
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => navigate("/#menu")}
              >
                Explore Menu
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
