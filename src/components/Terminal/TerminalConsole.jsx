import React from 'react';

function TerminalConsole({ consoleRef, commandHistory, handleCommandClick }) {
  // Check if a string matches a command name
  const extractCommands = (text) => {
    // List of all available commands from help output
    const availableCommands = ['help', 'about', 'skills', 'projects', 'contact', 'clear', 'banner', 'fullscreen', 'theme'];
    
    // Search for command words in the text
    return availableCommands.filter(cmd => text.includes(cmd));
  };

  // Make command words clickable, but only in output lines
  const renderOutputWithClickableCommands = (content) => {
    const commands = extractCommands(content);
    
    if (commands.length === 0) {
      return content;
    }
    
    // Create a regex pattern to match all command words
    const pattern = new RegExp(`(${commands.join('|')})`, 'g');
    
    // Split the content based on the pattern
    const parts = content.split(pattern);
    
    return parts.map((part, i) => {
      // If this part is a command, make it clickable
      if (commands.includes(part)) {
        return (
          <span 
            key={i} 
            className="clickable-command" 
            onClick={() => handleCommandClick(part)}
            title={`Run '${part}' command`}
          >
            {part}
          </span>
        );
      }
      // Otherwise, just return the text
      return part;
    });
  };

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
            renderOutputWithClickableCommands(item.content)
          )}
        </div>
      ))}
    </div>
  );
}

export default TerminalConsole;
