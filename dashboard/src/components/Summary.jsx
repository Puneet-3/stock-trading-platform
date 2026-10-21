import React, { useContext } from "react";
import { Link } from "react-router-dom";
import GeneralContext from "./GeneralContext";
import { money } from "../api";

export default function Summary() {
  const { account } = useContext(GeneralContext);
  const { user, cash, holdings, totals, orders } = account;
  return (
    <>
      <h1>Hi, {user.name}!</h1>
      <p className="muted">
        Your paper portfolio. Every new account starts with ₹1,00,000 in virtual
        cash.
      </p>
      <div className="stats-grid">
        <div>
          Available cash<strong>{money(cash)}</strong>
          <Link to="/funds">Manage funds</Link>
        </div>
        <div>
          Portfolio value<strong>{money(totals.value)}</strong>
          <Link to="/holdings">{holdings.length} holdings</Link>
        </div>
        <div>
          Total equity<strong>{money(totals.equity)}</strong>
          <span>Cash + portfolio value</span>
        </div>
        <div>
          Invested capital<strong>{money(totals.investment)}</strong>
        </div>
        <div>
          Unrealized P&amp;L
          <strong className={totals.pnl < 0 ? "loss" : "profit"}>
            {money(totals.pnl)}
          </strong>
        </div>
        <div>
          Realized P&amp;L
          <strong className={totals.realizedPnl < 0 ? "loss" : "profit"}>
            {money(totals.realizedPnl)}
          </strong>
        </div>
      </div>
      <section className="help-card">
        <h2>
          {orders.length
            ? `${orders.length} executed orders`
            : "Place your first paper trade"}
        </h2>
        <p>
          Search the watchlist, choose Buy, and enter a whole number of shares.
          Orders execute at the displayed sample price.
        </p>
        <Link to="/orders">View order history</Link>
      </section>
    </>
  );
}
