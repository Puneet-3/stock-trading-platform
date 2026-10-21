import React from "react";
import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <main className="container py-5" style={{ maxWidth: 850 }}>
      <h1>A simpler way to practice trading</h1>
      <p className="lead my-4">
        Paper Trading is an independent educational project inspired by the
        clean layout of Zerodha.
      </p>
      <p>
        It brings account management, a sample watchlist, delivery orders and a
        personal portfolio into one practice workflow. You can explore how
        buying and selling affects your cash and holdings without risking real
        money.
      </p>
      <h2 className="h4 mt-5">What to expect</h2>
      <p>
        All prices are fixed sample data. Orders fill immediately at the
        displayed sample price, with no brokerage or taxes. The app does not
        connect to an exchange, broker, bank or payment provider.
      </p>
      <h2 className="h4 mt-4">Start with one trade</h2>
      <p>
        Create an account, pick an instrument, and buy a few shares. Your
        dashboard will show the cash used, the new holding and the executed
        order.
      </p>
      <Link className="btn btn-primary mt-3" to="/signup">
        Create your practice account
      </Link>
    </main>
  );
}
