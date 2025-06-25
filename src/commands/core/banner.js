import { CATEGORIES } from '../index.js';
import packageJson from '../../../package.json';

/**
 * Banner command - Displays the welcome banner
 */
const bannerCommand = {
  metadata: {
    name: 'banner',
    description: 'Display welcome banner',
    usage: 'banner',
    category: CATEGORIES.CORE,
    aliases: ['welcome', 'intro'],
  },
  
  /**
   * Execute the banner command
   * @param {Array} args - Command arguments (not used for this command)
   * @returns {string} The banner text
   */
  execute() {
    return `
_   _       _         _____
| \\ | |     | |       / ____|
|  \\| | __ _| |_ ___ | |  __ _ __ ___  ___ _ __
| . \` |/ _\` | __/ _ \\| | |_ | '__/ _ \\/ _ \\ '_ \\
| |\\  | (_| | ||  __/| |__| | | |  __/  __/ | | |
|_| \\_|\\__,_|\\__\\___| \\_____|_|  \\___|\\__|_| |_|

Welcome to nate.green interactive terminal [Version ${packageJson.version}]

Available commands:
<cmd>about</cmd> - Display information about me
<cmd>contact</cmd> - Get in touch
<cmd>projects</cmd> - Show my portfolio
<cmd>skills</cmd> - List my technical skills

Type '<cmd>help</cmd>' for all commands.`;
  }
};

export default bannerCommand;