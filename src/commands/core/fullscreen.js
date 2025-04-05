import { CATEGORIES } from '../index.js';

/**
 * Fullscreen command - Toggles fullscreen mode
 */
const fullscreenCommand = {
  metadata: {
    name: 'fullscreen',
    description: 'Toggle fullscreen mode (or press F11)',
    usage: 'fullscreen',
    category: CATEGORIES.CORE,
    aliases: ['fs'],
  },
  
  /**
   * Execute the fullscreen command
   * @param {Array} args - Command arguments (not used for this command)
   * @param {Object} context - Terminal context
   * @returns {string} Success message
   */
  execute(args, { toggleFullscreen }) {
    if (!toggleFullscreen) {
      return 'Error: Fullscreen toggle function not available';
    }
    
    // Use setTimeout to ensure the UI updates after the command completes
    setTimeout(() => toggleFullscreen(), 100);
    return 'Toggling fullscreen mode...';
  }
};

export default fullscreenCommand;