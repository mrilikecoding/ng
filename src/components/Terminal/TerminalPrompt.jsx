
function TerminalPrompt({ inputRef, inputValue, cursorPosition, handleInputChange, handleKeyDown }) {
  return (
    <div className="prompt">
      <span className="prompt-prefix">guest@nate.green:~$</span>
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
            left: `${Math.min(cursorPosition * 8, window.innerWidth * 0.8)}px`
          }}
        ></div>
      </div>
    </div>
  );
}

export default TerminalPrompt;
