import { CATEGORIES } from '../index.js';

/**
 * Theme command - Toggles between light and dark mode
 */
const themeCommand = {
  metadata: {
    name: 'theme',
    description: 'Toggle between light and dark mode',
    usage: 'theme',
    category: CATEGORIES.CORE,
    aliases: ['darkmode', 'lightmode'],
  },
  
  /**
   * Execute the theme command
   * @param {Array} args - Command arguments
   * @param {Object} context - Terminal context
   * @returns {string} Success message
   */
  execute(args, { toggleTheme, theme }) {
    if (!toggleTheme) {
      return 'Error: Theme toggle function not available';
    }
    
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTimeout(() => toggleTheme(), 100);
    return `Switching to ${newTheme} mode...`;
  }
};

export default themeCommand;