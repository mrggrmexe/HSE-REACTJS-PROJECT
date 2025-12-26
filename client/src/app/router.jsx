import React from "react";
import { createBrowserRouter } from "react-router-dom";

import Layout from "../components/Layout.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import ErrorPage from "../components/ErrorPage.jsx";

import HomePage from "../pages/HomePage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import GoodsPage from "../pages/GoodsPage.jsx";
import GoodDetailsPage from "../pages/GoodDetailsPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },

      {
        element: <ProtectedRoute />,
        children: [
          { path: "goods", element: <GoodsPage /> },
          { path: "goods/:id", element: <GoodDetailsPage /> }
        ]
      },

      { path: "*", element: <NotFoundPage /> }
    ]
  }
]);

