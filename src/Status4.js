import React, { useState, useEffect } from 'react';
import "./CheckoutForm.css";
import { BeatLoader } from "react-spinners";

const Status4 = ({ customerId, subscriptionId }) => {
    const [loading, setLoading] = useState(false);
    const [isButtonPressed, setButtonPressed] = useState(false);
    const [nextPaymentTimestamp, setNextPaymentTimestamp] = useState(null);

    const buttonStyle = {
        position: 'relative',
        boxShadow: isButtonPressed ? 'none' : '5px 5px 0px rgba(0, 0, 0, 0.2)',
        transform: isButtonPressed ? 'translate(5px, 5px)' : 'none',
        transition: 'all 0.03s ease-in-out',
    };

    useEffect(() => {
        fetchNextPaymentDate();
    }, []);

    const fetchNextPaymentDate = async () => {
        console.log(subscriptionId);
        try {
            const response = await fetch(`https://gzheesuk8l.execute-api.us-east-2.amazonaws.com/prod/getduedate?subscriptionId=${subscriptionId}`);
            console.log('Response:', response);
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log('Data:', data);
            console.log('nextPaymentDate:', data.nextPaymentDate);
            setNextPaymentTimestamp(data.nextPaymentDate);
            
        } catch (error) {
            console.error("Failed to fetch next payment date", error);
        }
    };

    const handleManageSubscription = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://dg7urk7lve.execute-api.us-east-2.amazonaws.com/prod/updatecancel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ customerId }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            const data = JSON.parse(responseData.body);  // Parse the body again

            console.log('Parsed body from server:', data);  // Log the parsed body
            window.location.href = data.url;
        } catch (error) {
            console.error("Failed to open customer portal", error);
        }
        setLoading(false);
    };

    let nextPaymentDate = null;
    if (nextPaymentTimestamp) {
        nextPaymentDate = new Date(nextPaymentTimestamp * 1000).toLocaleDateString();
    }

    return (
        <div className="status-message2">
            <div className='active'>ACTIVE</div>
            <div className='nextPayment'>Your next payment will be charged on {nextPaymentDate}.</div>
            <button className='button' onClick={handleManageSubscription}

                style={buttonStyle}
                onMouseDown={() => setButtonPressed(true)}
                onMouseUp={() => setButtonPressed(false)}
                onMouseLeave={() => setButtonPressed(false)}

            >Manage Subscription</button>
            {loading && <BeatLoader size={15} color="black" />}
        </div>
    );
};

export default Status4;
