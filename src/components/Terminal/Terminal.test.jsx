import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import Terminal from './Terminal';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { commands } from '../../utils/commands';

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

// Mock commands
vi.mock('../../utils/commands', () => ({
  commands: {
    help: vi.fn(() => 'mock help output'),
    banner: vi.fn(() => 'mock banner'),
    clear: vi.fn(() => 'CLEAR_COMMAND'),
    about: vi.fn(() => 'mock about output'),
    fullscreen: vi.fn(() => 'mock fullscreen output'),
    theme: vi.fn(() => 'mock theme output')
  }
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

  it('renders terminal with banner on load', () => {
    renderTerminal();
    expect(commands.banner).toHaveBeenCalled();
    
    // Find text in the console line elements
    const consoleElement = screen.getByRole('textbox').closest('.container').querySelector('.console');
    expect(within(consoleElement).getByText('mock')).toBeInTheDocument();
    expect(within(consoleElement).getByText('banner')).toBeInTheDocument();
  });

  it('processes user input when enter is pressed', () => {
    renderTerminal();
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'help' }});
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(commands.help).toHaveBeenCalled();
    
    // Run timers to handle the status update
    vi.runAllTimers();
    
    // Use the more flexible matching because the output might be split across elements
    const consoleElement = input.closest('.container').querySelector('.console');
    
    // Use getAllByText and check that at least one result exists
    const helpTextElements = within(consoleElement).getAllByText((content, element) => {
      return element.textContent.includes('mock help output') ||
             element.textContent.includes('mock help') && element.textContent.includes('output');
    });
    expect(helpTextElements.length).toBeGreaterThan(0);
    expect(input.value).toBe('');
  });

  it('clears the console when clear command is executed', () => {
    renderTerminal();
    
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
    
    expect(commands.clear).toHaveBeenCalled();
    
    const consoleElement = input.closest('.container').querySelector('.console');
    expect(within(consoleElement).queryByText('mock help output')).not.toBeInTheDocument();
  });

  it('handles clickable commands', () => {
    renderTerminal();
    
    // Find command span element
    const consoleElement = screen.getByRole('textbox').closest('.container').querySelector('.console');
    const commandSpan = within(consoleElement).getByText('banner');
    
    // Simulate clicking on it
    fireEvent.click(commandSpan);
    
    // Run timers
    vi.runAllTimers();
    
    // This should trigger the command execution
    expect(commands.banner).toHaveBeenCalledTimes(2); // Once for initial banner, once for click
  });
});