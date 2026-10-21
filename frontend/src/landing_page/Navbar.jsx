import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { dashboardUrl } from "../api";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav
      className="navbar navbar-expand-lg border-bottom bg-white"
      aria-label="Main navigation"
    >
      <div className="container py-2">
        <Link
          className="navbar-brand fw-semibold text-primary"
          to="/"
          onClick={() => setOpen(false)}
        >
          Paper Trading
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="site-nav"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen(!open)}
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div
          id="site-nav"
          className={`collapse navbar-collapse justify-content-end${open ? " show" : ""}`}
        >
          <div className="navbar-nav gap-lg-3" onClick={() => setOpen(false)}>
            {[
              ["/about", "About"],
              ["/product", "Features"],
              ["/pricing", "Pricing"],
              ["/support", "Help"],
              ["/login", "Log in"],
              ["/signup", "Sign up"],
            ].map(([path, label]) => (
              <NavLink className="nav-link" key={path} to={path}>
                {label}
              </NavLink>
            ))}
            <a className="nav-link" href={dashboardUrl}>
              Dashboard
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
