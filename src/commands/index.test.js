import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  CATEGORIES, 
  registerCommand, 
  getCommand, 
  getAllCommands, 
  getCommandsByCategory,
  executeCommand
} from './index';

describe('Command Registry', () => {
  beforeEach(() => {
    // Clear all registered commands between tests
    vi.restoreAllMocks();
    
    // Mock implementation to reset the registry
    const commands = getAllCommands();
    Object.keys(commands).forEach(cmd => {
      delete commands[cmd];
    });
  });

  it('registers and retrieves commands', () => {
    const mockCommand = {
      metadata: {
        name: 'test',
        description: 'Test command',
        category: CATEGORIES.CORE,
      },
      execute: vi.fn().mockReturnValue('Test executed')
    };

    registerCommand('test', mockCommand);
    
    expect(getCommand('test')).toBe(mockCommand);
    expect(getAllCommands()).toHaveProperty('test');
  });

  it('filters commands by category', () => {
    const coreCommand = {
      metadata: {
        name: 'core-cmd',
        description: 'Core command',
        category: CATEGORIES.CORE,
      },
      execute: vi.fn()
    };
    
    const contentCommand = {
      metadata: {
        name: 'content-cmd',
        description: 'Content command',
        category: CATEGORIES.CONTENT,
      },
      execute: vi.fn()
    };

    registerCommand('core-cmd', coreCommand);
    registerCommand('content-cmd', contentCommand);
    
    const coreCommands = getCommandsByCategory(CATEGORIES.CORE);
    const contentCommands = getCommandsByCategory(CATEGORIES.CONTENT);
    
    expect(Object.keys(coreCommands)).toContain('core-cmd');
    expect(Object.keys(coreCommands)).not.toContain('content-cmd');
    
    expect(Object.keys(contentCommands)).toContain('content-cmd');
    expect(Object.keys(contentCommands)).not.toContain('core-cmd');
  });

  it('executes commands with proper context', () => {
    const mockExecute = vi.fn().mockReturnValue('Command executed');
    const mockCommand = {
      metadata: { name: 'test', category: CATEGORIES.CORE },
      execute: mockExecute
    };

    registerCommand('test', mockCommand);
    
    const context = { theme: 'dark' };
    const result = executeCommand('test', ['arg1', 'arg2'], context);
    
    expect(result).toBe('Command executed');
    expect(mockExecute).toHaveBeenCalledWith(['arg1', 'arg2'], context);
  });

  it('returns an error message for unknown commands', () => {
    const result = executeCommand('nonexistent');
    expect(result).toContain('Command not found');
  });

  it('handles errors during command execution', () => {
    const mockCommand = {
      metadata: { name: 'error-cmd', category: CATEGORIES.CORE },
      execute: vi.fn().mockImplementation(() => {
        throw new Error('Command failed');
      })
    };

    registerCommand('error-cmd', mockCommand);
    
    const result = executeCommand('error-cmd');
    expect(result).toContain('Error executing command');
  });
});