import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { LockKeyhole, CheckCircle2, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { resetPassword } from "../../services/authServices";
import { Button } from "../../components/common/Button";

export const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!token) {
            setError("Invalid or missing password reset token.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const data = await resetPassword(token, password);

            setMessage(data.message);
            setPassword("");
            setConfirmPassword("");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to reset password. Please try again."
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
                    <LockKeyhole size={28} className="text-[#941508]" />
                </div>

                <h1 className="text-3xl font-black text-[#351B17] mb-2">
                    Reset Password
                </h1>

                <p className="text-[#795548] mb-7">
                    Create a new password for your Pizza Delivery account.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold mb-2">
                            New Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter new password"
                            minLength={6}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-[#E8D595] outline-none focus:border-[#941508] focus:ring-2 focus:ring-[#941508]/10"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2">
                            Confirm New Password
                        </label>

                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            minLength={6}
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
                        disabled={loading || Boolean(message)}
                        className="w-full"
                    >
                        {loading ? "Updating..." : "Reset Password"}
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