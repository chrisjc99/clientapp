// App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';
import { Auth, Hub, API, graphqlOperation } from 'aws-amplify';
import Dashboard from './dashboard';
import Welcome from './welcome';
import Message from './message';
import { listInfos } from './graphql/queries';

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [info, setInfos] = useState([]);  // New state for info data

  useEffect(() => {
    checkUser();
    fetchInfo(); // Fetch the data when the component mounts

    const listener = (data) => {
      switch (data.payload.event) {
        case 'signIn':
          setIsSignedIn(true);
          break;
        case 'signOut':
          setIsSignedIn(false);
          break;
        default:
          break;
      }
    };

    Hub.listen('auth', listener);

    return () => Hub.remove('auth', listener);
  }, []);

  const checkUser = async () => {
    try {
      await Auth.currentAuthenticatedUser();
      setIsSignedIn(true);
    } catch (error) {
      setIsSignedIn(false);
    }
  };

  const fetchInfo = async () => { // Moved the fetchInfo function to App component
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

  return (
      <div className="app">

        <div className='content'>
        <div className='column-one'>
            {!isSignedIn && <Welcome />}
            {isSignedIn && <Message info={info} />}
          </div>
          <div className='column-two'>
            <Dashboard isSignedIn={isSignedIn} info={info} fetchInfo={fetchInfo} />
            </div>  
        </div>
      </div>
  );
}

export default App;



