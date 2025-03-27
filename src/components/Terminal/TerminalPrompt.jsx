import React from 'react';

function TerminalPrompt({ inputRef, inputValue, cursorPosition, handleInputChange, handleKeyDown }) {
  return (
    <div className="prompt">
      <div className="input-container">
        <input
          type="text"
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          autoFocus
        />
        <div 
          className="cursor" 
          style={{ 
            left: `${Math.min(cursorPosition * 8, window.innerWidth * 0.8)}px`,
            display: inputValue.length > 0 ? 'block' : 'none'
          }}
        ></div>
      </div>
    </div>
  );
}

export default TerminalPrompt;
