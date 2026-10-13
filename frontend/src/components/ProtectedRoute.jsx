import React from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../hooks/useAuth.js";
import { FullPageLoader } from "./Loader.jsx";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <FullPageLoader label="Checking your session..." />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
