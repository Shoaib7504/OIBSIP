import React from "react";
import { useForm } from "react-hook-form";
import { motion } from "motion/react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  FileText,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle2,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../common/Button";


export const CheckoutForm = ({
  onSubmit,
  onCancel,
  totalAmount = 0,
  isSubmitting = false,
}) => {
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      postalCode: user?.address?.postalCode || "",
      deliveryNotes: "",
      paymentMethod: "COD",
    },
  });

  const selectedPayment = watch("paymentMethod");

  const onFormSubmit = async (data) => {
    if (onSubmit) {
      await onSubmit(data);
    }
  };

  const paymentOptions = [
    {
      id: "COD",
      label: "Cash on Delivery",
      description: "Pay with cash at your door upon delivery",
      icon: Banknote,
      badge: "Popular",
    },
    {
      id: "Card",
      label: "Credit / Debit Card",
      description: "Pay securely with Visa, MasterCard, or Amex",
      icon: CreditCard,
      badge: "Fast & Secure",
    },
    {
      id: "UPI",
      label: "UPI / Mobile Pay",
      description: "Google Pay, PhonePe, Apple Pay or UPI ID",
      icon: Smartphone,
      badge: "Instant",
    },
  ];

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      noValidate
      className="space-y-6 text-left"
      aria-label="Checkout Delivery and Payment Form"
    >
      {/* ─── Customer Contact Information ─── */}
      <div className="bg-[#FFFDF7] p-5 rounded-2xl border border-[#E8D595]/80 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#E8D595]/40">
          <div className="w-7 h-7 rounded-full bg-[#FFF0B8] text-[#941508] flex items-center justify-center font-bold text-xs">
            1
          </div>
          <h3 className="text-sm font-extrabold text-[#351B17] uppercase tracking-wide">
            Customer Information
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="sm:col-span-2">
            <label
              htmlFor="checkout-name"
              className="block text-xs font-bold text-[#351B17] mb-1.5 uppercase tracking-wider"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <User size={16} />
              </div>
              <input
                id="checkout-name"
                type="text"
                autoComplete="name"
                placeholder="e.g. Mario Rossi"
                {...register("name", {
                  required: "Customer name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                className={`w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border bg-white text-[#351B17] placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.name
                    ? "border-red-500 focus:ring-red-400 bg-red-50/20"
                    : "border-gray-200 focus:ring-[#941508]"
                }`}
                aria-invalid={errors.name ? "true" : "false"}
                aria-describedby={errors.name ? "checkout-name-error" : undefined}
              />
            </div>
            {errors.name && (
              <p id="checkout-name-error" className="mt-1 text-xs text-red-600 font-semibold" role="alert">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label
              htmlFor="checkout-email"
              className="block text-xs font-bold text-[#351B17] mb-1.5 uppercase tracking-wider"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail size={16} />
              </div>
              <input
                id="checkout-email"
                type="email"
                autoComplete="email"
                placeholder="mario@example.com"
                {...register("email", {
                  required: "Email address is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Please enter a valid email",
                  },
                })}
                className={`w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border bg-white text-[#351B17] placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? "border-red-500 focus:ring-red-400 bg-red-50/20"
                    : "border-gray-200 focus:ring-[#941508]"
                }`}
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "checkout-email-error" : undefined}
              />
            </div>
            {errors.email && (
              <p id="checkout-email-error" className="mt-1 text-xs text-red-600 font-semibold" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="checkout-phone"
              className="block text-xs font-bold text-[#351B17] mb-1.5 uppercase tracking-wider"
            >
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Phone size={16} />
              </div>
              <input
                id="checkout-phone"
                type="tel"
                autoComplete="tel"
                placeholder="+1 (555) 000-0000"
                {...register("phone", {
                  required: "Phone number is required for delivery updates",
                  pattern: {
                    value: /^[0-9+\s()-]{7,16}$/,
                    message: "Please enter a valid phone number",
                  },
                })}
                className={`w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border bg-white text-[#351B17] placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.phone
                    ? "border-red-500 focus:ring-red-400 bg-red-50/20"
                    : "border-gray-200 focus:ring-[#941508]"
                }`}
                aria-invalid={errors.phone ? "true" : "false"}
                aria-describedby={errors.phone ? "checkout-phone-error" : undefined}
              />
            </div>
            {errors.phone && (
              <p id="checkout-phone-error" className="mt-1 text-xs text-red-600 font-semibold" role="alert">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="bg-[#FFFDF7] p-5 rounded-2xl border border-[#E8D595]/80 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#E8D595]/40">
          <div className="w-7 h-7 rounded-full bg-[#FFF0B8] text-[#941508] flex items-center justify-center font-bold text-xs">
            2
          </div>
          <h3 className="text-sm font-extrabold text-[#351B17] uppercase tracking-wide">
            Delivery Address
          </h3>
        </div>

        <div className="space-y-4">
          {/* Street Address */}
          <div>
            <label
              htmlFor="checkout-street"
              className="block text-xs font-bold text-[#351B17] mb-1.5 uppercase tracking-wider"
            >
              Street Address, House / Apt <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <MapPin size={16} />
              </div>
              <input
                id="checkout-street"
                type="text"
                autoComplete="street-address"
                placeholder="e.g. 124 Via Roma, Apt 4B"
                {...register("street", {
                  required: "Street address is required",
                  minLength: {
                    value: 4,
                    message: "Please enter a valid complete address",
                  },
                })}
                className={`w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border bg-white text-[#351B17] placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.street
                    ? "border-red-500 focus:ring-red-400 bg-red-50/20"
                    : "border-gray-200 focus:ring-[#941508]"
                }`}
                aria-invalid={errors.street ? "true" : "false"}
                aria-describedby={errors.street ? "checkout-street-error" : undefined}
              />
            </div>
            {errors.street && (
              <p id="checkout-street-error" className="mt-1 text-xs text-red-600 font-semibold" role="alert">
                {errors.street.message}
              </p>
            )}
          </div>

          {/* City & Postal Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="checkout-city"
                className="block text-xs font-bold text-[#351B17] mb-1.5 uppercase tracking-wider"
              >
                City <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Building2 size={16} />
                </div>
                <input
                  id="checkout-city"
                  type="text"
                  autoComplete="address-level2"
                  placeholder="e.g. Naples"
                  {...register("city", {
                    required: "City is required",
                  })}
                  className={`w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border bg-white text-[#351B17] placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.city
                      ? "border-red-500 focus:ring-red-400 bg-red-50/20"
                      : "border-gray-200 focus:ring-[#941508]"
                  }`}
                  aria-invalid={errors.city ? "true" : "false"}
                  aria-describedby={errors.city ? "checkout-city-error" : undefined}
                />
              </div>
              {errors.city && (
                <p id="checkout-city-error" className="mt-1 text-xs text-red-600 font-semibold" role="alert">
                  {errors.city.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="checkout-postal"
                className="block text-xs font-bold text-[#351B17] mb-1.5 uppercase tracking-wider"
              >
                Postal / Zip Code <span className="text-red-500">*</span>
              </label>
              <input
                id="checkout-postal"
                type="text"
                autoComplete="postal-code"
                placeholder="e.g. 80121"
                {...register("postalCode", {
                  required: "Postal code is required",
                })}
                className={`w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border bg-white text-[#351B17] placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.postalCode
                    ? "border-red-500 focus:ring-red-400 bg-red-50/20"
                    : "border-gray-200 focus:ring-[#941508]"
                }`}
                aria-invalid={errors.postalCode ? "true" : "false"}
                aria-describedby={errors.postalCode ? "checkout-postal-error" : undefined}
              />
              {errors.postalCode && (
                <p id="checkout-postal-error" className="mt-1 text-xs text-red-600 font-semibold" role="alert">
                  {errors.postalCode.message}
                </p>
              )}
            </div>
          </div>

          {/* Optional Delivery Instructions */}
          <div>
            <label
              htmlFor="checkout-notes"
              className="block text-xs font-bold text-[#7A5C55] mb-1.5 uppercase tracking-wider"
            >
              Delivery Instructions (Optional)
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3.5 pointer-events-none text-gray-400">
                <FileText size={16} />
              </div>
              <textarea
                id="checkout-notes"
                rows={2}
                placeholder="e.g. Gate code #1234, ring doorbell, leave at front porch"
                {...register("deliveryNotes")}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 bg-white text-[#351B17] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#941508] transition-all resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="bg-[#FFFDF7] p-5 rounded-2xl border border-[#E8D595]/80 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-[#E8D595]/40">
          <div className="w-7 h-7 rounded-full bg-[#FFF0B8] text-[#941508] flex items-center justify-center font-bold text-xs">
            3
          </div>
          <h3 className="text-sm font-extrabold text-[#351B17] uppercase tracking-wide">
            Payment Method
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-2.5 pt-1" role="radiogroup" aria-label="Select Payment Method">
          {paymentOptions.map((option) => {
            const Icon = option.icon;
            const isChecked = selectedPayment === option.id;

            return (
              <label
                key={option.id}
                htmlFor={`payment-${option.id}`}
                className={`relative flex items-center gap-3.5 p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
                  isChecked
                    ? "bg-[#FFF0B8]/70 border-[#941508] shadow-xs"
                    : "bg-white hover:bg-gray-50/80 border-gray-200"
                }`}
              >
                <input
                  id={`payment-${option.id}`}
                  type="radio"
                  value={option.id}
                  {...register("paymentMethod", { required: true })}
                  className="sr-only"
                />

                {/* Custom Radio Circle */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    isChecked ? "border-[#941508] bg-[#941508]" : "border-gray-300 bg-white"
                  }`}
                  aria-hidden="true"
                >
                  {isChecked && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>

                {/* Icon */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isChecked ? "bg-[#941508] text-white" : "bg-[#FFF0B8] text-[#941508]"
                  }`}
                >
                  <Icon size={18} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-black text-[#351B17]">
                      {option.label}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF0B8] text-[#941508] border border-[#E8D595]">
                      {option.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#7A5C55] truncate mt-0.5">
                    {option.description}
                  </p>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Action Buttons (Submit & Cancel) */}
      <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-5 py-3 rounded-full border border-gray-300 hover:bg-gray-100 text-[#351B17] font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <ArrowLeft size={16} />
            <span>Cancel</span>
          </button>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full flex-1"
          icon={ShoppingBag}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Placing Order..."
            : totalAmount > 0
            ? `Place Order ($${Number(totalAmount).toFixed(2)})`
            : "Confirm & Place Order"}
        </Button>
      </div>
    </form>
  );
};

