import { CATEGORIES } from '../index.js';

/**
 * Clear command - Clears the terminal console
 */
const clearCommand = {
  metadata: {
    name: 'clear',
    description: 'Clear the console',
    usage: 'clear',
    category: CATEGORIES.CORE,
    aliases: ['cls'],
  },
  
  /**
   * Execute the clear command
   * @returns {string} Special marker for terminal to clear screen
   */
  execute() {
    return 'CLEAR_COMMAND';
  }
};

export default clearCommand;