import React from "react";

function Universe() {
  return (
    <div className="container text-center">
      <p className="mt-5 mb-5">
        Want to know more about our technology stack? Check out the{" "}
        <a href="" style={{textDecoration:"none"}}>Zerodha.tech</a> blog.{" "}
      </p>
      <h1 className="mt-5">The Zerodha Universe</h1>
      <p className="fs-4">Extend your trading and investment experience even further with our partner platforms</p>
      <div className="row">
        <div className="col-4 text-small text-muted p-3  mt-5">
          <img src="media/zerodhaFundhouse.png" style={{ width: "50%",  marginBottom: "20px" }}></img>
          <p>
            Our asset management venture that is creating simple and transparent
            index funds to help you save for your goals.
          </p>
        </div>
        <div className="col-4 text-small text-muted p-3  mt-5">
          <img src="media/sensibullLogo.svg" style={{ width: "50%",  marginBottom: "20px", marginTop: "10px" }}></img>
          <p>
            Options trading platform that lets you create strategies, analyze
            positions, and examine data points like open interest, FII/DII, and
            more.
          </p>
        </div>
        <div className="col-4 text-small text-muted p-3  mt-5">
          <img src="media/tijori.svg" style={{ width: "50%",  marginBottom: "0px" }}></img>
          <p>
            Investment research platform that offers detailed insights on
            stocks, sectors, supply chains, and more.
          </p>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-4 text-small text-muted p-3  mt-5">
          <img src="media/streakLogo.png" style={{ width: "50%", marginBottom: "10px" }}></img>
          <p>
            Systematic trading platform that allows you to create and backtest
            strategies without coding.
          </p>
        </div>
        <div className="col-4 text-small  text-muted p-3  mt-5 ">
          <img src="media/smallcaseLogo.png" style={{ width: "50%" }}></img>
          <p>
            Thematic investing platform that helps you invest in diversified
            baskets of stocks on ETFs.
          </p>
        </div>
        <div className="col-4 text-small text-muted p-3 mt-5">
          <img src="media/dittoLogo.png" style={{ width: "50%" }}></img>
          <p>
            Personalized advice on life and health insurance. No spam and no
            mis-selling.
          </p>
        </div>
      </div>
      <button
        className="p-3 btn btn-primary fs-5"
        style={{ width: "20%", margin: "0 auto"}}
      >
        {" "}
        Sign Up for Free{" "}
      </button>
    </div>
  );
}

export default Universe;
