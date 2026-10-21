import React, { useContext, useState } from "react";
import GeneralContext from "./GeneralContext";
import { money } from "../api";

export default function WatchList() {
  const { quotes, openOrder, account } = useContext(GeneralContext);
  const [search, setSearch] = useState("");
  const filtered = quotes.filter((quote) =>
    quote.name.toLowerCase().includes(search.trim().toLowerCase()),
  );
  return (
    <aside className="watchlist-container" aria-label="Sample watchlist">
      <h2>Watchlist</h2>
      <label htmlFor="stock-search" className="sr-only">
        Search instruments
      </label>
      <input
        id="stock-search"
        type="search"
        placeholder="Search instruments"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <p className="muted">Fixed sample prices, not live market data.</p>
      <ul className="list">
        {filtered.map((quote) => {
          const owned =
            account.holdings.find((holding) => holding.name === quote.name)
              ?.qty || 0;
          return (
            <li key={quote.name}>
              <div className="quote">
                <strong>{quote.name}</strong>
                <span>{money(quote.price)}</span>
              </div>
              <div className="quote">
                <small className={quote.change < 0 ? "loss" : "profit"}>
                  {quote.change > 0 ? "+" : ""}
                  {quote.change.toFixed(2)}% sample change
                </small>
                <small>Owned: {owned}</small>
              </div>
              <div className="trade-actions">
                <button
                  className="buy"
                  onClick={() => openOrder(quote, "BUY")}
                  aria-label={`Buy ${quote.name}`}
                >
                  Buy
                </button>
                <button
                  className="sell"
                  disabled={!owned}
                  onClick={() => openOrder(quote, "SELL")}
                  aria-label={`Sell ${quote.name}`}
                >
                  Sell
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      {!filtered.length && (
        <p role="status">No instruments match your search.</p>
      )}
    </aside>
  );
}
