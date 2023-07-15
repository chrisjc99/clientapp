import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
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
        color: "#727274"
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

const CheckoutForm3 = ({ paymentText, email, id, fetchInfo }) => {

  const calculateNextMonthDate = () => {
    let date = new Date(); // get current date
    date.setMonth(date.getMonth() + 1); // add one month to it
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`; // format it as mm/dd/yyyy
};

  const [isButtonPressed, setButtonPressed] = useState(false);

  const buttonStyle = {
    position: 'relative',
    boxShadow: isButtonPressed ? 'none' : '5px 5px 0px rgba(0, 0, 0, 0.2)',
    transform: isButtonPressed ? 'translate(5px, 5px)' : 'none',
    transition: 'all 0.03s ease-in-out',
  };

  const stripe = useStripe();
  const elements = useElements();

  // Adding state for error and processing status
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  // The priceId of the subscription
  const priceId = 'price_1NLujVBMrRg8GXeNlolUyHx4';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      console.error(error);
      setError('Payment failed. Please try again.');
      setProcessing(false);
      return;
    } else {
      // Prepare the data for your Lambda function
      const lambdaData = {
        priceId,
        paymentMethodId: paymentMethod.id,
        dynamoItemId: id,
        userEmail: email,
      };

      // Pass lambdaData to your Lambda function
      invokeLambdaFunction(lambdaData);
    }
  };

  // Function to invoke the Lambda function
  const invokeLambdaFunction = async (data) => {
    console.log(data);
    const response = await fetch("https://ulox9olcc8.execute-api.us-east-2.amazonaws.com/prod/subscription", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    // Logging the response to the console
    const responseBody = await response.json();
    console.log(responseBody);
    
    // Check if subscription was created successfully and refresh the item's info
    if (response.status === 200) {
      fetchInfo();
    } else {
      console.error(responseBody.error);
      setError('Payment failed. Please try again.');
    }
    setProcessing(false);
  }

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
          <div className="circle small-circle">
            <div className="circle-inner"></div>
          </div>
        </div>
        <div className="subtitle">DEVELOPING YOUR SITE</div>
      </div>
      <div className="status-item">
        <div className="circle-container">
          <div className="circle large-circle">
            <div className="circle-inner"></div>
          </div>
        </div>
        <div className="subtitle">PUBLISHING SITE</div>
      </div>
    </div>
</div>

<hr />
    <form id='payment-form' onSubmit={handleSubmit}>
         <div className="instructions">To publish your site, pay the remaining balance and agree to monthly payments.</div>
      <div className='inputs'>
         <input type="text" id="name" placeholder="Full Name" required />
         <div className='cardContainer'>
         <CardElement id='card-element' options={CARD_ELEMENT_OPTIONS}/>
         </div>
      </div>

      <div className='priceTag'>
    <div className='pmtInfo'>
    <div className='recurring'>
      <div >Starting {calculateNextMonthDate()}</div>
      <div >$100.00/mo</div>
    </div>

    <div className='oneTimePmt'>
    <div >Due Today</div>
      <div > $50.00</div>
    </div>
    </div>
    <button id='submit' type="submit" disabled={!stripe || processing}
    
    style={buttonStyle}
            onMouseDown={() => setButtonPressed(true)}
            onMouseUp={() => setButtonPressed(false)}
            onMouseLeave={() => setButtonPressed(false)}
    
    >
        {processing ? "Processing..." : "Submit Payment"}
      </button>
      </div>
      <p className='errorDiv' >{paymentText}</p> 

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

export default CheckoutForm3;
