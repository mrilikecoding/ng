import { useEffect, useState } from 'react';
import { getAllCommands } from '../../commands/index';

function TerminalConsole({ consoleRef, commandHistory, handleCommandClick }) {
  // Set default commands list so we don't have to wait for getAllCommands() to load
  const [availableCommands, setAvailableCommands] = useState([
    'help', 'about', 'skills', 'projects', 'contact', 'clear', 'banner', 'fullscreen', 'theme'
  ]);

  // Load commands from registry when available
  useEffect(() => {
    try {
      const commands = getAllCommands();
      if (Object.keys(commands).length > 0) {
        setAvailableCommands(Object.keys(commands));
      }
    } catch (error) {
      console.error('Error loading commands for console:', error);
      // Already have default commands from useState
    }
  }, []);

  // Check if a string contains command names
  const extractCommands = (text) => {
    // Find command words that are surrounded by spaces, punctuation, or at start/end of text
    return availableCommands.filter(cmd => {
      // Create a regex pattern that matches the command as a whole word
      const pattern = new RegExp(`(^|[^a-zA-Z0-9-])${cmd}($|[^a-zA-Z0-9-])`, 'i');
      return pattern.test(text);
    });
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