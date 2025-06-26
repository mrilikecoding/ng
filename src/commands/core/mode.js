import { CATEGORIES } from '../index.js';

/**
 * Mode command - Toggle vim modes
 */
const modeCommand = {
  metadata: {
    name: 'mode',
    description: 'Toggle vim mode (INSERT/NORMAL) - hjkl to scroll in NORMAL, i to INSERT',
    usage: 'mode',
    category: CATEGORIES.CORE,
    aliases: ['vim', 'm'],
  },
  
  /**
   * Execute the mode command
   * @param {Array} args - Command arguments (not used for this command)
   * @param {Object} context - Context object with terminal state and methods
   * @returns {string} The mode toggle confirmation
   */
  execute(args = [], context = {}) {
    if (context.toggleVimMode) {
      context.toggleVimMode();
      return ''; // Silent mode switch
    }
    return 'Mode switching not available';
  }
};

export default modeCommand;