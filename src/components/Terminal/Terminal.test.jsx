import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
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
    return `Command not found: ${cmd}`;
  }),
  getAllCommands: vi.fn().mockReturnValue({
    help: {}, 
    banner: {}, 
    clear: {}, 
    about: {}, 
    fullscreen: {}, 
    theme: {}
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
  });

  it('loads commands on initial render', async () => {
    renderTerminal();
    expect(commandSystem.loadCommands).toHaveBeenCalled();
    
    // Advance timers to resolve the async command loading
    await vi.runAllTimersAsync();
    
    expect(commandSystem.executeCommand).toHaveBeenCalledWith('banner');
  });

  it('processes user input when enter is pressed', async () => {
    renderTerminal();
    
    // Wait for commands to load
    await vi.runAllTimersAsync();
    
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'help' }});
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(commandSystem.executeCommand).toHaveBeenCalledWith('help', [], expect.anything());
    
    // Run timers to handle the status update
    vi.runAllTimers();
    
    // Check console for output
    const consoleElement = input.closest('.container').querySelector('.console');
    const helpTextElements = within(consoleElement).getAllByText((content, element) => {
      return element.textContent.includes('mock help output');
    });
    
    expect(helpTextElements.length).toBeGreaterThan(0);
    expect(input.value).toBe('');
  });

  it('clears the console when clear command is executed', async () => {
    renderTerminal();
    
    // Wait for commands to load
    await vi.runAllTimersAsync();
    
    // First add some content
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'help' }});
    fireEvent.keyDown(input, { key: 'Enter' });
    
    // Run timers
    vi.runAllTimers();
    
    // Now clear
    fireEvent.change(input, { target: { value: 'clear' }});
    fireEvent.keyDown(input, { key: 'Enter' });
    
    // Run timers again
    vi.runAllTimers();
    
    expect(commandSystem.executeCommand).toHaveBeenCalledWith('clear', [], expect.anything());
    
    const consoleElement = input.closest('.container').querySelector('.console');
    expect(within(consoleElement).queryByText('mock help output')).not.toBeInTheDocument();
  });

  it('renders HTML output correctly', async () => {
    // Mock getAllCommands
    commandSystem.getAllCommands.mockReturnValue({
      banner: { metadata: { name: 'banner' } }
    });
    
    renderTerminal();
    
    // Wait for commands to load
    await vi.runAllTimersAsync();
    
    // Need to wait for the banner to be displayed
    vi.runAllTimers();
    
    // Simulate outputting HTML content
    const input = screen.getByRole('textbox');
    const consoleElement = input.closest('.container').querySelector('.console');
    
    // Content with HTML link
    const htmlContent = 'Check out <a href="#test">this link</a> for more info';
    commandSystem.executeCommand.mockReturnValueOnce(htmlContent);
    
    // Execute a command that outputs HTML
    fireEvent.change(input, { target: { value: 'html-test' }});
    fireEvent.keyDown(input, { key: 'Enter' });
    
    // Run timers
    vi.runAllTimers();
    
    // Verify command was executed
    expect(commandSystem.executeCommand).toHaveBeenCalledWith('html-test', [], expect.anything());
    
    // Verify console contains text from the HTML output
    const consoleText = consoleElement.textContent;
    expect(consoleText).toContain('Check out this link for more info');
  });
});