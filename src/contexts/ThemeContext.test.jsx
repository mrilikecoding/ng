import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeContext';

// Mock localStorage and window.matchMedia
beforeEach(() => {
  // Mock localStorage
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn()
  };
  global.localStorage = localStorageMock;
  
  // Mock matchMedia with default to dark mode
  global.window.matchMedia = vi.fn().mockImplementation(query => {
    return {
      matches: true, // Always prefer dark
      media: query
    };
  });
  
  // Mock document methods
  document.documentElement.setAttribute = vi.fn();
});

// Create a test component that uses the theme context
const TestComponent = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <div data-testid="theme-value">{theme}</div>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

describe('ThemeContext', () => {
  it('provides default theme as dark when no saved preference exists', () => {
    localStorage.getItem.mockReturnValue(null);
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('theme-value').textContent).toBe('dark');
  });
  
  it('toggles theme when toggleTheme is called', () => {
    localStorage.getItem.mockReturnValue('dark');
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    // Initial theme should be dark
    expect(screen.getByTestId('theme-value').textContent).toBe('dark');
    
    // Click the toggle button
    fireEvent.click(screen.getByText('Toggle Theme'));
    
    // Theme should now be light
    expect(screen.getByTestId('theme-value').textContent).toBe('light');
    
    // Click again to toggle back to dark
    fireEvent.click(screen.getByText('Toggle Theme'));
    expect(screen.getByTestId('theme-value').textContent).toBe('dark');
  });
});