import React from "react";
import { Link } from "react-router-dom";
import OpenAccount from "../OpenAccount";

const features = [
  [
    "Sample watchlist",
    "Search nine instruments and practice at fixed sample prices. Quotes are illustrative and do not follow the live market.",
  ],
  [
    "Buy and sell",
    "Place delivery market orders using virtual cash. You can sell shares you already own; short selling is not supported.",
  ],
  [
    "Your portfolio",
    "View holdings, open delivery positions, average cost, current value and profit or loss.",
  ],
  [
    "Order history",
    "Every executed paper order is recorded with its instrument, quantity, price and time.",
  ],
  [
    "Virtual funds",
    "Begin with ₹1,00,000. Practice deposits and withdrawals without a bank account or payment gateway.",
  ],
  [
    "Your own account",
    "Sign in to access your portfolio. Account data is private to the signed-in user.",
  ],
];

export default function ProductPage() {
  return (
    <main className="container py-5">
      <header className="text-center mb-5">
        <h1>Everything you need for a paper trade</h1>
        <p className="lead text-muted">A focused delivery-trading simulator.</p>
      </header>
      <div className="row g-4">
        {features.map(([title, text]) => (
          <article className="col-md-6" key={title}>
            <div className="border rounded p-4 h-100">
              <h2 className="h4">{title}</h2>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-4">
        Need a walkthrough? <Link to="/support">Visit Help</Link>.
      </p>
      <OpenAccount />
    </main>
  );
}
