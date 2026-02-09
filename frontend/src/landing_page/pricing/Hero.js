import React from 'react';

function Hero() {
    return ( 
        <div className='container'>
            <div className='row p-5 mt-5 border-bottom  text-center mb-5' >
                <h1> Pricing</h1>
                <h3 className='text-muted mt-3 fs-5 borderBottom mb-5'> Simple and transparent pricing. No hidden fees or surprises. </h3>
            </div>
            <div className='row text-muted mt-5 text-center' >
                <div className='col-4 p-4'>
                    <img src="media/pricingEquity.svg" alt="price-1" className='mb-3'/>
                    <h1 className='fs-2'>Free equity delivery</h1>
                    <p>All equity delivery investments (NSE, BSE), <br/>
                        are absolutely free — ₹ 0 brokerage.</p>
                </div>
                <div className='col-4 p-4'>
                    <img src="media/intradayTrades.svg" alt="price-1" className='mb-3'/>
                    <h1 className='fs-2'>Intraday and F&O trades</h1>
                    <p>Flat ₹ 20 or 0.03% (whichever is lower) <br/> per executed order on intraday trades <br/>across equity, currency, and commodity <br/>trades.</p>
                </div>
                <div className='col-4 p-4'>
                    <img src="media/pricingMF.svg" alt="price-1" className='mb-3'/>
                    <h1 className='fs-2'>Free direct MF</h1>
                    <p>All direct mutual fund investments are <br/>absolutely free — ₹ 0 commissions & DP  <br/> charges.</p>
                </div>
                
            
            </div>
        </div>
     );
}

export default Hero;