//navbar.jsx
import logo from './images/logo.webp';
import React from 'react';

function Navbar({ signOut, isSignedIn }) {
  return (
    <nav className="navbar">
      <div className='navContents'>
        <a className='cs-logo'>
        <img src={logo} alt="Logo" width="210" height="29"/>
        </a>

        <div className='navButtons'>
        <ul>
        <li>
          <a href="https://carrepairsites.com/">Full Site</a>
        </li>
        {isSignedIn && (
          <li>
            <button className='logout' onClick={signOut}> Log Out
            </button>
          </li>
        )}
      </ul>
        </div>

      </div>
      
    </nav>
  );
}

export default Navbar;
