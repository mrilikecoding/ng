import { CATEGORIES, getAllCommands } from '../index.js';

/**
 * Help command - Displays available commands
 */
const helpCommand = {
  metadata: {
    name: 'help',
    description: 'Display available commands',
    usage: 'help [command]',
    category: CATEGORIES.CORE,
    aliases: ['?', 'commands'],
  },
  
  /**
   * Execute the help command
   * @param {Array} args - Command arguments
   * @returns {string} List of available commands or detailed help for a specific command
   */
  execute(args = []) {
    const commands = getAllCommands();
    
    // If a command is specified, show detailed help for that command
    if (args.length > 0) {
      const commandName = args[0].toLowerCase();
      const command = commands[commandName];
      
      if (!command) {
        return `Command '${commandName}' not found. Type 'help' for a list of available commands.`;
      }
      
      const { metadata } = command;
      return `
Help: ${metadata.name}
${'='.repeat(metadata.name.length + 6)}
Description: ${metadata.description}
Usage: ${metadata.usage}
Category: ${metadata.category}
Aliases: ${metadata.aliases.join(', ') || 'None'}
`;
    }
    
    // Otherwise, show a list of all commands grouped by category
    let output = 'Available commands:\n';
    
    // Group commands by category
    const categorizedCommands = {};
    
    Object.entries(commands).forEach(([name, command]) => {
      const category = command.metadata.category;
      if (!categorizedCommands[category]) {
        categorizedCommands[category] = [];
      }
      categorizedCommands[category].push(name);
    });
    
    // Display commands by category
    Object.entries(categorizedCommands).forEach(([category, commandNames]) => {
      output += `\n${category.charAt(0).toUpperCase() + category.slice(1)}:\n`;
      
      commandNames.sort().forEach(name => {
        const command = commands[name];
        // Add special markers to indicate this is a clickable command
        output += `<cmd>${name}</cmd> - ${command.metadata.description}\n`;
      });
    });
    
    output += '\nType \'<cmd>help</cmd> [command]\' for more information about a specific command.';
    return output;
  }
};

export default helpCommand;