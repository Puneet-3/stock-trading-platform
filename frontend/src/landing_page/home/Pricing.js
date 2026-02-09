import React from 'react';

function Pricing() {
    return ( 
        <div className='container mt-5'>
            <div className='row'>
                <div className='col-4 p-5'>
                    <h1 className='fs-2'>Unbeatable pricing</h1> 
                    <p className='text-muted'>We pioneered the concept of discount broking and price transparency in India. Flat fees and no hidden charges.</p>
                    <a href='' style={{textDecoration: "none"}} >See Pricing <i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>
                </div>
                <div className='col-2'>
                </div>
                <div className='col-6 p-5' >
                    <div className='row text-center'>
                        <div className='col-6 border p-4'>
                            <h1 > ₹0</h1>
                            <p className='text-muted'> Free equity delivery and <br/>direct mutual funds</p>
                        </div>
                        <div className='col-6 border p-4'>
                            <h1 > ₹20</h1>
                            <p className='text-muted'>  Intraday and F&O</p>
                        </div>    
                    </div>
                </div>
            </div>    
        </div>
     );
}

export default Pricing;