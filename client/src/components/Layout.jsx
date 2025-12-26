import React from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import logo from "../assets/brand/logo.png";

export default function Layout() {
  const { isAuthed, logout } = useAuth();
  const year = new Date().getFullYear();

  return (
    <div className="appShell">
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

      <main className="container appMain">
        <Outlet />
      </main>

      <footer className="footer" role="contentinfo">
        <div className="footer__inner">
          <span className="footer__copyright">© {year} Fruit Shop</span>
          <Link className="footer__link" to="/support">
            Support
          </Link>
        </div>
      </footer>
    </div>
  );
}
