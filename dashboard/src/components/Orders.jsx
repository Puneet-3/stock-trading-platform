import React, { useContext, useState } from "react";
import GeneralContext from "./GeneralContext";
import { dateTime, money } from "../api";

export default function Orders() {
  const { account } = useContext(GeneralContext);
  const [filter, setFilter] = useState("ALL");
  const orders = account.orders.filter(
    (order) => filter === "ALL" || order.mode === filter,
  );
  return (
    <>
      <h1>Orders ({account.orders.length})</h1>
      <label htmlFor="order-filter">Order type </label>
      <select
        id="order-filter"
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
      >
        <option value="ALL">All</option>
        <option value="BUY">Buy</option>
        <option value="SELL">Sell</option>
      </select>
      {!orders.length ? (
        <p>
          No {filter === "ALL" ? "" : filter.toLowerCase()} orders yet. Place a
          trade from the watchlist.
        </p>
      ) : (
        <div className="order-table">
          <table>
            <thead>
              <tr>
                <th>Time (IST)</th>
                <th>Instrument</th>
                <th>Type</th>
                <th>Qty.</th>
                <th>Price</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{dateTime(order.createdAt)}</td>
                  <td>{order.name}</td>
                  <td className={order.mode === "BUY" ? "profit" : "loss"}>
                    {order.mode}
                  </td>
                  <td>{order.qty}</td>
                  <td>{money(order.price)}</td>
                  <td>{money(order.total)}</td>
                  <td>Executed</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
