//navbar.jsx
import logo from './images/logo.webp';
import React from 'react';

function Navbar({ signOut, isSignedIn }) {
  return (
    <nav className="navbar">
      <div className='navContents'>
        <a href='https://carrepairsites.com' className='cs-logo'>
        <img src={logo} alt="Logo" width="210" height="29"/>
        </a>
        <div className='navButtons'>
        <ul>
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
