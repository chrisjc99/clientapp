import React from 'react';

const Status4 = ({ customerId }) => {

  const handleManageSubscription = async () => {
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
};

    return (
        <div className="status-message">
            <p>Active. Your Next Payment will be charged on DATE.</p>
            <button onClick={handleManageSubscription}>Manage Subscription</button>
        </div>
    );
};

export default Status4;
