import React from "react";

function Hero() {
  return (
    <section className="container-fluid" id="supportHero">
      <div className="row p-2 pt-5 m-5" id="supportWrapper">
        <div className="col-1"></div>
        <div className="col-5">
          <h3 className="fs-3 ">Support Portal</h3>
        </div>
        <div className="col-3"></div>
        <div className="col-3">
          <a href="">Track Tickets</a>
        </div>
      </div>
      <div className="row p-3 ">
        <div className="col-1"></div>
        <div className="col-5 p-5 ">
          <h3>
            Search for an answer or browse help topics <br /> to create a ticket
          </h3>
          <input
            placeholder="Eg. How do i activate F&O"
            className="p-3 mt-3 mb-3 w-75 border rounded"
          />
          <br />
          <a href="">Track Account Opening</a>
          <a href="">Track Segment activation</a>
          <a href="">Intraday margins</a>
          <a href="">Kite user manual</a>
        </div>
        <div className="col-1"></div>
        <div className="col-5 pt-5 ">
          <h3>Featured</h3>
          <ol style={{ lineHeight: 2 }}>
            <li>
              <a href="">Current Takeovers and Delisting - December 2025</a>
            </li>
            <li>
              <a href="">Latest Intraday Leverages - MIS & CO</a>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}

export default Hero;
