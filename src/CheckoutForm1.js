import React, { useState } from "react";
import axios from "axios";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { BeatLoader } from "react-spinners";
import "./CheckoutForm.css";


const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#42382e",
      fontFamily: 'Montserrat, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      backgroundColor: "#ffffff",
      "::placeholder": {
        color: "#757579"
      },
      "::selection": {
        backgroundColor: "#ffffff"
      }
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a"
    }
  }
};

const CheckoutForm1 = ({ paymentText, id: dynamoItemId, fetchInfo }) => {
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const [isButtonPressed, setButtonPressed] = useState(false);

  const buttonStyle = {
    position: 'relative',
    boxShadow: isButtonPressed ? 'none' : '5px 5px 0px rgba(0, 0, 0, 0.2)',
    transform: isButtonPressed ? 'translate(5px, 5px)' : 'none',
    transition: 'all 0.03s ease-in-out',
  };


  const handleChange = async (event) => {
    setError(event.error ? event.error.message : "");
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setProcessing(true);
    setError(null);
    const card = elements.getElement(CardElement);
  
    try {
      const result = await stripe.createPaymentMethod({
        type: "card",
        card: card,
      });
    
      if (error) {
        throw new Error(`Payment failed: ${error.message}`);
      }
    
      const paymentMethodId = result.paymentMethod.id;
    
      const response = await axios.post(
        'https://10u8urrpc0.execute-api.us-east-2.amazonaws.com/prod/charge',
        { id: paymentMethodId, amount: 5000, dynamoItemId }
      );
  
      if (response && Math.floor(response.status / 100) !== 2) {
        throw new Error('Payment failed on the server. Please try again.');
      }
  
      const cardElement = elements.getElement(CardElement);
      cardElement.clear();
      setError(null);
      setProcessing(false);
      await fetchInfo();
    } catch (error) {
      setError('Card error, try again.');
      setProcessing(false);
      console.log('Error set:', error); // For debugging
    }
  };
  return (
    <div>
      <div>
        <div className="status-indicator">
          <div className="status-item">
            <div className="circle-container">
              <div className="circle large-circle">
                <div className="circle-inner"></div>
              </div>
            </div>
            <div className="subtitle">AWAITING DOWN PAYMENT</div>
          </div>
          <div className="status-item">
            <div className="circle-container">
              <div className="circle small-circle">
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

      <form id="payment-form" onSubmit={handleSubmit}>
      
      <div className="instructions">Please complete the down payment</div>

      <div className="inputs">
        <input type="text" id="name" placeholder="Full Name" required />

        <div className="cardContainer">
          <CardElement id="card-element" options={CARD_ELEMENT_OPTIONS} onChange={handleChange} />
        </div>
      </div>
      
      <div className="priceTag">
        <div className="price">Total: $50.00</div>
       
        <button disabled={processing} id="submit"
          style={buttonStyle}
          onMouseDown={() => setButtonPressed(true)}
          onMouseUp={() => setButtonPressed(false)}
          onMouseLeave={() => setButtonPressed(false)}
        >
          <span id="button-text">{processing ? "Processing..." : "Pay"}</span>
        </button>
      

      </div>
      <p className="errorDiv">{paymentText}</p> 
      {processing && (
        <div className="loading">
          <BeatLoader size={15} color="black" />
        </div>
      )}
      {error && <div className="error-message">{error}</div>}
    </form>
    </div>
  );
};

export default CheckoutForm1;
