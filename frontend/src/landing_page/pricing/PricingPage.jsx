import React from "react";
import OpenAccount from "../OpenAccount";

export default function PricingPage() {
  return (
    <main className="container py-5 text-center">
      <h1>Free practice. Clear limits.</h1>
      <p className="lead text-muted my-4">
        This educational simulator does not charge fees or process payments.
      </p>
      <div className="row g-4 my-4">
        {[
          [
            "₹0",
            "Account fees",
            "Create an account and use the dashboard for free.",
          ],
          [
            "₹1,00,000",
            "Starting virtual cash",
            "Practice with a fresh balance for each new account.",
          ],
          [
            "₹0",
            "Simulated brokerage",
            "Paper orders have no brokerage, taxes or exchange charges.",
          ],
        ].map(([value, title, text]) => (
          <div className="col-md-4" key={title}>
            <article className="border rounded p-4 h-100">
              <p className="display-6 text-primary">{value}</p>
              <h2 className="h4">{title}</h2>
              <p>{text}</p>
            </article>
          </div>
        ))}
      </div>
      <p className="text-muted">
        Real trading costs and market execution differ. This app offers fixed
        sample prices and immediate simulated fills.
      </p>
      <OpenAccount />
    </main>
  );
}
