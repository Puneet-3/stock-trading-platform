import React from "react";

function Team() {
  return (
    <div >
      <h1 className="text-center  mb-5 pb-5 ">People</h1>
      <div className="row">
        <div className="col-6 p-5 text-muted text-center">
            <img src="media/nithinKamath.jpg" style={{borderRadius:"100%" , width:"40%"}} ></img>
           
            <h4 className="mt-5">Nithin Kamath</h4>
            <h6>Founder & CEO</h6>
        </div>
        <div className="col-6 fs-5 ">
          <p>
            Nithin bootstrapped and founded Zerodha in 2010 to overcome the <br/>
            hurdles he faced during his decade long stint as a trader. Today,  <br/>
            Zerodha has changed the landscape of the Indian broking industry.
          </p>
          <p>
            He is a member of the SEBI Secondary Market Advisory Committee <br/> (SMAC) and the Market Data Advisory Committee (MDAC). 
          </p>

          <p>
            Playing basketball is his zen. 
          </p>
          <p>  
            Connect on <a  style={{textDecoration:"none"}} href="#">Homepage</a> / <a style={{textDecoration:"none"}} href="#">TradingQnA</a> / <a style={{textDecoration:"none"}} href="#">Twitter</a>
          </p>

          
        </div>
      </div>
    </div>
  );
}

export default Team;
