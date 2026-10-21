import React, { useContext, useEffect, useRef, useState } from "react";
import GeneralContext from "./GeneralContext";
import { money } from "../api";
import "./BuyActionWindow.css";

export default function BuyActionWindow({ quote, mode, onClose }) {
  const { account, mutate, setNotice } = useContext(GeneralContext);
  const [quantity, setQuantity] = useState(1);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const requestKey = useRef(crypto.randomUUID());
  const dialog = useRef(null);
  const busy = useRef(false);
  const owned =
    account.holdings.find((holding) => holding.name === quote.name)?.qty || 0;
  const total = Number(quantity) * quote.price;
  const valid =
    Number.isSafeInteger(Number(quantity)) &&
    Number(quantity) > 0 &&
    Number(quantity) <= 1000000;

  useEffect(() => {
    dialog.current.showModal();
  }, []);

  async function submit(event) {
    event.preventDefault();
    if (busy.current || !valid) return;
    busy.current = true;
    setPending(true);
    setError("");
    try {
      await mutate(
        "/newOrder",
        { name: quote.name, qty: Number(quantity), mode },
        requestKey.current,
      );
      setNotice(
        `${mode === "BUY" ? "Bought" : "Sold"} ${quantity} ${quote.name} at ${money(quote.price)} per share.`,
      );
      onClose();
    } catch (err) {
      setError(
        err.status
          ? err.message
          : "The result could not be confirmed. Retry without changing the quantity to safely check this order.",
      );
    } finally {
      busy.current = false;
      setPending(false);
    }
  }

  return (
    <dialog
      ref={dialog}
      className="trade-dialog"
      aria-labelledby="order-title"
      onCancel={(event) => {
        event.preventDefault();
        if (!pending) onClose();
      }}
    >
      <form onSubmit={submit}>
        <h2 id="order-title">
          {mode === "BUY" ? "Buy" : "Sell"} {quote.name}
        </h2>
        <p>Paper market order · Fixed sample price</p>
        <p>
          Available cash: {money(account.cash)} · Owned: {owned}
        </p>
        <label htmlFor="quantity">Quantity</label>
        <input
          autoFocus
          id="quantity"
          type="number"
          min="1"
          max="1000000"
          step="1"
          required
          value={quantity}
          disabled={pending}
          onChange={(event) => {
            setQuantity(event.target.value);
            requestKey.current = crypto.randomUUID();
            setError("");
          }}
        />
        <p>
          Price per share: <strong>{money(quote.price)}</strong>
        </p>
        <p>
          Total: <strong>{money(valid ? total : 0)}</strong>
        </p>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <div className="dialog-actions">
          <button type="button" onClick={onClose} disabled={pending}>
            Cancel
          </button>
          <button
            className={mode === "BUY" ? "buy" : "sell"}
            disabled={
              pending ||
              !valid ||
              (mode === "SELL"
                ? Number(quantity) > owned
                : total > account.cash)
            }
          >
            {pending ? "Submitting…" : `Confirm ${mode.toLowerCase()}`}
          </button>
        </div>
      </form>
    </dialog>
  );
}
