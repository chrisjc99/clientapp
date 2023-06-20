import React from 'react';
import "./CheckoutForm.css";


const Status2 = () => {
    return (
    <div>
            <div>
    <div className="status-indicator">
      <div className="status-item">
        <div className="circle-container">
          <div className="circle small-circle">
            <div className="circle-inner"></div>
          </div>
        </div>
        <div className="subtitle">AWAITING DOWN PAYMENT</div>
      </div>
      <div className="status-item">
        <div className="circle-container">
          <div className="circle large-circle">
            <div className="circle-inner"></div>
          </div>
        </div>
        <div className="subtitle">DEVELOPING YOUR SITE</div>
      </div>
      <div className="status-item">
        <div className="circle-container">
          <div className="circle small-circle">
            <div className="circle-inner"></div>
          </div>
        </div>
        <div className="subtitle">PUBLISHING SITE</div>
      </div>
    </div>
</div>

<hr />
            <div className='instructions'>Thanks for your payment. Your website is currently under development.</div>
        </div>
    );
};

export default Status2;
