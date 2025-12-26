import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

export default function Layout() {
  const { isAuthed, logout } = useAuth();

  return (
    <>
      <header className="header">
        <nav className="nav">
          <NavLink to="/" end>
            Home
          </NavLink>

          {isAuthed && (
            <NavLink to="/goods" end>
              Goods
            </NavLink>
          )}

          <div className="spacer" />

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
