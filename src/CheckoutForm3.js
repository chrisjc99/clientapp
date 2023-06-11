import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutForm3 = ({ email, id }) => {
  const stripe = useStripe();
  const elements = useElements();

  // The priceId of the subscription
  const priceId = 'price_1NHu4ZBMrRg8GXeNfsHwS00V';

  const handleSubmit = async (event) => {
    event.preventDefault();

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
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Submit Payment
      </button>
    </form>
  );
};

export default CheckoutForm3;
