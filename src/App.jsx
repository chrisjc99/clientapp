import React, { useState, useEffect } from 'react';  // Added useState and useEffect
import './App.css';
import { Amplify, API, Auth, graphqlOperation } from 'aws-amplify';
import awsconfig from './aws-exports';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { listInfos } from './graphql/queries';
import Paper from '@mui/material/Paper';
import { IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

Amplify.configure(awsconfig);

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
        {info.map(info => {
          return(
            <Paper variant ="outlined" elevation ={2}>
              <div className="infoCard"></div>
              <IconButton aria-label='play'>
                <PlayArrowIcon />
              </IconButton>
              <div>
                <div className="infoBusiness">{info.business}</div>
                <div className="infoStatus">{info.status}</div>
                <div className="infoUrl">{info.url}</div>
                <div className="infoThumbnail">{info.thumbnail}</div>
              </div>
            </Paper>
          )
        })}
        </div>
      </header>
    </div>
  );
} 

export default withAuthenticator(App);