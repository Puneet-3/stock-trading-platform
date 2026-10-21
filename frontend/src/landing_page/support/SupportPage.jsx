import React, { useState } from "react";
import { Link } from "react-router-dom";

const questions = [
  [
    "How do I start?",
    "Create an account or log in, then open the dashboard. New accounts receive ₹1,00,000 in virtual cash. Search the watchlist, select Buy, enter a whole quantity and confirm.",
  ],
  [
    "Are prices live?",
    "No. Every instrument has a fixed sample quote. The displayed percentage change is sample data too. This makes trades repeatable for practice; prices do not reflect current markets.",
  ],
  [
    "How do I sell shares?",
    "Use Sell in the watchlist or next to a holding. You can sell up to the quantity you own. Proceeds return to your virtual cash balance.",
  ],
  [
    "Where are my orders and positions?",
    "Orders lists all executed trades, newest first. Holdings and Positions show your open delivery shares. Fully sold instruments disappear from your holdings but remain in order history.",
  ],
  [
    "How do I add or withdraw funds?",
    "Open Funds, choose a transfer type and enter an amount. Transfers affect virtual cash only. Withdrawals cannot exceed your available cash.",
  ],
  [
    "An order timed out. Should I retry?",
    "Retry the same order without changing its quantity. The app reuses the request key so a retry cannot execute the same order twice. You can also check Orders before placing a new trade.",
  ],
  [
    "Why is my profit or loss zero?",
    "Sample prices are fixed. Buying and selling at the same price produces no profit or loss. The dashboard calculates these values from your actual paper holdings and executed orders.",
  ],
  [
    "How do I access an existing account?",
    "Choose Log in and enter your registered email and password. Signup creates a new account. Password recovery and email delivery are not available in this local project.",
  ],
  [
    "Is this a real brokerage account?",
    "No. This is an independent simulator. No real money, securities, bank transfers, derivatives or live exchange orders are involved.",
  ],
];

export default function SupportPage() {
  const [search, setSearch] = useState("");
  const matches = questions.filter((entry) =>
    entry.join(" ").toLowerCase().includes(search.trim().toLowerCase()),
  );
  return (
    <main className="container py-5" style={{ maxWidth: 850 }}>
      <h1>Help with paper trading</h1>
      <p className="text-muted">
        Answers to common account and trading questions.
      </p>
      <label className="form-label mt-3" htmlFor="help-search">
        Search help
      </label>
      <input
        className="form-control mb-4"
        id="help-search"
        type="search"
        placeholder="Try orders, funds, or login"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      {matches.map(([question, answer]) => (
        <details className="border rounded p-3 mb-3" key={question}>
          <summary className="fw-semibold">{question}</summary>
          <p className="mt-3 mb-0">{answer}</p>
        </details>
      ))}
      {!matches.length && (
        <p role="status">No answers match your search. Try a different word.</p>
      )}
      <p className="mt-4">
        <Link to="/login">Log in</Link> or{" "}
        <Link to="/signup">create an account</Link> to start practicing.
      </p>
    </main>
  );
}
