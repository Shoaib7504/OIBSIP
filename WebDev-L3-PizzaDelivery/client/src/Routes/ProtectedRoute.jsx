import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute:
 * - Guards routes that require authentication
 * - If adminOnly is true, restricts access strictly to admin users
 */
export function ProtectedRoute({ adminOnly = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  // Wait until session restoration/verification check completes
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFDF7] p-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#941508]/20 border-t-[#941508] animate-spin mb-3" />
        <p className="text-sm font-bold text-[#351B17] tracking-wide animate-pulse">
          Verifying PizzaCrave session...
        </p>
      </div>
    );
  }

  // Redirect unauthenticated users to login with return target state
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Restrict admin routes strictly to admin role
  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

/**
 * PublicRoute:
 * - Used for Login and Register pages
 * - Redirects already logged-in users to their respective dashboards
 */
export function PublicRoute() {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFDF7] p-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#941508]/20 border-t-[#941508] animate-spin mb-3" />
        <p className="text-sm font-bold text-[#351B17] tracking-wide">
          Loading...
        </p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace />;
  }

  return <Outlet />;
}
