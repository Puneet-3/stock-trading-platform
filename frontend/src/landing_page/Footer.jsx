import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-top mt-5 py-5 bg-light">
      <div className="container">
        <div className="d-flex flex-wrap justify-content-between gap-4">
          <div>
            <h2 className="h5">Paper Trading</h2>
            <p className="text-muted">A place to practice, track, and learn.</p>
          </div>
          <nav
            aria-label="Footer navigation"
            className="d-flex gap-4 flex-wrap"
          >
            <Link to="/about">About</Link>
            <Link to="/product">Features</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/support">Help</Link>
            <Link to="/signup">Create account</Link>
          </nav>
        </div>
        <p className="small text-muted mt-4 mb-0">
          An independent educational project inspired by Zerodha. Not affiliated
          with Zerodha or a registered brokerage. All balances, trades and
          quotes are simulated. No real securities or money are exchanged.
        </p>
      </div>
    </footer>
  );
}
