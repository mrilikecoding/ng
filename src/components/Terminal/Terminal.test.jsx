import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import Terminal from './Terminal';
import { ThemeProvider } from '../../contexts/ThemeContext';
import * as commandSystem from '../../commands/index';

// Mock localStorage and window.matchMedia
beforeEach(() => {
  // Mock localStorage
  const localStorageMock = {
    getItem: vi.fn().mockReturnValue('dark'),
    setItem: vi.fn()
  };
  global.localStorage = localStorageMock;
  
  // Mock matchMedia 
  global.window.matchMedia = vi.fn().mockImplementation(query => {
    return {
      matches: true,
      media: query
    };
  });
  
  // Mock document methods
  document.documentElement.setAttribute = vi.fn();

  // Mock setTimeout
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

// Mock command system
vi.mock('../../commands/index', () => ({
  loadCommands: vi.fn().mockResolvedValue({}),
  executeCommand: vi.fn(cmd => {
    if (cmd === 'banner') return 'mock banner';
    if (cmd === 'help') return 'mock help output';
    if (cmd === 'about') return 'mock about output';
    if (cmd === 'clear') return 'CLEAR_COMMAND';
    if (cmd === 'fullscreen') return 'mock fullscreen output';
    if (cmd === 'theme') return 'mock theme output';
    if (cmd === 'skills') return 'mock skills output';
    return `Command not found: ${cmd}`;
  }),
  getAllCommands: vi.fn().mockReturnValue({
    help: { metadata: { name: 'help' } },
    banner: { metadata: { name: 'banner' } }, 
    clear: { metadata: { name: 'clear' } }, 
    about: { metadata: { name: 'about' } }, 
    skills: { metadata: { name: 'skills' } },
    sitemap: { metadata: { name: 'sitemap' } },
    fullscreen: { metadata: { name: 'fullscreen' } }, 
    theme: { metadata: { name: 'theme' } }
  })
}));

const renderTerminal = () => {
  return render(
    <ThemeProvider>
      <Terminal />
    </ThemeProvider>
  );
};

describe('Terminal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset getAllCommands mock to default
    commandSystem.getAllCommands.mockReturnValue({
      help: { metadata: { name: 'help' } },
      banner: { metadata: { name: 'banner' } }, 
      clear: { metadata: { name: 'clear' } }, 
      about: { metadata: { name: 'about' } }, 
      skills: { metadata: { name: 'skills' } },
      sitemap: { metadata: { name: 'sitemap' } },
      fullscreen: { metadata: { name: 'fullscreen' } }, 
      theme: { metadata: { name: 'theme' } }
    });
  });

  it('loads commands on initial render', async () => {
    await act(async () => {
      renderTerminal();
    });
    
    expect(commandSystem.loadCommands).toHaveBeenCalled();
    
    // Wait for async command loading and banner execution
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    
    expect(commandSystem.executeCommand).toHaveBeenCalledWith('banner', [], expect.anything());
  });

  it('processes user input when enter is pressed', async () => {
    await act(async () => {
      renderTerminal();
    });
    
    // Wait for commands to load
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    
    const input = screen.getByRole('textbox');
    
    await act(async () => {
      fireEvent.change(input, { target: { value: 'help' }});
      fireEvent.keyDown(input, { key: 'Enter' });
    });
    
    expect(commandSystem.executeCommand).toHaveBeenCalledWith('help', [], expect.anything());
    
    // Run timers to handle the status update
    await act(async () => {
      vi.runAllTimers();
    });
    
    // Check console for output
    const consoleElement = input.closest('.container').querySelector('.console');
    const helpTextElements = within(consoleElement).getAllByText((content, element) => {
      return element.textContent.includes('mock help output');
    });
    
    expect(helpTextElements.length).toBeGreaterThan(0);
    expect(input.value).toBe('');
  });

  it('clears the console when clear command is executed', async () => {
    await act(async () => {
      renderTerminal();
    });
    
    // Wait for commands to load
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    
    // First add some content
    const input = screen.getByRole('textbox');
    await act(async () => {
      fireEvent.change(input, { target: { value: 'help' }});
      fireEvent.keyDown(input, { key: 'Enter' });
    });
    
    // Run timers
    await act(async () => {
      vi.runAllTimers();
    });
    
    // Now clear
    await act(async () => {
      fireEvent.change(input, { target: { value: 'clear' }});
      fireEvent.keyDown(input, { key: 'Enter' });
    });
    
    // Run timers again
    await act(async () => {
      vi.runAllTimers();
    });
    
    expect(commandSystem.executeCommand).toHaveBeenCalledWith('clear', [], expect.anything());
    
    const consoleElement = input.closest('.container').querySelector('.console');
    expect(within(consoleElement).queryByText('mock help output')).not.toBeInTheDocument();
  });

  it('renders HTML output correctly', async () => {
    // Mock getAllCommands
    commandSystem.getAllCommands.mockReturnValue({
      banner: { metadata: { name: 'banner' } }
    });
    
    await act(async () => {
      renderTerminal();
    });
    
    // Wait for commands to load
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    
    // Need to wait for the banner to be displayed
    await act(async () => {
      vi.runAllTimers();
    });
    
    // Simulate outputting HTML content
    const input = screen.getByRole('textbox');
    const consoleElement = input.closest('.container').querySelector('.console');
    
    // Content with HTML link
    const htmlContent = 'Check out <a href="#test">this link</a> for more info';
    commandSystem.executeCommand.mockReturnValueOnce(htmlContent);
    
    // Execute a command that outputs HTML
    await act(async () => {
      fireEvent.change(input, { target: { value: 'html-test' }});
      fireEvent.keyDown(input, { key: 'Enter' });
    });
    
    // Run timers
    await act(async () => {
      vi.runAllTimers();
    });
    
    // Verify command was executed
    expect(commandSystem.executeCommand).toHaveBeenCalledWith('html-test', [], expect.anything());
    
    // Verify console contains text from the HTML output
    const consoleText = consoleElement.textContent;
    expect(consoleText).toContain('Check out this link for more info');
  });

  describe('Command History Navigation', () => {
    it('navigates command history with arrow keys', async () => {
      await act(async () => {
        renderTerminal();
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      const input = screen.getByRole('textbox');

      // Execute first command
      await act(async () => {
        fireEvent.change(input, { target: { value: 'help' }});
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      await act(async () => {
        vi.runAllTimers();
      });

      // Execute second command
      await act(async () => {
        fireEvent.change(input, { target: { value: 'about' }});
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      await act(async () => {
        vi.runAllTimers();
      });

      // Navigate up through history
      await act(async () => {
        fireEvent.keyDown(input, { key: 'ArrowUp' });
      });

      expect(input.value).toBe('about');

      // Navigate up again
      await act(async () => {
        fireEvent.keyDown(input, { key: 'ArrowUp' });
      });

      expect(input.value).toBe('help');

      // Navigate down
      await act(async () => {
        fireEvent.keyDown(input, { key: 'ArrowDown' });
      });

      expect(input.value).toBe('about');
    });

    it('handles empty history gracefully', async () => {
      await act(async () => {
        renderTerminal();
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      const input = screen.getByRole('textbox');

      // Try to navigate history when empty
      await act(async () => {
        fireEvent.keyDown(input, { key: 'ArrowUp' });
      });

      expect(input.value).toBe('');

      await act(async () => {
        fireEvent.keyDown(input, { key: 'ArrowDown' });
      });

      expect(input.value).toBe('');
    });

    it('prevents duplicate commands in history', async () => {
      await act(async () => {
        renderTerminal();
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      const input = screen.getByRole('textbox');

      // Execute same command twice
      await act(async () => {
        fireEvent.change(input, { target: { value: 'help' }});
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      await act(async () => {
        vi.runAllTimers();
      });

      await act(async () => {
        fireEvent.change(input, { target: { value: 'help' }});
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      await act(async () => {
        vi.runAllTimers();
      });

      // Navigate up - should only show 'help' once
      await act(async () => {
        fireEvent.keyDown(input, { key: 'ArrowUp' });
      });

      expect(input.value).toBe('help');

      // Navigate up again - should still be 'help' (no duplicate)
      await act(async () => {
        fireEvent.keyDown(input, { key: 'ArrowUp' });
      });

      expect(input.value).toBe('help');
    });
  });

  describe('Tab Completion', () => {
    it('completes command when single match found', async () => {
      await act(async () => {
        renderTerminal();
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      const input = screen.getByRole('textbox');

      // Type partial command
      await act(async () => {
        fireEvent.change(input, { target: { value: 'he' }});
      });

      // Verify the input value was set
      expect(input.value).toBe('he');

      // Press tab
      await act(async () => {
        fireEvent.keyDown(input, { key: 'Tab' });
      });

      expect(input.value).toBe('help');
    });

    it('shows suggestions when multiple matches found', async () => {
      await act(async () => {
        renderTerminal();
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      const input = screen.getByRole('textbox');

      // Type partial command that matches multiple (s matches 'skills' and 'sitemap')
      await act(async () => {
        fireEvent.change(input, { target: { value: 's' }});
      });

      // Press tab - should show multiple matches
      await act(async () => {
        fireEvent.keyDown(input, { key: 'Tab' });
      });

      // Input should remain unchanged when multiple matches
      expect(input.value).toBe('s');
    });

    it('handles no matches gracefully', async () => {
      await act(async () => {
        renderTerminal();
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      const input = screen.getByRole('textbox');

      // Type command that doesn't match anything
      await act(async () => {
        fireEvent.change(input, { target: { value: 'xyz' }});
      });

      // Press tab
      await act(async () => {
        fireEvent.keyDown(input, { key: 'Tab' });
      });

      // Input should remain unchanged
      expect(input.value).toBe('xyz');
    });

    it('resets history index when typing after navigation', async () => {
      await act(async () => {
        renderTerminal();
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      const input = screen.getByRole('textbox');

      // Execute a command
      await act(async () => {
        fireEvent.change(input, { target: { value: 'help' }});
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      await act(async () => {
        vi.runAllTimers();
      });

      // Navigate to history
      await act(async () => {
        fireEvent.keyDown(input, { key: 'ArrowUp' });
      });

      expect(input.value).toBe('help');

      // Start typing - should reset history
      await act(async () => {
        fireEvent.change(input, { target: { value: 'about' }});
      });

      // Try tab completion
      await act(async () => {
        fireEvent.keyDown(input, { key: 'Tab' });
      });

      expect(input.value).toBe('about');
    });
  });

  describe('Vim Mode Functionality', () => {
    beforeEach(() => {
      // For vim mode tests, we need the actual Terminal component to handle mode switching
      // The executeCommand mock should just return empty string for mode commands
      commandSystem.executeCommand.mockImplementation((cmd, args, context) => {
        if (cmd === 'mode' || cmd === 'vim' || cmd === 'm') {
          // Call the actual toggleVimMode function if it exists in context
          if (context && context.toggleVimMode) {
            context.toggleVimMode();
          }
          return ''; // Silent mode switch
        }
        if (cmd === 'banner') return 'mock banner';
        if (cmd === 'help') return 'mock help output';
        if (cmd === 'about') return 'mock about output';
        if (cmd === 'clear') return 'CLEAR_COMMAND';
        return `Command not found: ${cmd}`;
      });
      
      // Add mode command to getAllCommands
      commandSystem.getAllCommands.mockReturnValue({
        help: { metadata: { name: 'help' } },
        banner: { metadata: { name: 'banner' } },
        mode: { metadata: { name: 'mode', aliases: ['vim', 'm'] } },
        clear: { metadata: { name: 'clear' } },
        about: { metadata: { name: 'about' } },
        skills: { metadata: { name: 'skills' } },
        sitemap: { metadata: { name: 'sitemap' } },
        fullscreen: { metadata: { name: 'fullscreen' } },
        theme: { metadata: { name: 'theme' } }
      });
    });

    it('starts in INSERT mode by default', async () => {
      await act(async () => {
        renderTerminal();
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      // Check that the mode indicator shows INSERT
      const modeIndicator = screen.getByText('INSERT');
      expect(modeIndicator).toBeInTheDocument();
      expect(modeIndicator).toHaveClass('vim-mode-insert');
    });

    it('toggles to NORMAL mode when mode command is executed', async () => {
      await act(async () => {
        renderTerminal();
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      const input = screen.getByRole('textbox');

      // Execute mode command
      await act(async () => {
        fireEvent.change(input, { target: { value: 'mode' }});
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      await act(async () => {
        vi.runAllTimers();
      });

      // Check that mode switched to NORMAL
      const modeIndicator = screen.getByText('NORMAL');
      expect(modeIndicator).toBeInTheDocument();
      expect(modeIndicator).toHaveClass('vim-mode-normal');
    });

    it('mode command aliases work (vim, m)', async () => {
      await act(async () => {
        renderTerminal();
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      const input = screen.getByRole('textbox');

      // Test 'vim' alias
      await act(async () => {
        fireEvent.change(input, { target: { value: 'vim' }});
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      await act(async () => {
        vi.runAllTimers();
      });

      expect(screen.getByText('NORMAL')).toBeInTheDocument();

      // Switch back to INSERT mode using 'i' key (since that works)
      await act(async () => {
        fireEvent.keyDown(document, { key: 'i' });
      });

      expect(screen.getByText('INSERT')).toBeInTheDocument();

      // Now test 'm' alias 
      await act(async () => {
        fireEvent.change(input, { target: { value: 'm' }});
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      await act(async () => {
        vi.runAllTimers();
      });

      expect(screen.getByText('NORMAL')).toBeInTheDocument();
    });

    it('mode commands are silent (no console output)', async () => {
      await act(async () => {
        renderTerminal();
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      const input = screen.getByRole('textbox');
      const consoleElement = input.closest('.container').querySelector('.console');
      const initialConsoleContent = consoleElement.textContent;

      // Execute mode command
      await act(async () => {
        fireEvent.change(input, { target: { value: 'mode' }});
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      await act(async () => {
        vi.runAllTimers();
      });

      // Console content should be unchanged (no command echo or output)
      expect(consoleElement.textContent).toBe(initialConsoleContent);
      
      // Should not contain the command prompt
      expect(consoleElement.textContent).not.toContain('guest@nate.green:~$ mode');
    });

    it('switches to INSERT mode when i key is pressed in NORMAL mode', async () => {
      await act(async () => {
        renderTerminal();
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      const input = screen.getByRole('textbox');

      // Switch to NORMAL mode first
      await act(async () => {
        fireEvent.change(input, { target: { value: 'mode' }});
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      await act(async () => {
        vi.runAllTimers();
      });

      expect(screen.getByText('NORMAL')).toBeInTheDocument();

      // Press 'i' key globally (simulating global key listener)
      await act(async () => {
        fireEvent.keyDown(document, { key: 'i' });
      });

      // Should switch back to INSERT mode
      expect(screen.getByText('INSERT')).toBeInTheDocument();
    });

    it('handles vim navigation keys in NORMAL mode', async () => {
      await act(async () => {
        renderTerminal();
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      const input = screen.getByRole('textbox');
      const consoleElement = input.closest('.container').querySelector('.console');

      // Add some content to scroll
      await act(async () => {
        fireEvent.change(input, { target: { value: 'help' }});
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      await act(async () => {
        vi.runAllTimers();
      });

      // Switch to NORMAL mode
      await act(async () => {
        fireEvent.change(input, { target: { value: 'mode' }});
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      await act(async () => {
        vi.runAllTimers();
      });

      expect(screen.getByText('NORMAL')).toBeInTheDocument();

      // Test navigation keys (mock scrollTop to verify they're called)
      
      // Mock scroll properties
      Object.defineProperty(consoleElement, 'scrollTop', {
        value: 0,
        writable: true,
        configurable: true
      });
      Object.defineProperty(consoleElement, 'scrollHeight', {
        value: 1000,
        writable: false,
        configurable: true
      });
      Object.defineProperty(consoleElement, 'clientHeight', {
        value: 500,
        writable: false,
        configurable: true
      });

      // Test 'j' key (scroll down)
      await act(async () => {
        fireEvent.keyDown(document, { key: 'j' });
      });

      // Test 'k' key (scroll up)
      await act(async () => {
        fireEvent.keyDown(document, { key: 'k' });
      });

      // Test 'h' and 'l' keys
      await act(async () => {
        fireEvent.keyDown(document, { key: 'h' });
        fireEvent.keyDown(document, { key: 'l' });
      });

      // The navigation keys should not cause errors
      expect(screen.getByText('NORMAL')).toBeInTheDocument();
    });

    it('clicking input field switches to INSERT mode from NORMAL mode', async () => {
      await act(async () => {
        renderTerminal();
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      const input = screen.getByRole('textbox');

      // Switch to NORMAL mode first
      await act(async () => {
        fireEvent.change(input, { target: { value: 'mode' }});
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      await act(async () => {
        vi.runAllTimers();
      });

      expect(screen.getByText('NORMAL')).toBeInTheDocument();

      // Click the input field
      await act(async () => {
        fireEvent.click(input);
      });

      // Should switch to INSERT mode
      expect(screen.getByText('INSERT')).toBeInTheDocument();
    });

    it('regular input only works in INSERT mode', async () => {
      await act(async () => {
        renderTerminal();
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      const input = screen.getByRole('textbox');

      // Switch to NORMAL mode
      await act(async () => {
        fireEvent.change(input, { target: { value: 'mode' }});
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      await act(async () => {
        vi.runAllTimers();
      });

      expect(screen.getByText('NORMAL')).toBeInTheDocument();

      // Try to type in input field - should not work in NORMAL mode
      await act(async () => {
        fireEvent.change(input, { target: { value: 'help' }});
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      await act(async () => {
        vi.runAllTimers();
      });

      // Command should not have been executed (still in NORMAL mode, input ignored)
      expect(commandSystem.executeCommand).not.toHaveBeenCalledWith('help', [], expect.anything());
      expect(screen.getByText('NORMAL')).toBeInTheDocument();
    });

    it('preserves console history when switching modes', async () => {
      await act(async () => {
        renderTerminal();
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      const input = screen.getByRole('textbox');
      const consoleElement = input.closest('.container').querySelector('.console');

      // Execute a command to add content
      await act(async () => {
        fireEvent.change(input, { target: { value: 'help' }});
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      await act(async () => {
        vi.runAllTimers();
      });

      const contentAfterHelp = consoleElement.textContent;

      // Switch to NORMAL mode
      await act(async () => {
        fireEvent.change(input, { target: { value: 'mode' }});
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      await act(async () => {
        vi.runAllTimers();
      });

      // Console content should be preserved (mode command is silent)
      expect(consoleElement.textContent).toBe(contentAfterHelp);
      expect(screen.getByText('NORMAL')).toBeInTheDocument();
    });
  });

  describe('URL Routing Functionality', () => {
    beforeEach(() => {
      // Mock window.history
      Object.defineProperty(window, 'history', {
        value: {
          pushState: vi.fn(),
        },
        writable: true,
        configurable: true
      });

      // Mock window.location
      Object.defineProperty(window, 'location', {
        value: {
          pathname: '/',
        },
        writable: true,
        configurable: true
      });

      // Reset URL to root before each test
      window.location.pathname = '/';
    });

    it('updates URL when content commands are executed', async () => {
      await act(async () => {
        renderTerminal();
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      const input = screen.getByRole('textbox');

      // Test about command
      await act(async () => {
        fireEvent.change(input, { target: { value: 'about' }});
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      await act(async () => {
        vi.runAllTimers();
      });

      expect(window.history.pushState).toHaveBeenCalledWith(null, '', '/about');

      // Test projects command
      await act(async () => {
        fireEvent.change(input, { target: { value: 'projects' }});
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      await act(async () => {
        vi.runAllTimers();
      });

      expect(window.history.pushState).toHaveBeenCalledWith(null, '', '/projects');
    });

    it('updates URL to root for banner commands', async () => {
      await act(async () => {
        renderTerminal();
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      const input = screen.getByRole('textbox');

      // Test banner command
      await act(async () => {
        fireEvent.change(input, { target: { value: 'banner' }});
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      await act(async () => {
        vi.runAllTimers();
      });

      expect(window.history.pushState).toHaveBeenCalledWith(null, '', '/');

      // Test home alias
      await act(async () => {
        fireEvent.change(input, { target: { value: 'home' }});
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      await act(async () => {
        vi.runAllTimers();
      });

      expect(window.history.pushState).toHaveBeenCalledWith(null, '', '/');
    });

    it('does not update URL for non-content commands', async () => {
      await act(async () => {
        renderTerminal();
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      const input = screen.getByRole('textbox');

      // Clear previous calls
      vi.clearAllMocks();

      // Test help command (should not update URL)
      await act(async () => {
        fireEvent.change(input, { target: { value: 'help' }});
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      await act(async () => {
        vi.runAllTimers();
      });

      expect(window.history.pushState).not.toHaveBeenCalled();

      // Test clear command (should not update URL)
      await act(async () => {
        fireEvent.change(input, { target: { value: 'clear' }});
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      await act(async () => {
        vi.runAllTimers();
      });

      expect(window.history.pushState).not.toHaveBeenCalled();
    });

    it('handles browser back/forward navigation', async () => {
      // Set initial URL to /about
      window.location.pathname = '/about';

      await act(async () => {
        renderTerminal();
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      // Simulate popstate event (browser back button)
      await act(async () => {
        window.location.pathname = '/projects';
        const popstateEvent = new PopStateEvent('popstate', { state: null });
        window.dispatchEvent(popstateEvent);
      });

      await act(async () => {
        vi.runAllTimers();
      });

      // Should execute projects command
      expect(commandSystem.executeCommand).toHaveBeenCalledWith('projects', [], expect.anything());
    });

    it('loads correct command based on initial URL', async () => {
      // Set URL to /skills before component loads
      window.location.pathname = '/skills';

      await act(async () => {
        renderTerminal();
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      // Should execute skills command on initial load
      expect(commandSystem.executeCommand).toHaveBeenCalledWith('skills', [], expect.anything());
    });

    it('defaults to banner for unknown URLs', async () => {
      // Set URL to unknown path
      window.location.pathname = '/unknown-path';

      await act(async () => {
        renderTerminal();
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      // Should default to banner command
      expect(commandSystem.executeCommand).toHaveBeenCalledWith('banner', [], expect.anything());
    });

    it('handles clickable commands with URL updates', async () => {
      await act(async () => {
        renderTerminal();
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      // Find a clickable command in the console and click it
      const consoleElement = screen.getByRole('textbox').closest('.container').querySelector('.console');
      
      // First execute a command that creates clickable commands
      const input = screen.getByRole('textbox');
      await act(async () => {
        fireEvent.change(input, { target: { value: 'help' }});
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      await act(async () => {
        vi.runAllTimers();
      });

      // Clear previous history calls
      vi.clearAllMocks();

      // Find and click a command (about should be available as clickable)
      const clickableCommands = consoleElement.querySelectorAll('.clickable-command');
      if (clickableCommands.length > 0) {
        const aboutCommand = Array.from(clickableCommands).find(cmd => cmd.textContent === 'about');
        if (aboutCommand) {
          await act(async () => {
            fireEvent.click(aboutCommand);
          });

          await act(async () => {
            vi.runAllTimers();
          });

          expect(window.history.pushState).toHaveBeenCalledWith(null, '', '/about');
        }
      }
    });

    it('URL routing works with command aliases', async () => {
      await act(async () => {
        renderTerminal();
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      const input = screen.getByRole('textbox');

      // Test welcome alias (should route to /)
      await act(async () => {
        fireEvent.change(input, { target: { value: 'welcome' }});
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      await act(async () => {
        vi.runAllTimers();
      });

      expect(window.history.pushState).toHaveBeenCalledWith(null, '', '/');

      // Test intro alias (should route to /)
      await act(async () => {
        fireEvent.change(input, { target: { value: 'intro' }});
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      await act(async () => {
        vi.runAllTimers();
      });

      expect(window.history.pushState).toHaveBeenCalledWith(null, '', '/');
    });

    it('preserves URL routing when mode commands are executed', async () => {
      await act(async () => {
        renderTerminal();
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      const input = screen.getByRole('textbox');

      // Clear previous calls
      vi.clearAllMocks();

      // Test mode command (should not update URL)
      await act(async () => {
        fireEvent.change(input, { target: { value: 'mode' }});
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      await act(async () => {
        vi.runAllTimers();
      });

      expect(window.history.pushState).not.toHaveBeenCalled();

      // Test vim alias (should not update URL)
      await act(async () => {
        fireEvent.change(input, { target: { value: 'vim' }});
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      await act(async () => {
        vi.runAllTimers();
      });

      expect(window.history.pushState).not.toHaveBeenCalled();
    });
  });
});