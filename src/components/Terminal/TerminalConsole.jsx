import React from 'react';

function TerminalConsole({ consoleRef, commandHistory }) {
  return (
    <div className="console" ref={consoleRef}>
      {commandHistory.map((item, index) => (
        <div 
          key={index} 
          className={`console-line ${item.type === 'command' ? 'command-line' : ''}`}
        >
          {item.type === 'command' ? (
            <><span className="command-history">guest@nate.green:~$</span> {item.content}</>
          ) : (
            item.content
          )}
        </div>
      ))}
    </div>
  );
}

export default TerminalConsole;
