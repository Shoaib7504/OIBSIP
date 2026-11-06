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
  const { setAuth, loginWithGoogle } = useAuth();
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const { showToast } = useCart();
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

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

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      const userData = await loginWithGoogle();
      showToast(`Welcome back, ${userData.name}!`, "success");
      if (userData.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      if (error.code !== "auth/popup-closed-by-user") {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Google sign-in failed. Please try again.";
        showToast(message, "error");
      }
    } finally {
      setIsGoogleLoading(false);
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
                className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border bg-[#FFFDF7] text-[#351B17] placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.email
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
              <Link
                to="/forgot-password"
                className="text-xs font-bold text-[#941508] hover:underline"
              >
                Forgot password?
              </Link>
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
                className={`w-full pl-10 pr-11 py-2.5 text-sm rounded-xl border bg-[#FFFDF7] text-[#351B17] placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.password
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

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-[#7A5C55] font-semibold">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-[#351B17] font-semibold text-sm transition-all shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-60 cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{isGoogleLoading ? "Connecting with Google..." : "Continue with Google"}</span>
        </button>

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
