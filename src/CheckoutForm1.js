import React, { useState } from "react";
import axios from "axios";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { BeatLoader } from "react-spinners";
import "./CheckoutForm.css";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: 'Arial, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#32325d"
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

  const handleChange = async (event) => {
    setError(event.error ? event.error.message : "");
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setProcessing(true);
    setError(null);
    const card = elements.getElement(CardElement);
    const result = await stripe.createPaymentMethod({
      type: "card",
      card: card,
    });

    if (result.error) {
      setError(`Payment failed: ${result.error.message}`);
      setProcessing(false);
      return;
    }

    const paymentMethodId = result.paymentMethod.id;
    const response = await axios.post(
      'https://10u8urrpc0.execute-api.us-east-2.amazonaws.com/prod/charge', 
      { id: paymentMethodId, amount: 5000, dynamoItemId }
    )

    if (Math.floor(response.status / 100) !== 2) {
      setError('Payment failed on the server. Please try again.');
      setProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    cardElement.clear();
    setError(null);
    setProcessing(false);
    await fetchInfo();
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <p>{paymentText}</p>
      <CardElement id="card-element" options={CARD_ELEMENT_OPTIONS} onChange={handleChange} />
      <button disabled={processing} id="submit">
        <span id="button-text">{processing ? "Processing..." : "Pay"}</span>
      </button>
      {processing && (
        <div className="loading">
          <BeatLoader size={15} color="black" />
        </div>
      )}
      {error && <div className="error-message">Payment failed. Please try again.</div>}
    </form>
  );
};

export default CheckoutForm1;
