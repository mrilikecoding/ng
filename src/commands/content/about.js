import { CATEGORIES } from '../index.js';

/**
 * About command - Displays information about the developer
 */
const aboutCommand = {
  metadata: {
    name: 'about',
    description: 'Display information about me',
    usage: 'about',
    category: CATEGORIES.CONTENT,
    aliases: ['bio', 'profile'],
  },
  
  /**
   * Execute the about command
   * @param {Array} args - Command arguments (not used for this command)
   * @returns {string} Information about the developer
   */
  execute() {
    return `Nate Green - Developer, explorer, and creator.
Passionate about clean code, elegant design, and building useful things.
Based in [Your Location].

Currently focusing on web development and creative coding projects.`;
  }
};

export default aboutCommand;