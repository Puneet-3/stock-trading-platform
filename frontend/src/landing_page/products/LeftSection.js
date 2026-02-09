import React from 'react';

function LeftSection({imageURL, productName, productDescription, tryDemo, learnMore, googlePlay, appStore}) {
    return <div className='container'>
        <div className='row mt-5'>
            <div className='col-6 '>
                <img src={imageURL} />
            </div>
            <div className='col-6 p-5'>
                <h2>{productName}</h2>
                <p>{productDescription}</p>
                <div >
                    <a href={tryDemo} style={{textDecoration: 'none'}}>Try Demo <i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>

                    <a href={learnMore} style={{ marginLeft: '50px', textDecoration: 'none' }}>Learn More <i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>
                </div>
                <div className='mt-3'>
                    
                <a href={googlePlay}><img src='media/googlePlayBadge.svg'/></a>
                <a href={appStore} style={{ marginLeft: '50px' }}><img src='media/appStoreBadge.svg'/></a>

                </div>
                
            </div>
        </div>    
    </div>;
}

export default LeftSection;