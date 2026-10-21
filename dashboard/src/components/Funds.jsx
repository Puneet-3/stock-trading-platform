import React, { useContext, useRef, useState } from "react";
import GeneralContext from "./GeneralContext";
import { dateTime, money } from "../api";

export default function Funds() {
  const { account, mutate } = useContext(GeneralContext);
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("DEPOSIT");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const requestKey = useRef(crypto.randomUUID());
  const busy = useRef(false);
  function changed() {
    requestKey.current = crypto.randomUUID();
    setError("");
    setSuccess("");
  }

  async function submit(event) {
    event.preventDefault();
    if (busy.current) return;
    busy.current = true;
    setPending(true);
    setError("");
    setSuccess("");
    try {
      await mutate(
        "/funds",
        { amount: Number(amount), mode },
        requestKey.current,
      );
      setSuccess(
        `${money(Number(amount))} ${mode === "DEPOSIT" ? "added to" : "withdrawn from"} your virtual balance.`,
      );
      requestKey.current = crypto.randomUUID();
      setAmount("");
    } catch (err) {
      setError(
        err.status
          ? err.message
          : "The result could not be confirmed. Retry the same amount to safely check this transfer.",
      );
    } finally {
      busy.current = false;
      setPending(false);
    }
  }

  return (
    <>
      <h1>Virtual funds</h1>
      <p className="muted">
        These transfers only change your practice balance. No bank account or
        payment is involved.
      </p>
      <div className="stats-grid">
        <div>
          Available cash<strong>{money(account.cash)}</strong>
        </div>
        <div>
          Total equity<strong>{money(account.totals.equity)}</strong>
        </div>
      </div>
      <form className="fund-form" onSubmit={submit}>
        <label htmlFor="transfer-mode">Transfer type</label>
        <select
          id="transfer-mode"
          value={mode}
          disabled={pending}
          onChange={(event) => {
            setMode(event.target.value);
            changed();
          }}
        >
          <option value="DEPOSIT">Add virtual funds</option>
          <option value="WITHDRAW">Withdraw virtual funds</option>
        </select>
        <label htmlFor="amount">Amount (₹)</label>
        <input
          id="amount"
          type="number"
          min="0.01"
          max="1000000"
          step="0.01"
          required
          value={amount}
          disabled={pending}
          onChange={(event) => {
            setAmount(event.target.value);
            changed();
          }}
        />
        <button className="buy" disabled={pending}>
          {pending ? "Saving…" : "Confirm transfer"}
        </button>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className="profit" role="status">
            {success}
          </p>
        )}
      </form>
      <h2>Transfer history</h2>
      {!account.transfers.length ? (
        <p>No transfers yet. Your starting virtual balance is ₹1,00,000.</p>
      ) : (
        <div className="order-table">
          <table>
            <thead>
              <tr>
                <th>Time (IST)</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {account.transfers.map((transfer) => (
                <tr key={transfer.id}>
                  <td>{dateTime(transfer.createdAt)}</td>
                  <td>
                    {transfer.mode === "DEPOSIT" ? "Deposit" : "Withdrawal"}
                  </td>
                  <td>{money(transfer.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
