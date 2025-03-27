import React from 'react';

function TerminalHeader({ isFullscreen, toggleFullscreen }) {
  return (
    <div className="header">
      <h1 className="domain">nate.green</h1>
      <div className="header-info">
        v1.0.3
        <button 
          className="fullscreen-toggle" 
          onClick={toggleFullscreen} 
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? '⊠' : '⊞'}
        </button>
      </div>
    </div>
  );
}

export default TerminalHeader;
