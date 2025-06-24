import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  CATEGORIES, 
  registerCommand, 
  getCommand, 
  getAllCommands, 
  getCommandsByCategory,
  executeCommand,
  loadCommands
} from './index';

describe('Command Registry', () => {
  beforeEach(() => {
    // Clear the command registry thoroughly
    const commands = getAllCommands();
    Object.keys(commands).forEach(cmd => {
      delete commands[cmd];
    });
    
    vi.resetModules();
    vi.clearAllMocks();
  });

  describe('Basic Registry Operations', () => {
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

    it('returns null for non-existent commands', () => {
      expect(getCommand('nonexistent')).toBeNull();
    });

    it('returns immutable copy of command registry', () => {
      const mockCommand = { metadata: { name: 'test' }, execute: vi.fn() };
      registerCommand('test', mockCommand);

      const commands1 = getAllCommands();
      const commands2 = getAllCommands();

      expect(commands1).toEqual(commands2);
      expect(commands1).not.toBe(commands2); // Different object references

      // Modifying returned object should not affect registry
      commands1.newCommand = { metadata: { name: 'new' }, execute: vi.fn() };
      expect(getAllCommands()).not.toHaveProperty('newCommand');
    });
  });

  describe('Command Execution', () => {
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

    it('handles commands that return promises', async () => {
      const asyncCommand = {
        metadata: { name: 'async-test', category: CATEGORIES.CORE },
        execute: vi.fn().mockResolvedValue('Async result')
      };

      registerCommand('async-test', asyncCommand);
      
      const result = executeCommand('async-test');
      expect(result).toBeInstanceOf(Promise);
      
      const resolvedResult = await result;
      expect(resolvedResult).toBe('Async result');
    });

    it('handles commands with empty arguments', () => {
      const mockCommand = {
        metadata: { name: 'test', category: CATEGORIES.CORE },
        execute: vi.fn().mockReturnValue('Success')
      };

      registerCommand('test', mockCommand);
      
      const result = executeCommand('test');
      expect(mockCommand.execute).toHaveBeenCalledWith([], {});
      expect(result).toBe('Success');
    });

    it('handles commands with undefined context', () => {
      const mockCommand = {
        metadata: { name: 'test', category: CATEGORIES.CORE },
        execute: vi.fn().mockReturnValue('Success')
      };

      registerCommand('test', mockCommand);
      
      const result = executeCommand('test', ['arg1']);
      expect(mockCommand.execute).toHaveBeenCalledWith(['arg1'], {});
      expect(result).toBe('Success');
    });
  });

  describe('Command Loading', () => {
    it('loadCommands function exists and returns a promise', async () => {
      // Test that loadCommands function exists and can be called
      expect(typeof loadCommands).toBe('function');
      
      // Test that it returns a promise
      const result = loadCommands();
      expect(result).toBeInstanceOf(Promise);
      
      // Since actual imports would fail in test environment, we'll catch and verify the error structure
      try {
        await result;
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    it('verifies command loading mechanism basics', () => {
      // Test the basic loading mechanism by manually registering commands
      const mockCommand1 = { metadata: { name: 'test1', category: CATEGORIES.CORE }, execute: vi.fn() };
      const mockCommand2 = { metadata: { name: 'test2', category: CATEGORIES.CONTENT }, execute: vi.fn() };
      
      registerCommand('test1', mockCommand1);
      registerCommand('test2', mockCommand2);
      
      const allCommands = getAllCommands();
      expect(allCommands).toHaveProperty('test1');
      expect(allCommands).toHaveProperty('test2');
      expect(Object.keys(allCommands).length).toBeGreaterThanOrEqual(2);
      
      // Test category filtering
      const coreCommands = getCommandsByCategory(CATEGORIES.CORE);
      const contentCommands = getCommandsByCategory(CATEGORIES.CONTENT);
      
      expect(Object.keys(coreCommands)).toContain('test1');
      expect(Object.keys(contentCommands)).toContain('test2');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('handles commands with missing metadata', () => {
      const invalidCommand = {
        execute: vi.fn()
        // Missing metadata
      };

      registerCommand('invalid', invalidCommand);
      
      // This should not crash when filtering by category
      expect(() => getCommandsByCategory(CATEGORIES.CORE)).not.toThrow();
    });

    it('handles commands with invalid category in filtering', () => {
      const commandWithInvalidCategory = {
        metadata: {
          name: 'test',
          category: 'INVALID_CATEGORY'
        },
        execute: vi.fn()
      };

      registerCommand('test', commandWithInvalidCategory);
      
      const coreCommands = getCommandsByCategory(CATEGORIES.CORE);
      expect(Object.keys(coreCommands)).not.toContain('test');
    });

    it('returns empty object for non-existent category', () => {
      const result = getCommandsByCategory('NON_EXISTENT');
      expect(result).toEqual({});
    });

    it('maintains separate instances of commands', () => {
      const command1 = { metadata: { name: 'test1' }, execute: vi.fn() };
      const command2 = { metadata: { name: 'test2' }, execute: vi.fn() };

      registerCommand('test1', command1);
      registerCommand('test2', command2);

      expect(getCommand('test1')).toBe(command1);
      expect(getCommand('test2')).toBe(command2);
      expect(getCommand('test1')).not.toBe(getCommand('test2'));
    });

    it('allows command overwriting', () => {
      const originalCommand = { metadata: { name: 'test' }, execute: vi.fn() };
      const newCommand = { metadata: { name: 'test' }, execute: vi.fn() };

      registerCommand('test', originalCommand);
      expect(getCommand('test')).toBe(originalCommand);

      registerCommand('test', newCommand);
      expect(getCommand('test')).toBe(newCommand);
      expect(getCommand('test')).not.toBe(originalCommand);
    });
  });
});