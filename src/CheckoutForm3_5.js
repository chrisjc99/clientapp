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
      backgroundColor: "#f2eee9",
      "::placeholder": {
        color: "#42382e"
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

const CheckoutForm35 = ({ paymentText, email, id, fetchInfo }) => {
  const stripe = useStripe();
  const elements = useElements();

  // Adding state for error and processing status
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  // The priceId of the subscription
  const priceId = 'price_1NI0ZKBMrRg8GXeN2gT0MrpZ';

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
         <div className="instructions">To publish your site, pay the remaining balance and agree to yearly payments.</div>
      <div className='inputs'>
         <input type="text" id="name" placeholder="Full Name" required />
         <div className='cardContainer'>
         <CardElement id='card-element' options={CARD_ELEMENT_OPTIONS}/>
         </div>
      </div>

      <div className='priceTag'>
    <div className='pmtInfo'>
    <div className='recurring'>
      <div c>Starting xx/xx/xx</div>
      <div >$100.00/yr</div>
    </div>

    <div className='oneTimePmt'>
    <div >Due Today</div>
      <div > $950.00</div>
    </div>
    </div>
    <button id='submit' type="submit" disabled={!stripe || processing}>
        {processing ? "Processing..." : "Submit Payment"}
      </button>
      </div>


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

export default CheckoutForm35;
