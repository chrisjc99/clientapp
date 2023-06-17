//navbar.jsx
import logo from './images/logo.svg';
import React from 'react';

function Navbar({ signOut, isSignedIn }) {
  return (
    <nav className="navbar">
      <div className='navContents'>
      <img src={logo} alt="Logo" />
        <div className='navButtons'>
        <ul>
        <li>
          <a href="https://highlandwebdesign.com/">Full Site</a>
        </li>
        {isSignedIn && (
          <li>
            <button className='logout' onClick={signOut}>
            <div className='logoutText'>Log Out</div></button>
          </li>
        )}
      </ul>
        </div>

      </div>
      
    </nav>
  );
}

export default Navbar;
