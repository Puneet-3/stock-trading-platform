import React from "react";
import { Link } from "react-router-dom";

export default function OpenAccount() {
  return (
    <section className="container py-5 my-4 text-center">
      <h2>Ready to practice?</h2>
      <p className="text-muted my-3">
        Create an account and explore your own virtual portfolio.
      </p>
      <Link className="btn btn-primary px-4 py-3" to="/signup">
        Sign up for free
      </Link>
    </section>
  );
}
