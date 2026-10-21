import React, { useContext } from "react";
import { Link } from "react-router-dom";
import GeneralContext from "./GeneralContext";
import { money } from "../api";
import { VerticalGraph } from "./VerticalGraph";

export default function Holdings({ title = "Holdings" }) {
  const { account, quotes, openOrder } = useContext(GeneralContext);
  const { holdings, totals } = account;
  const data = {
    labels: holdings.map((stock) => stock.name),
    datasets: [
      {
        label: "Current value (₹)",
        data: holdings.map((stock) => stock.value),
        backgroundColor: "#4184f3",
      },
    ],
  };
  return (
    <>
      <h1>
        {title} ({holdings.length})
      </h1>
      <p className="muted">
        Delivery shares valued at the fixed sample quotes.
      </p>
      {!holdings.length ? (
        <p>
          Your portfolio is empty. Buy an instrument from the watchlist, or{" "}
          <Link to="/funds">manage your virtual funds</Link>.
        </p>
      ) : (
        <>
          <div className="order-table">
            <table>
              <thead>
                <tr>
                  <th>Instrument</th>
                  <th>Qty.</th>
                  <th>Avg. cost</th>
                  <th>Sample price</th>
                  <th>Value</th>
                  <th>P&amp;L</th>
                  <th>Sample change</th>
                  <th>Trade</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((stock) => (
                  <tr key={stock.name}>
                    <td>{stock.name}</td>
                    <td>{stock.qty}</td>
                    <td>{money(stock.avg)}</td>
                    <td>{money(stock.price)}</td>
                    <td>{money(stock.value)}</td>
                    <td className={stock.pnl < 0 ? "loss" : "profit"}>
                      {money(stock.pnl)}
                    </td>
                    <td className={stock.day < 0 ? "loss" : "profit"}>
                      {stock.day.toFixed(2)}%
                    </td>
                    <td>
                      <button
                        className="sell"
                        onClick={() =>
                          openOrder(
                            quotes.find((quote) => quote.name === stock.name),
                            "SELL",
                          )
                        }
                      >
                        Sell
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="stats-grid">
            <div>
              Investment<strong>{money(totals.investment)}</strong>
            </div>
            <div>
              Current value<strong>{money(totals.value)}</strong>
            </div>
            <div>
              Unrealized P&amp;L
              <strong className={totals.pnl < 0 ? "loss" : "profit"}>
                {money(totals.pnl)}
              </strong>
            </div>
          </div>
          <div className="portfolio-chart">
            <VerticalGraph data={data} />
          </div>
        </>
      )}
    </>
  );
}
