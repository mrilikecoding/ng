import { useState, useEffect, useRef } from 'react';
import TerminalHeader from './TerminalHeader';
import TerminalConsole from './TerminalConsole';
import TerminalPrompt from './TerminalPrompt';
import TerminalFooter from './TerminalFooter';
import { commands } from '../../utils/commands';
import './Terminal.css';

function Terminal() {
  const [commandHistory, setCommandHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [status, setStatus] = useState('Ready');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const consoleRef = useRef(null);
  const inputRef = useRef(null);

  // Handle command execution
  const executeCommand = (commandStr) => {
    const args = commandStr.trim().split(' ');
    const cmd = args.shift().toLowerCase();

    if (cmd === '') {
      return '';
    }

    let output = '';

    if (commands[cmd]) {
      try {
        output = commands[cmd](args, { toggleFullscreen });
        
        // Special handling for clear command
        if (cmd === 'clear' && output === 'CLEAR_COMMAND') {
          setCommandHistory([]);
          return '';
        }
      } catch (e) {
        output = `Error executing command: ${e.message}`;
      }
    } else {
      output = `Command not found: ${cmd}. Type 'help' for available commands.`;
    }

    return output;
  };

  // Add a new line to the command history
  const addCommandToHistory = (command, isCommand = false, output = '') => {
    setCommandHistory(prev => [
      ...prev,
      { type: isCommand ? 'command' : 'output', content: command },
      ...(output ? [{ type: 'output', content: output }] : [])
    ]);
  };

  // Handle key press in input
  const handleKeyDown = (e) => {
    // F11 or Alt+Enter to toggle fullscreen
    if (e.key === 'F11' || (e.altKey && e.key === 'Enter')) {
      e.preventDefault();
      toggleFullscreen(e);
      return;
    }
    
    if (e.key === 'Enter') {
      const command = inputValue;
      
      // Add command to history
      addCommandToHistory(command, true);
      
      // Execute command and get output
      const output = executeCommand(command);
      if (output) {
        output.split('\n').forEach(line => {
          addCommandToHistory(line);
        });
      }
      
      // Clear input
      setInputValue('');
      setCursorPosition(0);
      
      // Update status
      setStatus('Processing...');
      setTimeout(() => {
        setStatus('Ready');
      }, 500);
    }
  };

  // Update cursor position when input changes
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setCursorPosition(e.target.value.length);
  };

  // Focus input when container is clicked
  const handleContainerClick = () => {
    inputRef.current.focus();
  };
  
  // Toggle fullscreen mode
  const toggleFullscreen = (e) => {
    if (e) e.stopPropagation(); // Prevent container click handler from firing
    setIsFullscreen(!isFullscreen);
    
    // Focus back on input after toggling
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  // Scroll to bottom of console when command history changes
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [commandHistory]);

  // Initial banner - using a ref to ensure it only runs once
  const bannerShownRef = useRef(false);
  
  useEffect(() => {
    // Only show banner on initial load and if not shown before
    if (commandHistory.length === 0 && !bannerShownRef.current) {
      bannerShownRef.current = true;
      const bannerOutput = commands.banner();
      bannerOutput.split('\n').forEach(line => {
        addCommandToHistory(line);
      });
    }
  }, [commandHistory.length]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className="crt-effect"></div>
      <div className={`container ${isFullscreen ? 'fullscreen' : ''}`} onClick={handleContainerClick}>
        <TerminalHeader 
          isFullscreen={isFullscreen} 
          toggleFullscreen={toggleFullscreen} 
        />

        <TerminalConsole 
          consoleRef={consoleRef}
          commandHistory={commandHistory}
        />

        <TerminalPrompt 
          inputRef={inputRef}
          inputValue={inputValue}
          cursorPosition={cursorPosition}
          handleInputChange={handleInputChange}
          handleKeyDown={handleKeyDown}
        />

        <TerminalFooter status={status} />
      </div>
    </>
  );
}

export default Terminal;
