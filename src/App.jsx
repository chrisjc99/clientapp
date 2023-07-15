//app.jsx

import React, { useState, useEffect } from 'react';
import { Auth, Hub, API, graphqlOperation } from 'aws-amplify';
import { listInfos } from './graphql/queries';
import Dashboard from './dashboard';
import Welcome from './welcome';
import Message from './message';
import Navbar from './navbar';

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [info, setInfos] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isBackButtonPressed, setIsBackButtonPressed] = useState(false);
  const [isConfirmButtonPressed, setIsConfirmButtonPressed] = useState(false);

  const backButtonStyle = {
    position: 'relative',
    transition: 'all 0.03s ease-in-out', // Reduced transition time to speed up animation
    boxShadow: isBackButtonPressed ? 'none' : '5px 5px 0px rgba(0, 0, 0, 0.2)',
    transform: isBackButtonPressed ? 'translate(5px, 5px)' : 'none',
  };

  const confirmButtonStyle = {
    position: 'relative',
    transition: 'all 0.03s ease-in-out', // Reduced transition time to speed up animation
    boxShadow: isConfirmButtonPressed ? 'none' : '5px 5px 0px rgba(0, 0, 0, 0.2)',
    transform: isConfirmButtonPressed ? 'translate(5px, 5px)' : 'none',
  };

  const clearFields = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setVerificationCode('');
    setErrorMessage('');
  };

  
  useEffect(() => {
    checkFormValidity();
  }, [email, password, confirmPassword, isCreatingAccount]);
  
  const checkFormValidity = () => {
    if (isCreatingAccount) {
      if (email.length > 0 && password.length > 0 && confirmPassword.length > 0) {
        setIsFormValid(true);
      } else {
        setIsFormValid(false);
      }
    } else {
      if (email.length > 0 && password.length > 0) {
        setIsFormValid(true);
      } else {
        setIsFormValid(false);
      }
    }
  };


  const goBack = () => {
    setIsCreatingAccount(false);
    setIsConfirming(false);
  };
  
  useEffect(() => {
    checkUser();
    fetchInfo();

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


  const [isButtonPressed, setIsButtonPressed] = useState(false);

  const buttonStyle = {
    position: 'relative',
    boxShadow: isFormValid ? (isButtonPressed ? 'none' : '5px 5px 0px rgba(0, 0, 0, 0.2)') : 'none',
    transform: isButtonPressed && isFormValid ? 'translate(5px, 5px)' : 'none',
    transition: 'all 0.03s ease-in-out', // Reduced transition time to speed up animation
  };

  const signIn = async () => {
    try {
      setIsButtonPressed(true);
      const user = await Auth.signIn(email, password);
      setIsSignedIn(true);
      clearFields();
      fetchInfo();  // Add this line
    } catch (error) {
      console.log('error signing in', error);
      setErrorMessage(error.message);
    } finally {
      setIsButtonPressed(false);
    }
  };

  const signOut = async () => {
    try {
      await Auth.signOut();
      setIsSignedIn(false);
    } catch (error) {
      console.log('error signing out', error);
    }
  };

  const signUp = async () => {
    try {
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }
  
      setIsButtonPressed(true);
      const { user } = await Auth.signUp({
        username: email,
        password,
        attributes: {
          email,
        },
      });
      console.log(user);
      setIsConfirming(true); // Switch to verification stage
  
  
      setVerificationCode(''); // Keep verification code field as it is
    } catch (error) {
      if (error.code === 'UsernameExistsException') {
        // An account with this email already exists but hasn't been confirmed yet.
        // Switch to verification stage to allow the user to confirm their account.
        setIsConfirming(true);
      } else if (error.code === 'InvalidParameterException') {
        // Password is too short
        setErrorMessage("Your password is too short."); // Display an error message
      } else {
        console.log('error signing up:', error);
        setErrorMessage(error.message);
      }
    } finally {
      setIsButtonPressed(false);
    }
  };
  
  const confirmSignUp = async () => {
    try {
      await Auth.confirmSignUp(email, verificationCode);
      signIn();  // automatically sign in after confirming sign up
    } catch (error) {
      console.log('error confirming sign up', error);
    }
  };

  return (
    <div className="app">
       <Navbar signOut={signOut} isSignedIn={isSignedIn}/>
      <div className='content'>
        <div className='column-one'>
          {!isSignedIn ? <Welcome /> : <Message info={info} />}
        </div>
        <div className='column-two'>
          {!isSignedIn ? (
            isCreatingAccount ? (
              isConfirming ? (
                <div className='form'>

                  <div className='loginHeader'>Enter the code sent to your email.</div>
                  <label>Verification Code</label>
                  <input
                    name="verificationCode"
                    placeholder="Enter Verification Code"
                    value={verificationCode} // Bind verificationCode state to the input value
                    onChange={e => setVerificationCode(e.target.value)}
                  />
                  <div className= 'confirmOrBack'>
                  <button 
                    className='backToLogin' 
                    onClick={goBack} 
                    style={backButtonStyle}
                    onMouseDown={() => setIsBackButtonPressed(true)}
                    onMouseUp={() => setIsBackButtonPressed(false)}
                    onMouseLeave={() => setIsBackButtonPressed(false)}
                  >
                    Back to Login
                  </button>
                  <button 
                      className='button' 
                      onClick={confirmSignUp}
                      style={confirmButtonStyle}
                      onMouseDown={() => setIsConfirmButtonPressed(true)}
                      onMouseUp={() => setIsConfirmButtonPressed(false)}
                      onMouseLeave={() => setIsConfirmButtonPressed(false)}
                    >
                      Confirm Code
                    </button>
                  </div>
                </div>
              ) : (
                <div className='form'>
                  <div className='loginHeader'>Sign Up</div>
                  <label>Email</label>
                  <input
                    name="email"
                    placeholder="Enter your Email"
                    onChange={e => {
                      setEmail(e.target.value);
                      setErrorMessage(''); // clear error message
                    }}
                  />
                  <label>Password</label>
                  <input
                    name="password"
                    type="password"
                    placeholder="Enter your Password"
                    onChange={e => {
                      setPassword(e.target.value);
                      setErrorMessage(''); // clear error message
                    }}
                  />
                  <label>Confirm Password</label>
                  <input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your Password"
                    onChange={e => {
                      setConfirmPassword(e.target.value);
                      setErrorMessage(''); // clear error message
                    }}
                  />
                  <div className='loginActions'>
                  {errorMessage && <div className="error">{errorMessage}</div>}
                    <button 
                      className={`button ${!isFormValid ? 'disabled' : ''}`}  
                      onClick={() => {
                        setIsButtonPressed(true);  // Set isButtonPressed to true right when button is clicked
                        signUp();
                      }} 
                      style={buttonStyle}
                      onMouseDown={() => setIsButtonPressed(true)}
                      onMouseUp={() => setIsButtonPressed(false)}
                      onMouseLeave={() => setIsButtonPressed(false)}
                      disabled={!isFormValid}
                    >
                      Sign Up
                    </button>
                    <div className='loginOr'>
                  -OR-
                </div>
                    <div className='loginSwitch'>Already have an account? <a className='getStarted' onClick={() => {
              setIsCreatingAccount(false);
              clearFields();
            }}>Log In</a></div>
                    </div>
                </div>
              )
            ) : (
              <div className='form'>
                <div className='loginHeader'>Log In</div>
                <label>Email</label>
                <input
                  name="email"
                  placeholder="Enter your Email"
                  onChange={e => {
                    setEmail(e.target.value);
                    setErrorMessage(''); // clear error message
                  }}
                />
                <label>Password</label>
                <input
                name="password"
                type="password"
                placeholder="Enter your Password"
                onChange={e => {
                  setPassword(e.target.value);
                  setErrorMessage(''); // clear error message
                }}
              />
                
                <div className='loginActions'>
                {errorMessage && <div className="error">{errorMessage}</div>}
                <button 
                    className={`button ${isFormValid ? '' : 'disabled'}`} 
                    onClick={() => {
                      setIsButtonPressed(true);  // Set isButtonPressed to true right when button is clicked
                      signIn();
                    }}
                    style={buttonStyle}
                    onMouseDown={() => setIsButtonPressed(true)}
                    onMouseUp={() => setIsButtonPressed(false)}
                    onMouseLeave={() => setIsButtonPressed(false)}
                    disabled={!isFormValid}
                  >
                    Sign In
                  </button>

                <div className='loginOr'>
                  -OR-
                </div>
                <div className='loginSwitch'>Don't have an account? <a className='getStarted' onClick={() => {
              setIsCreatingAccount(true);
              clearFields();
            }}>Get started</a></div>
                </div>
              </div>
            )
          ) : (
            <Dashboard isSignedIn={isSignedIn} info={info} fetchInfo={fetchInfo} />
          )}
        </div>  
      </div>
    </div>
  );
}

export default App;