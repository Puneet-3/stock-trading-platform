import React from "react";

function Hero() {
  return (
    <div className="container">
      <div className="text-center mt-5 p-5 border-bottom"
        style={{ lineHeight: "3em" }}
      >
        <h1>Zerodha Products</h1>
        <h3 className="text-muted fs-4 mt-3 p-3 ">Sleek, modern, and intuitive trading platforms</h3>
        <p className="fs-5">
          Check out our{" "}
          <a href="" style={{ textDecoration: "none" }}>
            investment offerings{" "}
            <i class="fa fa-long-arrow-right" aria-hidden="true"></i>
          </a>
        </p>
      </div>
    </div>
  );
}

export default Hero;
