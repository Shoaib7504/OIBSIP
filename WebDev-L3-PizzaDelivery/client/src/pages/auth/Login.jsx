import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion, useReducedMotion } from "motion/react";
import {
  Pizza,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "../../components/common/Button";
import { useCart } from "../../context/CartContext";
import ingredientPattern from "../../assets/images/ingredient-pattern.svg";
import { loginUser } from "../../services/authServices";
import { useAuth } from "../../context/AuthContext";

export const Login = () => {
  const { setAuth } = useAuth();
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const { showToast } = useCart();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const handleQuickFill = (role) => {
    if (role === "admin") {
      setValue("email", "admin@pizzacrave.com");
      setValue("password", "Admin@123456");
    } else {
      setValue("email", "customer@pizzacrave.com");
      setValue("password", "Customer@123456");
    }
  };

  const onSubmit = async (data) => {
    console.log("Login Form Data:", data);
    try {
      const credentials = {
        email: data.email.trim().toLowerCase(),
        password: data.password,
      };
      const response = await loginUser(credentials);
      if (!response.success || !response.token || !response.data) {
        throw new Error(response.message || "Login failed");
      }
      // Save authentication information
      setAuth(response.data, response.token);

      // Show toast message
      showToast("Logged in successfully! Welcome back.", "success");

      // Redirect based on actual role
      if (response.data.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please verify credentials or check if the server is running.";

      showToast(message, "error");
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
      {/* Semi-transparent parchment layer */}
      <div className="absolute inset-0 bg-[#FFFDF7]/92 pointer-events-none" aria-hidden="true" />

      {/* Decorative Warm Ambient Glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#FFF0B8]/80 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#941508]/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-white rounded-3xl border border-[#E8D595] shadow-xl p-8 relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#941508] rounded-xl p-1 mb-3"
            aria-label="Back to PizzaCrave Home"
          >
            <div className="w-12 h-12 rounded-full bg-[#941508] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <Pizza size={26} className="rotate-12" aria-hidden="true" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-2xl font-black tracking-tight text-[#941508] leading-tight">
                Pizza<span className="text-[#F49A13]">Crave</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#7A5C55] -mt-0.5">
                Artisan Pizzeria
              </span>
            </div>
          </Link>

          <h1 className="text-2xl font-black text-[#351B17] tracking-tight">
            Welcome Back!
          </h1>
          <p className="text-xs text-[#7A5C55] mt-1">
            Sign in to track orders, save favorite pizzas, and earn craving points.
          </p>
        </div>

        {/* Quick Demo Fill Buttons for Reviewers */}
        <div className="mb-6 p-3 bg-[#FFF0B8]/50 rounded-2xl border border-[#E8D595] flex items-center justify-between text-xs">
          <span className="font-bold text-[#351B17] flex items-center gap-1.5">
            <Sparkles size={14} className="text-[#F49A13]" />
            Quick Demo:
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill("user")}
              className="px-2.5 py-1 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg font-bold text-[11px] text-[#351B17] cursor-pointer transition-colors"
            >
              Demo User
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill("admin")}
              className="px-2.5 py-1 bg-[#941508] hover:bg-[#7d1106] text-white rounded-lg font-bold text-[11px] cursor-pointer transition-colors"
            >
              Demo Admin
            </button>
          </div>
        </div>

        {/* Login Form using React Hook Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Email Field */}
          <div>
            <label
              htmlFor="login-email"
              className="block text-xs font-bold text-[#351B17] mb-1.5 uppercase tracking-wider"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail size={18} />
              </div>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...register("email", {
                  required: "Email address is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Please enter a valid email address",
                  },
                })}
                className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border bg-[#FFFDF7] text-[#351B17] placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? "border-red-500 focus:ring-red-400 bg-red-50/20"
                    : "border-gray-200 focus:ring-[#941508]"
                }`}
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "login-email-error" : undefined}
              />
            </div>
            {errors.email && (
              <p id="login-email-error" className="mt-1 text-xs text-red-600 font-semibold" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="login-password"
                className="block text-xs font-bold text-[#351B17] uppercase tracking-wider"
              >
                Password
              </label>
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  showToast("Password reset link sent to your registered email!", "info");
                }}
                className="text-xs font-bold text-[#941508] hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••••••"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className={`w-full pl-10 pr-11 py-2.5 text-sm rounded-xl border bg-[#FFFDF7] text-[#351B17] placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.password
                    ? "border-red-500 focus:ring-red-400 bg-red-50/20"
                    : "border-gray-200 focus:ring-[#941508]"
                }`}
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={errors.password ? "login-password-error" : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-[#351B17] cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p id="login-password-error" className="mt-1 text-xs text-red-600 font-semibold" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              {...register("rememberMe")}
              className="w-4 h-4 text-[#941508] border-gray-300 rounded focus:ring-[#941508] cursor-pointer accent-[#941508]"
            />
            <label htmlFor="remember-me" className="ml-2 text-xs font-semibold text-[#7A5C55] cursor-pointer">
              Remember me on this device
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              icon={ArrowRight}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing In..." : "Sign In to PizzaCrave"}
            </Button>
          </div>
        </form>

        {/* Footer Link to Register */}
        <div className="mt-6 pt-5 border-t border-gray-100 text-center">
          <p className="text-xs text-[#7A5C55]">
            Don't have an account yet?{" "}
            <Link
              to="/register"
              className="font-bold text-[#941508] hover:text-[#C92719] underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#941508] rounded"
            >
              Create Free Account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
