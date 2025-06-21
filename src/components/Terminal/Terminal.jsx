import { useState, useEffect, useRef } from 'react';
import TerminalHeader from './TerminalHeader';
import TerminalConsole from './TerminalConsole';
import TerminalPrompt from './TerminalPrompt';
import TerminalFooter from './TerminalFooter';
import { useTheme } from '../../contexts/ThemeContext';
import { loadCommands, executeCommand } from '../../commands/index';
import './Terminal.css';

function Terminal() {
  const [commandHistory, setCommandHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [status, setStatus] = useState('Loading...');
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [commandsLoaded, setCommandsLoaded] = useState(false);
  const { theme, toggleTheme } = useTheme();
  
  const consoleRef = useRef(null);
  const inputRef = useRef(null);
  // Reference for future command registry manipulations
  // const commandRegistryRef = useRef({});

  // Load commands on component mount
  useEffect(() => {
    const initializeCommands = async () => {
      try {
        await loadCommands();
        setCommandsLoaded(true);
        setStatus('Ready');
      } catch (error) {
        console.error('Failed to load commands:', error);
        setStatus('Error loading commands');
        addCommandToHistory(`Error: Failed to initialize command system. ${error.message}`);
      }
    };

    initializeCommands();
  }, []);

  // Handle command execution
  const processCommand = (commandStr) => {
    const args = commandStr.trim().split(' ');
    const cmd = args.shift().toLowerCase();

    if (cmd === '') {
      return '';
    }

    // Create context object with terminal state and functions
    const context = {
      toggleFullscreen,
      toggleTheme,
      theme
    };

    // Execute the command
    try {
      const output = executeCommand(cmd, args, context);
      
      // Special handling for clear command
      if (cmd === 'clear' && output === 'CLEAR_COMMAND') {
        setCommandHistory([]);
        return '';
      }
      
      return output;
    } catch (e) {
      console.error(`Error executing command ${cmd}:`, e);
      return `Error executing command: ${e.message}`;
    }
  };

  // Add a new line to the command history
  const addCommandToHistory = (command, isCommand = false, output = '') => {
    setCommandHistory(prev => [
      ...prev,
      { type: isCommand ? 'command' : 'output', content: command },
      ...(output ? [{ type: 'output', content: output }] : [])
    ]);
  };
  
  // Handle clickable command
  const handleCommandClick = (cmd) => {
    // Set the command in the input field
    setInputValue(cmd);
    
    // Execute the command
    addCommandToHistory(cmd, true);
    
    // Get output
    const output = processCommand(cmd);
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
      const output = processCommand(command);
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
    // Only show banner when commands are loaded and if not shown before
    if (commandsLoaded && commandHistory.length === 0 && !bannerShownRef.current) {
      bannerShownRef.current = true;
      const bannerOutput = executeCommand('banner');
      bannerOutput.split('\n').forEach(line => {
        addCommandToHistory(line);
      });
    }
  }, [commandsLoaded, commandHistory.length]);

  return (
    <>
      <div className="crt-effect"></div>
      <div className={`container ${isFullscreen ? 'fullscreen' : ''} theme-${theme}`} onClick={handleContainerClick}>
        <TerminalHeader 
          isFullscreen={isFullscreen} 
          toggleFullscreen={toggleFullscreen}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        <TerminalConsole 
          consoleRef={consoleRef}
          commandHistory={commandHistory}
          handleCommandClick={handleCommandClick}
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