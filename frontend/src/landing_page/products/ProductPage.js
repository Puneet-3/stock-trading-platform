import React from "react";
import Hero from "./Hero";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import Universe from "./Universe";

function ProductPage() {
  return (
    <>
      <Hero />,
      <LeftSection
        imageURL="media/kite.png"
        productName="Kite"
        productDescription="Kite is a powerful trading platform designed for traders and investors. It offers advanced charting tools, real-time market data, and seamless order execution to help you make informed trading decisions."
        tryDemo=""
        learnMore=""
        googlePlay=""
        appStore=""
      />
      ,
      <RightSection
        imageURL="media/console.png"
        productName="Console"
        productDescription="The central dashboard for your Zerodha account. Gain insights into your trades and investments with in-depth reports and visualisations."
        learnMore=""
      />,
      <LeftSection
        imageURL="media/coin.png"
        productName="Coin"
        productDescription="Buy direct mutual funds online, commission-free, delivered directly to your Demat account. Enjoy the investment experience on your Android and iOS devices."
        tryDemo=""
        learnMore=""
        googlePlay=""
        appStore=""
      />
      <RightSection
        imageURL="media/kiteconnect.png"
        productName="Kite Connect API"
        productDescription="Build powerful trading platforms and experiences with our super simple HTTP/JSON APIs. If you are a startup, build your investment app and showcase it to our clientbase."
        learnMore=""
      />,
      <LeftSection
        imageURL="media/varsity.png"
        productName="Varsity mobile
"
        productDescription="An easy to grasp, collection of stock market lessons with in-depth coverage and illustrations. Content is broken down into bite-size cards to help you learn on the go."
        tryDemo=""
        learnMore=""
        googlePlay=""
        appStore=""
      />,
      <Universe />
    </>
  );
}

export default ProductPage;
