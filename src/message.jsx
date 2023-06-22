import React, {useState} from 'react';


function Message({ info }) {

  const [isButtonPressed, setButtonPressed] = useState(false);


  const buttonStyle = {
    position: 'relative',
    boxShadow: isButtonPressed ? 'none' : '5px 5px 0px rgba(0, 0, 0, 0.2)',
    transform: isButtonPressed ? 'translate(5px, 5px)' : 'none',
    transition: 'all 0.03s ease-in-out',
  };


  const truncateUrl = (url, max) => {
    if(url.length <= max) return url;
    let splitUrl = url.split('.');
    if(splitUrl.length < 2) return url.substring(0, max - 3) + "...";
    return url.substring(0, max - 3 - splitUrl[splitUrl.length - 1].length) + "..." + splitUrl[splitUrl.length - 1];
  }

  const maxLength = 20;

  return (
    <div className="userInfo">
      {info.map((infoItem, index) => (
        <div className='infoContent' key={index}>
          <div className='titleThumbView'>
          <div className='userMessage'>{truncateUrl(infoItem.titleUrl, maxLength)}</div>
          <div className='thumbButton'>
          <img className='thumbnail' src={infoItem.thumbnail} alt={infoItem.titleUrl} />
          {infoItem.url && (
            <a className='buttonLink' href={infoItem.url} target="_blank" rel="noreferrer">
              <button className='button' style={buttonStyle} 
              onMouseDown={() => setButtonPressed(true)}
              onMouseUp={() => setButtonPressed(false)}
              onMouseLeave={() => setButtonPressed(false)} >VIEW MY SITE</button>
            </a>
          )}
          </div>

          </div>

        </div>
      ))}
    </div>
  );
}

export default Message;
