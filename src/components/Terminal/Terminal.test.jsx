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
    
    expect(commandSystem.executeCommand).toHaveBeenCalledWith('banner');
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
});