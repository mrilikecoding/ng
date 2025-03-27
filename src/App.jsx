import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [commandHistory, setCommandHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [status, setStatus] = useState('Ready');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const consoleRef = useRef(null);
  const inputRef = useRef(null);

  // Available commands
  const commands = {
    help: function() {
      return `Available commands:
about       - Display information about me
skills      - List my technical skills
projects    - Show my portfolio
contact     - Show contact information
clear       - Clear the console
banner      - Display welcome banner
fullscreen  - Toggle fullscreen mode (or press F11)`;
    },
    fullscreen: function() {
      setTimeout(() => toggleFullscreen({ stopPropagation: () => {} }), 100);
      return 'Toggling fullscreen mode...';
    },
    about: function() {
      return `Nate Green - Developer, explorer, and creator.
Passionate about clean code, elegant design, and building useful things.
Based in [Your Location].

Currently focusing on web development and creative coding projects.`;
    },
    skills: function() {
      return `Technical Skills:
• Languages: JavaScript, Python, Go, HTML/CSS
• Frontend: React, Vue, TailwindCSS
• Backend: Node.js, Express, Django
• Tools: Git, Docker, AWS, Linux`;
    },
    projects: function() {
      return `Portfolio Projects:

1. Project Name
   Description: A web application that does something cool.
   Technologies: React, Node.js, MongoDB

2. Another Project
   Description: Mobile app for tracking something interesting.
   Technologies: React Native, Firebase`;
    },
    contact: function() {
      return `Contact Information:
• Email: hello@nate.green
• GitHub: github.com/username
• Twitter: @nategreen`;
    },
    clear: function() {
      setCommandHistory([]);
      return '';
    },
    banner: function() {
      return `
_   _       _         _____
| \\ | |     | |       / ____|
|  \\| | __ _| |_ ___ | |  __ _ __ ___  ___ _ __
| . \` |/ _\` | __/ _ \\| | |_ | '__/ _ \\/ _ \\ '_ \\
| |\\  | (_| | ||  __/| |__| | | |  __/  __/ | | |
|_| \\_|\\__,_|\\__\\___| \\_____|_|  \\___|\\__|_| |_|

Welcome to nate.green interactive terminal [Version 1.0.3]
Type 'help' for available commands.`;
    }
  };

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
        output = commands[cmd](args);
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
    e.stopPropagation(); // Prevent container click handler from firing
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

  // Initial banner
  useEffect(() => {
    // Only show banner on initial load
    if (commandHistory.length === 0) {
      const bannerOutput = commands.banner();
      bannerOutput.split('\n').forEach(line => {
        addCommandToHistory(line);
      });
    }
  }, []);

  return (
    <>
      <div className="crt-effect"></div>
      <div className={`container ${isFullscreen ? 'fullscreen' : ''}`} onClick={handleContainerClick}>
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

        <div className="footer">
          <div className="footer-links">
            <a href="mailto:hello@nate.green">hello@nate.green</a> |
            <a href="https://github.com/username" target="_blank" rel="noreferrer">github</a>
          </div>
          <div className="status">{status}</div>
        </div>
      </div>
    </>
  )
}

export default App
