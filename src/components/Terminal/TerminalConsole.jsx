import { useEffect, useState } from 'react';
import { getAllCommands } from '../../commands/index';

function TerminalConsole({ consoleRef, commandHistory, handleCommandClick }) {
  // Set default commands list so we don't have to wait for getAllCommands() to load
  const [, setAvailableCommands] = useState([
    'help', 'about', 'skills', 'projects', 'contact', 'clear', 'banner', 'fullscreen', 'theme', 'sitemap'
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

  // Process output lines - handle HTML and command tags
  const renderOutput = (content) => {
    // Handle regular HTML links and rainbow spans
    if ((content.includes('<a ') || content.includes('</a>') || content.includes('<span class="rainbow-char"')) && !content.includes('<cmd>')) {
      return (
        <span dangerouslySetInnerHTML={{ __html: content }} />
      );
    }
    
    // If content contains our special command tag, process it
    if (content.includes('<cmd>')) {
      // Create a regex pattern to match our command tags
      const cmdPattern = /<cmd>(.*?)<\/cmd>/g;
      
      // Get all matches
      const matches = [...content.matchAll(cmdPattern)];
      
      if (matches.length === 0) {
        return content;
      }
      
      // Split the content on cmd tags and rebuild with clickable spans
      const fragments = [];
      let lastIndex = 0;
      
      matches.forEach((match, index) => {
        // Get the text before the command
        const beforeCmd = content.substring(lastIndex, match.index);
        if (beforeCmd) {
          fragments.push(<span key={`text-${index}`}>{beforeCmd}</span>);
        }
        
        // Get the command name
        const cmdName = match[1];
        
        // Add the command as a clickable span
        fragments.push(
          <span 
            key={`cmd-${index}`} 
            className="clickable-command" 
            onClick={() => handleCommandClick(cmdName)}
            title={`Run '${cmdName}' command`}
          >
            {cmdName}
          </span>
        );
        
        // Update lastIndex to after this command tag
        lastIndex = match.index + match[0].length;
      });
      
      // Add any remaining text after the last command
      if (lastIndex < content.length) {
        fragments.push(<span key="text-last">{content.substring(lastIndex)}</span>);
      }
      
      return fragments;
    }
    
    // For regular text without special tags
    return content;
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
            item.content === '' ? '\u00A0' : renderOutput(item.content)
          )}
        </div>
      ))}
    </div>
  );
}

export default TerminalConsole;