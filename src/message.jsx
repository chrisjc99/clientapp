//message.jsx

import React from 'react';

function Message({ info }) { // Accept info as a prop
  return (
    <div className="userInfo">
      <h1>View and manage your website here.</h1>
      {info.map((infoItem, index) => (
        <div key={index}>
          <div>{infoItem.titleUrl}</div>
          <div>{infoItem.thumbnail}</div>
          <div>{infoItem.url}</div>
        </div>
      ))}
    </div>
  );
}

export default Message;