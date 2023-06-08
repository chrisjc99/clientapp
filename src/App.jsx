import React, { useState, useEffect } from 'react';
import './App.css';
import { Amplify, API, Auth, graphqlOperation } from 'aws-amplify';
import awsconfig from './aws-exports';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { listInfos } from './graphql/queries';
import Paper from '@mui/material/Paper';
import { IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm1 from './CheckoutForm1'; 
import CheckoutForm3 from './CheckoutForm3'; 
import CheckoutForm3_5 from './CheckoutForm3_5'; 

Amplify.configure(awsconfig);

const stripePromise = loadStripe("pk_live_51NFblWBMrRg8GXeN85YnF7cLwWyMJuVTLO5IO8jb781rsZDPR1AtY5lIU5lz9Xk6fT323v8zvlvNwIQ1APJOo9SO00a1zXOwk8");

function App() {
  const [info, setInfos] = useState([]);

  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const infoData = await API.graphql(graphqlOperation(listInfos, { filter: { email: { eq: user.attributes.email }}}));
      const infoList = infoData.data.listInfos.items;
      console.log('info list', infoList);
      setInfos(infoList);
    } catch (error) {
      console.log('error on fetching info', error);
    }
  }

  const signOut = async () => {
    try {
      await Auth.signOut();
    } catch (error) {
      console.log('Error signing out: ', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={signOut}>Sign Out</button>
        <h2>My App Content</h2>
        <div className="infoList"> 
        {info.map(infoItem => {
          return(
            <div>
              <Paper variant ="outlined" elevation ={2}>
                <div className="infoCard"></div>
                <IconButton aria-label='play'>
                  <PlayArrowIcon />
                </IconButton>
                <div>
                  <div className="infoBusiness">{infoItem.business}</div>
                  <div className="infoStatus">{infoItem.status}</div>
                  <div className="infoUrl">{infoItem.url}</div>
                  <div className="infoThumbnail">{infoItem.thumbnail}</div>
                </div>
              </Paper>
              <h2>Payment Section</h2>  {/* This is your payment section */}
              <Elements stripe={stripePromise}>
  {infoItem.status === '1' && <CheckoutForm1 paymentText="Pay $50 down payment" />}
  {infoItem.status === '3' && <CheckoutForm3 paymentText="Pay $50 balance and $100 a month starting next month" />}
  {infoItem.status === '3.5' && <CheckoutForm3_5 paymentText="Pay $950 balance and $100 a year next year" />}
</Elements>

            </div>
          )
        })}
        </div>
      </header>
    </div>
  );
} 

export default withAuthenticator(App);
