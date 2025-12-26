import React from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import logo from "../assets/brand/logo.png";

export default function Layout() {
  const { isAuthed, logout } = useAuth();

  return (
    <>
      <header className="header">
        <nav className="nav">
          <Link to="/" className="brand" aria-label="Fruit Shop">
            <img className="brand__logo" src={logo} alt="Fruit Shop" />
            <span className="brand__text">Fruit Shop</span>
          </Link>

          {isAuthed && (
            <NavLink to="/goods" end>
              Goods
            </NavLink>
          )}

          <div className="spacer" />

          {/* Техподдержка слева от Login/Logout */}
          <NavLink to="/support" end>
            Support
          </NavLink>

          {!isAuthed ? (
            <NavLink to="/login" end>
              Login
            </NavLink>
          ) : (
            <button onClick={logout} title="Logout">
              Logout
            </button>
          )}
        </nav>
      </header>

      <main className="container">
        <Outlet />
      </main>
    </>
  );
}
