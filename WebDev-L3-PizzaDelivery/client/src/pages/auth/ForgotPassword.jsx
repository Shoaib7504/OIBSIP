import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { forgotPassword } from "../../services/authServices";
import { Button } from "../../components/common/Button";

export const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage("");
        setError("");

        try {
            const data = await forgotPassword(email);
            setMessage(data.message);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#E8D595] p-8"
            >
                <div className="w-14 h-14 bg-[#FFF0B8] rounded-2xl flex items-center justify-center mb-6">
                    <Mail size={28} className="text-[#941508]" />
                </div>

                <h1 className="text-3xl font-black text-[#351B17] mb-2">
                    Forgot Password?
                </h1>

                <p className="text-[#795548] mb-7">
                    Enter your registered email address. We'll send you a password reset
                    link.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold mb-2">
                            Email Address
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-[#E8D595] outline-none focus:border-[#941508] focus:ring-2 focus:ring-[#941508]/10"
                        />
                    </div>

                    {message && (
                        <div className="p-3 rounded-xl bg-green-50 text-green-700 text-sm flex gap-2">
                            <CheckCircle2 size={18} className="shrink-0" />
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </Button>
                </form>

                <Link
                    to="/login"
                    className="flex items-center justify-center gap-2 mt-6 text-sm font-bold text-[#941508] hover:underline"
                >
                    <ArrowLeft size={16} />
                    Back to Login
                </Link>
            </motion.div>
        </div>
    );
};