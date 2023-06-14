import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { BeatLoader } from "react-spinners";
import "./CheckoutForm.css";

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
    const response = await fetch("https://ckn8566hw6.execute-api.us-east-2.amazonaws.com/prod/yearsubscription", {
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
    <form onSubmit={handleSubmit}>
        <p>{paymentText}</p>
      <CardElement />
      <button type="submit" disabled={!stripe || processing}>
        {processing ? "Processing..." : "Submit Payment"}
      </button>
      {processing && (
        <div className="loading">
          <BeatLoader size={15} color="black" />
        </div>
      )}
      {error && <div className="error-message">{error}</div>}
    </form>
  );
};

export default CheckoutForm35;
