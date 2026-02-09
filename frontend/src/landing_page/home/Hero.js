import React from "react";

function Hero() {
  return (
    <div className="container p-5 text-center mb-5">
      <div className="row">
        <img src="media\homeHero.png" alt="homeHero" className="mb-5" />
        <h1 className="mt-5">Invest Smarter, Trade Better</h1>
        <p>
          Join our platform to unlock a world of investment opportunities with
          cutting-edge tools and insights.
        </p>
        <button
          className="p-3 btn btn-primary fs-5"
          style={{ width: "20%", margin: "0 auto" }}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Hero;
