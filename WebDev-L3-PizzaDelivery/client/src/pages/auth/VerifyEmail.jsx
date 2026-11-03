import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import {
  CheckCircle2,
  AlertCircle,
  Pizza,
  ArrowRight,
  Mail,
  Loader2,
  RefreshCw,
  LogIn,
} from "lucide-react";
import { Button } from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { verifyEmail, resendVerificationEmail } from "../../services/authServices";
import ingredientPattern from "../../assets/images/ingredient-pattern.svg";

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { setAuth, isAuthenticated, isAdmin } = useAuth();
  const { showToast } = useCart();
  const shouldReduceMotion = useReducedMotion();

  const [status, setStatus] = useState("verifying"); // 'verifying' | 'success' | 'already_verified' | 'error'
  const [message, setMessage] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const requestDispatched = useRef(false);

  useEffect(() => {
    // If the user is already authenticated in this session, redirect them directly
    if (isAuthenticated) {
      navigate(isAdmin ? "/admin" : "/dashboard", { replace: true });
      return;
    }

    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing. Please check the link in your email.");
      return;
    }

    // Guard against React StrictMode executing twice
    if (requestDispatched.current) {
      return;
    }
    requestDispatched.current = true;

    const performVerification = async () => {
      try {
        const response = await verifyEmail(token);

        if (response.success && response.token && response.data) {
          // Log user in automatically
          setAuth(response.data, response.token);
          setStatus("success");
          setMessage(
            response.message || "Email verified successfully! Welcome to PizzaCrave."
          );
          showToast("Email verified successfully! You are now logged in.", "success");

          // Auto-redirect to dashboard
          setTimeout(() => {
            if (response.data.role === "admin") {
              navigate("/admin", { replace: true });
            } else {
              navigate("/dashboard", { replace: true });
            }
          }, 2000);
        } else {
          setStatus("error");
          setMessage(response.message || "Failed to verify email.");
        }
      } catch (err) {
        const errMsg =
          err.response?.data?.message ||
          err.message ||
          "Verification link is invalid or has expired.";

        // If the error message indicates the email is already verified
        if (errMsg.toLowerCase().includes("already verified")) {
          setStatus("already_verified");
          setMessage(errMsg);
        } else {
          setStatus("error");
          setMessage(errMsg);
        }
      }
    };

    performVerification();
  }, [token, navigate, setAuth, showToast, isAuthenticated, isAdmin]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!resendEmail.trim()) {
      showToast("Please enter your email address", "error");
      return;
    }

    setIsResending(true);
    try {
      const response = await resendVerificationEmail(resendEmail.trim());
      setResendSuccess(true);
      showToast(response.message || "New verification link sent!", "success");
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to resend verification link.",
        "error"
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div
      className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative bg-[#FFFDF7]"
      style={{
        backgroundImage: `url(${ingredientPattern})`,
        backgroundRepeat: "repeat",
        backgroundSize: "440px",
      }}
    >
      <div className="absolute inset-0 bg-[#FFFDF7]/92 pointer-events-none" aria-hidden="true" />
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#FFF0B8]/80 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#941508]/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-white rounded-3xl border border-[#E8D595] shadow-xl p-8 relative z-10 text-center"
      >
        {/* Brand Header */}
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 group mb-6 focus-visible:outline-[#941508]"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#941508] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-300">
            <Pizza className="w-6 h-6" />
          </div>
          <span className="font-['Cinzel',serif] text-2xl font-bold tracking-tight text-[#351B17]">
            PIZZA<span className="text-[#941508]">CRAVE</span>
          </span>
        </Link>

        {/* State: Verifying */}
        {status === "verifying" && (
          <div className="py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FFF0B8] flex items-center justify-center mx-auto text-[#941508] animate-pulse">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-[#351B17]">
              Verifying your email...
            </h2>
            <p className="text-sm text-[#786C55]">
              Please hold on while we verify your PizzaCrave account.
            </p>
          </div>
        )}

        {/* State: Success */}
        {status === "success" && (
          <div className="py-6 space-y-4">
            <motion.div
              initial={shouldReduceMotion ? {} : { scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200 shadow-sm"
            >
              <CheckCircle2 className="w-9 h-9" />
            </motion.div>
            <h2 className="text-2xl font-bold text-[#351B17]">
              Email Verified! 🎉
            </h2>
            <p className="text-sm text-[#786C55] leading-relaxed">
              {message}
            </p>
            <p className="text-xs text-[#941508] font-semibold animate-pulse">
              Automatically logging you in and redirecting...
            </p>
            <div className="pt-2">
              <Button
                variant="primary"
                fullWidth
                onClick={() => navigate("/dashboard")}
                className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold"
              >
                Go to Dashboard Now
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* State: Already Verified */}
        {status === "already_verified" && (
          <div className="py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto border border-amber-200 shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h2 className="text-2xl font-bold text-[#351B17]">
              Already Verified!
            </h2>
            <p className="text-sm text-[#786C55] leading-relaxed">
              Your email address has already been verified. You can log in directly to access your account.
            </p>
            <div className="pt-3">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#941508] hover:bg-[#7e1207] text-white rounded-xl font-bold text-sm shadow-md transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Go to Sign In
              </Link>
            </div>
          </div>
        )}

        {/* State: Error */}
        {status === "error" && (
          <div className="py-4 space-y-4 text-left">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-[#941508] flex items-center justify-center mx-auto border border-rose-200 shadow-sm">
              <AlertCircle className="w-9 h-9" />
            </div>
            <h2 className="text-xl font-bold text-[#351B17] text-center">
              Verification Link Failed
            </h2>
            <p className="text-sm text-[#786C55] text-center leading-relaxed">
              {message}
            </p>

            <div className="mt-6 pt-6 border-t border-[#E8D595]/60">
              <h3 className="text-sm font-bold text-[#351B17] mb-2 flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-[#941508]" />
                Resend Verification Link
              </h3>
              {resendSuccess ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium">
                   A new verification link has been sent! Check your inbox.
                </div>
              ) : (
                <form onSubmit={handleResend} className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#786C55]" />
                    <input
                      type="email"
                      placeholder="Enter your registered email"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-[#FFFDF7] border border-[#E8D595] rounded-xl text-sm focus:outline-[#941508] text-[#351B17]"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="outline"
                    fullWidth
                    disabled={isResending}
                    className="py-2.5 text-xs font-bold"
                  >
                    {isResending ? "Sending link..." : "Send New Link"}
                  </Button>
                </form>
              )}
            </div>

            <div className="pt-4 text-center">
              <Link
                to="/login"
                className="text-sm font-bold text-[#941508] hover:underline"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
