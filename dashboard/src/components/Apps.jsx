import React from "react";
import { Link } from "react-router-dom";
import { siteUrl } from "../api";

export default function Apps() {
  return (
    <>
      <h1>Paper trading guide</h1>
      <section className="help-card">
        <h2>Practice a full trade</h2>
        <ol>
          <li>Use the watchlist to buy shares at a fixed sample price.</li>
          <li>
            Review your <Link to="/holdings">holdings</Link> and{" "}
            <Link to="/orders">executed orders</Link>.
          </li>
          <li>Sell shares you own to return virtual cash to your balance.</li>
          <li>
            Use <Link to="/funds">Funds</Link> to add or withdraw practice
            money.
          </li>
        </ol>
        <p>
          This app supports delivery shares. Quotes are sample data; they do not
          update with the market. Intraday, derivatives and live brokerage
          execution are not included.
        </p>
        <a href={`${siteUrl}/support`}>Help and frequently asked questions</a>
      </section>
    </>
  );
}
