import React, { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { authenticate } from "../../api";
import "./signup.css";

export default function Signup() {
  const isLogin = useLocation().pathname === "/login";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const busy = useRef(false);
  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }
  async function submit(event) {
    event.preventDefault();
    if (busy.current) return;
    busy.current = true;
    setError("");
    setPending(true);
    try {
      await authenticate(isLogin ? "/login" : "/signup", form);
    } catch (err) {
      setError(
        err.name === "TypeError" || err.name === "TimeoutError"
          ? "Unable to reach the server. Please try again."
          : err.message,
      );
    } finally {
      busy.current = false;
      setPending(false);
    }
  }
  return (
    <main className="signup-container">
      <div className="signup-left">
        <h1>
          {isLogin ? "Welcome back" : "Build confidence before you invest"}
        </h1>
        <p>
          Practice buying and selling shares with ₹1,00,000 in virtual cash.
          Sample quotes, no real money.
        </p>
      </div>
      <div className="signup-right">
        <h2>{isLogin ? "Log in" : "Create your free account"}</h2>
        <form onSubmit={submit} className="signup-form">
          {!isLogin && (
            <>
              <label htmlFor="full-name">Full name</label>
              <input
                id="full-name"
                name="name"
                autoComplete="name"
                maxLength="80"
                value={form.name}
                onChange={change}
                required
                disabled={pending}
              />
            </>
          )}
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            maxLength="254"
            value={form.email}
            onChange={change}
            required
            disabled={pending}
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            minLength={isLogin ? 1 : 8}
            maxLength="72"
            value={form.password}
            onChange={change}
            required
            disabled={pending}
          />
          {!isLogin && (
            <p className="small text-muted">
              Use at least 8 characters. Passwords are limited to 72 bytes.
            </p>
          )}
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <button disabled={pending}>
            {pending ? "Please wait…" : isLogin ? "Log in" : "Create account"}
          </button>
        </form>
        <p className="mt-3">
          {isLogin ? "New here?" : "Already have an account?"}{" "}
          <Link to={isLogin ? "/signup" : "/login"}>
            {isLogin ? "Create an account" : "Log in"}
          </Link>
        </p>
      </div>
    </main>
  );
}
