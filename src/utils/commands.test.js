import { describe, it, expect, vi, beforeEach } from 'vitest';
import { commands } from './commands';

// Setup fake timers
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Command Utils', () => {
  it('help command returns all available commands', () => {
    const result = commands.help();
    expect(result).toContain('Available commands:');
    // We don't specifically check for "help" since it's not in the actual string,
    // but we check for the command names that are actually in the output
    expect(result).toContain('about');
    expect(result).toContain('skills');
    expect(result).toContain('projects');
    expect(result).toContain('contact');
    expect(result).toContain('clear');
    expect(result).toContain('fullscreen');
    expect(result).toContain('theme');
  });

  it('about command returns information', () => {
    const result = commands.about();
    expect(result).toContain('Nate Green');
    expect(result).toContain('Developer');
  });

  it('skills command returns skills list', () => {
    const result = commands.skills();
    expect(result).toContain('Technical Skills:');
    expect(result).toContain('JavaScript');
  });

  it('projects command returns project information', () => {
    const result = commands.projects();
    expect(result).toContain('Portfolio Projects:');
  });

  it('contact command returns contact information', () => {
    const result = commands.contact();
    expect(result).toContain('Contact Information:');
    expect(result).toContain('Email:');
  });

  it('clear command returns special clear command string', () => {
    const result = commands.clear();
    expect(result).toBe('CLEAR_COMMAND');
  });

  it('banner command returns welcome banner', () => {
    const result = commands.banner();
    // The banner doesn't actually contain "Nate Green" text, it contains the ASCII art
    expect(result).toContain('nate.green');
    expect(result).toContain('Welcome');
  });

  it('fullscreen command toggles fullscreen', () => {
    const toggleFullscreen = vi.fn();
    const result = commands.fullscreen([], { toggleFullscreen });
    
    expect(result).toContain('Toggling fullscreen mode');
    
    // Wait for the setTimeout to execute
    vi.runAllTimers();
    expect(toggleFullscreen).toHaveBeenCalled();
  });

  it('theme command toggles theme', () => {
    const toggleTheme = vi.fn();
    const result = commands.theme([], { toggleTheme, theme: 'dark' });
    
    expect(result).toContain('Switching to light mode');
    
    // Wait for the setTimeout to execute
    vi.runAllTimers();
    expect(toggleTheme).toHaveBeenCalled();
  });
});