import React from 'react';
function Awards() {
    return ( 
        <div className='container mt-5'>
            <div className='row'>
               
                <div className='col-6 p-5 mt-3'>
                    <img src='media\largestBroker.svg' alt='largestBroker' />
                </div>

                 <div className='col-6 p-5' >
                    <h1>
                        Largest Broker in the Indian Stock Market
                    </h1>
                    <p className='mb-5'>
                        We are proud to be recognized as the largest broker in the Indian stock market, serving millions of satisfied customers with our reliable and efficient trading services.
                    </p>
                    <div className='row'>
                        <div className='col-6'>
                        <ul>
                            <li>
                                Future and Options
                            </li>
                            <li>
                                Commodity derivatives
                            </li>
                            <li>
                                Currency derivatives
                            </li>
                        </ul>
                    </div>
                    <div className='col-6'>
                        <ul>
                            <li>
                                Stock & IPOs
                            </li>
                            <li>
                                Direct Mutual Funds
                            </li>
                            <li>
                                Bonds and Government Securities
                            </li>
                        </ul>
                    </div>
                    <img src='media\pressLogos.png' style={{width:"90%"}} alt='awardBadges' />
                    </div>
                    
                </div>
            </div>

        </div>
     );
}

export default Awards;