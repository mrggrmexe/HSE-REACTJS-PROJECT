import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./styles.css";

import Layout from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import GoodsPage from "./pages/GoodsPage.jsx";
import GoodDetailsPage from "./pages/GoodDetailsPage.jsx";
import SupportPage from "./pages/SupportPage.jsx";

import { AuthProvider, useAuth } from "./auth/AuthContext.jsx";

function RequireAuth({ children }) {
  const { isAuthed } = useAuth();
  const location = useLocation();

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="support" element={<SupportPage />} />

            <Route
              path="goods"
              element={
                <RequireAuth>
                  <GoodsPage />
                </RequireAuth>
              }
            />
            <Route
              path="goods/:id"
              element={
                <RequireAuth>
                  <GoodDetailsPage />
                </RequireAuth>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
