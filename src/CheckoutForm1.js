import React, { useState } from "react";
import axios from "axios";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
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

const CheckoutForm1 = ({ paymentText }) => {
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const stripe = useStripe();
  const elements = useElements();

  const handleChange = async (event) => {
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setProcessing(true);

    const card = elements.getElement(CardElement);
    const result = await stripe.createPaymentMethod({
      type: "card",
      card: card,
    });

    if (result.error) {
      setError(`Payment failed ${result.error.message}`);
      setProcessing(false);
    } else {
      setError(null);
      setProcessing(false);
      setSucceeded(true);

      // Now we would send the payment method ID to our backend:
      const id = result.paymentMethod.id;
      const { data } = await axios.post('your_api_gateway_url', { id, amount: 5000 }) // $50.00, in cents
      console.log(data);
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <p>{paymentText}</p>  {/* Display the payment text here */}
      <CardElement id="card-element" options={CARD_ELEMENT_OPTIONS} onChange={handleChange} />
      <button disabled={processing || disabled || succeeded} id="submit">
        <span id="button-text">{processing ? "Processing..." : "Pay"}</span>
      </button>
      {error && (
        <div className="card-error" role="alert">
          {error}
        </div>
      )}
    </form>
  );
};

export default CheckoutForm1;
