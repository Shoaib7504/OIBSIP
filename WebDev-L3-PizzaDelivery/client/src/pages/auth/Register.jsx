import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion, useReducedMotion } from "motion/react";
import {
  Pizza,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../../components/common/Button";
import { useCart } from "../../context/CartContext";
import ingredientPattern from "../../assets/images/ingredient-pattern.svg";
import { registerUser } from "../../services/authServices";
export const Register = () => {
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const { showToast } = useCart();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
  });

  const passwordValue = watch("password");

  const onSubmit = async (data) => {
    try {
      const userData = {
        name: data.fullName.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
        phone: data.phone?.trim() || "",
      }

      const response = await registerUser(userData)
    
      if (!response.success || !response.token) {
        throw new Error(response.message || "Register failed")
      }

      //save authencation data
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.data));

      showToast(
        "Account create successfully! Welcome to PizzaCrave.",
        "success"
      )
      navigate(
        response.data.role === "admin" ? "/admin" : "/dashboard",
        { replace: true }
      );
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong. Please try again.";

      showToast(message, "error");
    }
  };

  return (
    <div
      className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative bg-[#FFFDF7]"
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
        className="w-full max-w-lg bg-white rounded-3xl border border-[#E8D595] shadow-xl p-8 sm:p-10 relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-7">
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
            Join the Crave Club
          </h1>
          <p className="text-xs text-[#7A5C55] mt-1">
            Get 15% off your first wood-fired pizza and unlock express 30-min checkout.
          </p>
        </div>

        {/* Register Form using React Hook Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Full Name */}
          <div>
            <label
              htmlFor="register-name"
              className="block text-xs font-bold text-[#351B17] mb-1.5 uppercase tracking-wider"
            >
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <User size={18} />
              </div>
              <input
                id="register-name"
                type="text"
                autoComplete="name"
                placeholder="Sofia Bellini"
                {...register("fullName", {
                  required: "Full name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border bg-[#FFFDF7] text-[#351B17] placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.fullName
                  ? "border-red-500 focus:ring-red-400 bg-red-50/20"
                  : "border-gray-200 focus:ring-[#941508]"
                  }`}
                aria-invalid={errors.fullName ? "true" : "false"}
                aria-describedby={errors.fullName ? "register-name-error" : undefined}
              />
            </div>
            {errors.fullName && (
              <p id="register-name-error" className="mt-1 text-xs text-red-600 font-semibold" role="alert">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email & Phone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label
                htmlFor="register-email"
                className="block text-xs font-bold text-[#351B17] mb-1.5 uppercase tracking-wider"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  placeholder="sofia@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border bg-[#FFFDF7] text-[#351B17] placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.email
                    ? "border-red-500 focus:ring-red-400 bg-red-50/20"
                    : "border-gray-200 focus:ring-[#941508]"
                    }`}
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "register-email-error" : undefined}
                />
              </div>
              {errors.email && (
                <p id="register-email-error" className="mt-1 text-xs text-red-600 font-semibold" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="register-phone"
                className="block text-xs font-bold text-[#351B17] mb-1.5 uppercase tracking-wider"
              >
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Phone size={18} />
                </div>
                <input
                  id="register-phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+1 (555) 000-0000"
                  {...register("phone", {
                    pattern: {
                      value: /^[0-9+\s()-]{7,16}$/,
                      message: "Invalid phone number format",
                    },
                  })}
                  className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border bg-[#FFFDF7] text-[#351B17] placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.phone
                    ? "border-red-500 focus:ring-red-400 bg-red-50/20"
                    : "border-gray-200 focus:ring-[#941508]"
                    }`}
                  aria-invalid={errors.phone ? "true" : "false"}
                  aria-describedby={errors.phone ? "register-phone-error" : undefined}
                />
              </div>
              {errors.phone && (
                <p id="register-phone-error" className="mt-1 text-xs text-red-600 font-semibold" role="alert">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          {/* Password & Confirm Password Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Password */}
            <div>
              <label
                htmlFor="register-password"
                className="block text-xs font-bold text-[#351B17] mb-1.5 uppercase tracking-wider"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Min. 6 chars"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Min. 6 characters",
                    },
                  })}
                  className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border bg-[#FFFDF7] text-[#351B17] placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.password
                    ? "border-red-500 focus:ring-red-400 bg-red-50/20"
                    : "border-gray-200 focus:ring-[#941508]"
                    }`}
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? "register-password-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#351B17] cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p id="register-password-error" className="mt-1 text-xs text-red-600 font-semibold" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="register-confirm-password"
                className="block text-xs font-bold text-[#351B17] mb-1.5 uppercase tracking-wider"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  id="register-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Repeat password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === passwordValue || "Passwords do not match",
                  })}
                  className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border bg-[#FFFDF7] text-[#351B17] placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.confirmPassword
                    ? "border-red-500 focus:ring-red-400 bg-red-50/20"
                    : "border-gray-200 focus:ring-[#941508]"
                    }`}
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                  aria-describedby={errors.confirmPassword ? "register-confirm-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#351B17] cursor-pointer"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p id="register-confirm-error" className="mt-1 text-xs text-red-600 font-semibold" role="alert">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* Terms & Conditions Checkbox */}
          <div className="pt-1">
            <div className="flex items-start">
              <input
                id="agree-terms"
                type="checkbox"
                {...register("agreeTerms", {
                  required: "You must agree to the Terms & Privacy Policy",
                })}
                className="w-4 h-4 mt-0.5 text-[#941508] border-gray-300 rounded focus:ring-[#941508] cursor-pointer accent-[#941508]"
              />
              <label htmlFor="agree-terms" className="ml-2.5 text-xs text-[#7A5C55] cursor-pointer leading-relaxed">
                I agree to the PizzaCrave{" "}
                <a href="#terms" className="font-bold text-[#941508] underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#privacy" className="font-bold text-[#941508] underline">
                  Privacy Policy
                </a>
                .
              </label>
            </div>
            {errors.agreeTerms && (
              <p className="mt-1 text-xs text-red-600 font-semibold" role="alert">
                {errors.agreeTerms.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              icon={ArrowRight}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Create Account & Get 15% Off"}
            </Button>
          </div>
        </form>

        {/* Footer Link to Login */}
        <div className="mt-6 pt-5 border-t border-gray-100 text-center">
          <p className="text-xs text-[#7A5C55]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-[#941508] hover:text-[#C92719] underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#941508] rounded"
            >
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

