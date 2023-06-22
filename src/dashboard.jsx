//dashboard.jsx

import React from 'react';
import './App.css';
import { Amplify, API, Auth, graphqlOperation } from 'aws-amplify';
import awsconfig from './aws-exports';
import { withAuthenticator } from '@aws-amplify/ui-react';
import Paper from '@mui/material/Paper';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import status0 from './Status0'; 
import CheckoutForm1 from './CheckoutForm1';  
import Status2 from './Status2'; 
import CheckoutFormC from './CheckoutFormC';
import CheckoutForm3 from './CheckoutForm3'; 
import CheckoutForm3_5 from './CheckoutForm3_5'; 
import Status4 from './Status4'; 

Amplify.configure(awsconfig);

const stripePromise = loadStripe("pk_live_51NFblWBMrRg8GXeN85YnF7cLwWyMJuVTLO5IO8jb781rsZDPR1AtY5lIU5lz9Xk6fT323v8zvlvNwIQ1APJOo9SO00a1zXOwk8");

function Dashboard({ info, fetchInfo }) {


  return (
    <div className="Dashboard">
      <header className="Dashboard-header">

        <div className="infoList"> 
        {info.map(infoItem => {
          return(
            <div>
              <div className='status'>Status</div>
              
              <Elements stripe={stripePromise}>
                {infoItem.status === '1' && <CheckoutForm1  id={infoItem.id} fetchInfo={fetchInfo} />}
                {infoItem.status === '1e' && <CheckoutForm1 paymentText={<><p>Payment Error. Please try again.</p></>} id={infoItem.id} fetchInfo={fetchInfo} />}
                {infoItem.status === '2' && <Status2/>}
                {infoItem.status === 'c' && <CheckoutFormC email={infoItem.email} id={infoItem.id} fetchInfo={fetchInfo} />}
                {infoItem.status === 'ce' && <CheckoutFormC paymentText={<><p>Payment Error. Please try again.</p></>} email={infoItem.email} id={infoItem.id} fetchInfo={fetchInfo} />}
                {infoItem.status === '3' && <CheckoutForm3 email={infoItem.email} id={infoItem.id} fetchInfo={fetchInfo} />}
                {infoItem.status === '3e' && <CheckoutForm3 paymentText={<><p>Payment Error. Please try again.</p></>} email={infoItem.email} id={infoItem.id} fetchInfo={fetchInfo} />}
                {infoItem.status === '3.5' && <CheckoutForm3_5  email={infoItem.email} id={infoItem.id} fetchInfo={fetchInfo} />}
                {infoItem.status === '3.5e' && <CheckoutForm3_5 paymentText={<><p>Payment Error. Please try again.</p></>} email={infoItem.email} id={infoItem.id} fetchInfo={fetchInfo} />}
                {infoItem.status === '4' && <Status4 customerId = {infoItem.stripeCustomerId} subscriptionId = {infoItem.subscription}/>}
              </Elements>
            </div>
          )
        })}
        </div>
      </header>
    </div>
  );
} 

export default withAuthenticator(Dashboard);
