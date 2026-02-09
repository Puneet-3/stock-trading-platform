import React from "react";

function RightSection({
  imageURL,
  productName,
  productDescription,
  learnMore,
}) {
  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col-6 p-5">
          <h2>{productName}</h2>
          <p>{productDescription}</p>
          <div>
            {" "}
            <a href={learnMore} style={{ textDecoration: "none" }}>
              Learn More{" "}
              <i class="fa fa-long-arrow-right" aria-hidden="true"></i>
            </a>
          </div>
        </div>
        <div className="col-6 ">
          <img src={imageURL} />
        </div>
      </div>
    </div>
  );
}

export default RightSection;
