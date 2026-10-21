import React from "react";
import { Link } from "react-router-dom";
import OpenAccount from "../OpenAccount";

const features = [
  [
    "Practice both sides",
    "Buy shares from the sample watchlist and sell shares you own. Your virtual cash and portfolio update together.",
  ],
  [
    "See your progress",
    "Review executed orders, investment value, cash and profit or loss in your personal dashboard.",
  ],
  [
    "Stay in control",
    "Start with ₹1,00,000 in virtual cash. Add or withdraw practice funds whenever you need.",
  ],
];

export default function HomePage() {
  return (
    <main>
      <section className="container text-center py-5">
        <img
          className="img-fluid mb-4"
          src="/media/homeHero.png"
          alt="Trading dashboard illustration"
          style={{ maxHeight: 360 }}
        />
        <h1>Learn by placing your first paper trade</h1>
        <p className="lead text-muted my-4">
          Build a portfolio with virtual cash and fixed sample quotes.
        </p>
        <Link to="/signup" className="btn btn-primary px-4 py-3">
          Get started
        </Link>
        <p className="small text-muted mt-3">
          Free to use. No bank account required.
        </p>
      </section>
      <section className="container py-5">
        <div className="row g-4">
          {features.map(([title, text]) => (
            <article className="col-md-4" key={title}>
              <h2 className="h4">{title}</h2>
              <p className="text-muted">{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="container py-4">
        <div className="row align-items-center g-5">
          <div className="col-md-6">
            <img
              className="img-fluid"
              src="/media/education.svg"
              alt="Learning about investing"
            />
          </div>
          <div className="col-md-6">
            <h2>A simple place to start</h2>
            <p>
              Search an instrument, choose a quantity, and follow your trade
              from execution to your holdings. The help page explains each step.
            </p>
            <Link to="/support">Read the trading guide →</Link>
          </div>
        </div>
      </section>
      <OpenAccount />
    </main>
  );
}
