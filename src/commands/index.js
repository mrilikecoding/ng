/**
 * Command Registry
 * 
 * This file serves as the central registry for all terminal commands.
 * Commands are organized into categories and loaded dynamically.
 */

// Define command categories
export const CATEGORIES = {
  CORE: 'core',
  CONTENT: 'content',
  SYSTEM: 'system',
  UTIL: 'utility'
};

// Command registry - will be populated dynamically
const commandRegistry = {};

/**
 * Register a command module
 * @param {string} name - Command name (how it will be invoked)
 * @param {Object} commandModule - The command module object
 */
export function registerCommand(name, commandModule) {
  commandRegistry[name] = commandModule;
}

/**
 * Get a command by name
 * @param {string} name - Command name
 * @returns {Object|null} - Command module or null if not found
 */
export function getCommand(name) {
  return commandRegistry[name] || null;
}

/**
 * Get all registered commands
 * @returns {Object} - Map of all registered commands
 */
export function getAllCommands() {
  return { ...commandRegistry };
}

/**
 * Get commands by category
 * @param {string} category - Category name
 * @returns {Object} - Map of commands in the requested category
 */
export function getCommandsByCategory(category) {
  return Object.entries(commandRegistry)
    .filter(([, cmd]) => cmd.metadata.category === category)
    .reduce((acc, [name, cmd]) => {
      acc[name] = cmd;
      return acc;
    }, {});
}

/**
 * Dynamically import and register commands
 * This is the main function to load all command modules
 */
export async function loadCommands() {
  try {
    // Load core commands
    const bannerModule = await import('./core/banner.js');
    registerCommand('banner', bannerModule.default);
    
    const clearModule = await import('./core/clear.js');
    registerCommand('clear', clearModule.default);
    
    const fullscreenModule = await import('./core/fullscreen.js');
    registerCommand('fullscreen', fullscreenModule.default);
    
    const themeModule = await import('./core/theme.js');
    registerCommand('theme', themeModule.default);
    
    // Load content commands
    const aboutModule = await import('./content/about.js');
    registerCommand('about', aboutModule.default);
    
    const skillsModule = await import('./content/skills.js');
    registerCommand('skills', skillsModule.default);
    
    const projectsModule = await import('./content/projects.js');
    registerCommand('projects', projectsModule.default);
    
    const contactModule = await import('./content/contact.js');
    registerCommand('contact', contactModule.default);
    
    // Add help command which depends on other commands being registered
    const helpModule = await import('./core/help.js');
    registerCommand('help', helpModule.default);
    
    console.log('Commands loaded successfully');
    return commandRegistry;
  } catch (error) {
    console.error('Error loading commands:', error);
    throw error;
  }
}

/**
 * Execute a command
 * @param {string} commandName - Name of the command to execute
 * @param {Array} args - Arguments to pass to the command
 * @param {Object} context - Context object with terminal state and methods
 * @returns {string|Promise<string>} - Command output
 */
export function executeCommand(commandName, args = [], context = {}) {
  const command = getCommand(commandName);
  if (!command) {
    return `Command not found: ${commandName}`;
  }
  
  try {
    return command.execute(args, context);
  } catch (error) {
    console.error(`Error executing command ${commandName}:`, error);
    return `Error executing command: ${error.message}`;
  }
}