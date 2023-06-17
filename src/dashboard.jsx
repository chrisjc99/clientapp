//dashboard.jsx

import React from 'react';
import './App.css';
import { Amplify, API, Auth, graphqlOperation } from 'aws-amplify';
import awsconfig from './aws-exports';
import { withAuthenticator } from '@aws-amplify/ui-react';
import Paper from '@mui/material/Paper';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm1 from './CheckoutForm1';  
import Status2 from './Status2'; 
import CheckoutForm3 from './CheckoutForm3'; 
import CheckoutForm3_5 from './CheckoutForm3_5'; 
import Status4 from './Status4'; 

Amplify.configure(awsconfig);

const stripePromise = loadStripe("pk_test_51NFblWBMrRg8GXeN5TaOms7M74UM1OqAnM2szl85ryjx6sCuqjtFc9MgqlJd5b7BTrrgWLyi6UXYZe45F482cCeV00C1Okgroj");

function Dashboard({ info, fetchInfo }) {


  return (
    <div className="Dashboard">
      <header className="Dashboard-header">

        <div className="infoList"> 
        {info.map(infoItem => {
          return(
            <div>
              <Paper variant ="outlined" elevation ={2}>
                <div className="infoCard"></div>
                <div>
                  <div className="infotitleUrl">{infoItem.titleUrl}</div>
                  <div className="infoBusiness">{infoItem.business}</div>
                  <div className="infoThumbnail">{infoItem.email}</div>
                </div>
              </Paper>
              <h2>Status</h2>
              <Elements stripe={stripePromise}>
                {infoItem.status === '1' && <CheckoutForm1 paymentText="Pay $50 down payment" id={infoItem.id} fetchInfo={fetchInfo} />}
                {infoItem.status === '1e' && <CheckoutForm1 paymentText={<><p>Payment Error. Please try again.</p><p>Pay $50 down payment</p></>} id={infoItem.id} fetchInfo={fetchInfo} />}
                {infoItem.status === '2' && <Status2/>}
                {infoItem.status === '3' && <CheckoutForm3 paymentText="Pay $50 balance and $100 a month starting next month" email={infoItem.email} id={infoItem.id} fetchInfo={fetchInfo} />}
                {infoItem.status === '3e' && <CheckoutForm3 paymentText={<><p>Payment Error. Please try again.</p><p>Pay $50 balance and $100 a month starting next month</p></>} email={infoItem.email} id={infoItem.id} fetchInfo={fetchInfo} />}
                {infoItem.status === '3.5' && <CheckoutForm3_5 paymentText="Pay $950 balance and $100 a year next year" email={infoItem.email} id={infoItem.id} fetchInfo={fetchInfo} />}
                {infoItem.status === '3.5e' && <CheckoutForm3_5 paymentText={<><p>Payment Error. Please try again.</p><p>Pay $950 balance and $100 a year starting next year</p></>} email={infoItem.email} id={infoItem.id} fetchInfo={fetchInfo} />}
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
