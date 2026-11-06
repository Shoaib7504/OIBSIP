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
} from "lucide-react";
import { Button } from "../../components/common/Button";
import { useCart } from "../../context/CartContext";
import ingredientPattern from "../../assets/images/ingredient-pattern.svg";
import { registerUser } from "../../services/authServices";
import { useAuth } from "../../context/AuthContext";

export const Register = () => {
  const { setAuth, loginWithGoogle } = useAuth();
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const { showToast } = useCart();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

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
      };

      const response = await registerUser(userData);

      if (!response.success) {
        throw new Error(response.message || "Registration failed");
      }

      if (response.token && response.data) {
        // Direct session creation (e.g. if verification is not enforced)
        setAuth(response.data, response.token);
        showToast(
          "Account created successfully! Welcome to PizzaCrave.",
          "success"
        );
        navigate(
          response.data.role === "admin" ? "/admin" : "/dashboard",
          { replace: true }
        );
      } else {
        // Verification email dispatched
        setRegisteredEmail(userData.email);
        showToast(
          response.message || "Registration successful! Please check your email to verify.",
          "success"
        );
      }
    } catch (error) {
      console.error("Register error:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong. Please check if the server is running.";

      showToast(message, "error");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      const userData = await loginWithGoogle();
      showToast(`Account ready! Welcome to PizzaCrave, ${userData.name}!`, "success");
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
          "Google registration failed. Please try again.";
        showToast(message, "error");
      }
    } finally {
      setIsGoogleLoading(false);
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

        {/* Registered Success Screen */}
        {registeredEmail ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-[#941508] border border-amber-200 flex items-center justify-center mx-auto shadow-sm">
              <Mail className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-[#351B17]">
              Check Your Inbox!
            </h2>
            <p className="text-sm text-[#786C55] leading-relaxed">
              We've sent a verification link to{" "}
              <strong className="text-[#351B17] font-semibold">{registeredEmail}</strong>.
            </p>
            <p className="text-xs text-[#786C55] bg-[#FFF0B8]/40 border border-[#E8D595] p-3 rounded-xl">
              Please click the link in your email within 15 minutes to verify your account and automatically log in.
            </p>
            <div className="pt-3 space-y-2">
              <Link
                to="/login"
                className="inline-block w-full py-3 bg-[#941508] hover:bg-[#7e1207] text-white rounded-xl font-bold text-sm shadow-md transition-colors"
              >
                Go to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <>
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
                className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border bg-[#FFFDF7] text-[#351B17] placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.fullName
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
                  className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border bg-[#FFFDF7] text-[#351B17] placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.email
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
                  className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border bg-[#FFFDF7] text-[#351B17] placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.phone
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
                  className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border bg-[#FFFDF7] text-[#351B17] placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.password
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
                  className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border bg-[#FFFDF7] text-[#351B17] placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.confirmPassword
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
          <span>{isGoogleLoading ? "Connecting with Google..." : "Sign up with Google"}</span>
        </button>
        </>
        )}

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
