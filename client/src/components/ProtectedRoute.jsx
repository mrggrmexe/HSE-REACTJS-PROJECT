import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

export default function ProtectedRoute() {
  const { isAuthed } = useAuth();
  const location = useLocation();

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

