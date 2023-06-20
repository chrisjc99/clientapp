import React from 'react';

function Message({ info }) {
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
              <button className='button'>VIEW MY SITE</button>
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
