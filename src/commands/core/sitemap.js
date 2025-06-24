import { CATEGORIES } from "../index.js";

/**
 * Sitemap command - Shows the structure and available commands
 */
const sitemapCommand = {
  metadata: {
    name: "sitemap",
    description: "Show site structure and available commands",
    usage: "sitemap",
    category: CATEGORIES.CORE,
    aliases: ["map", "structure"],
  },

  /**
   * Execute the sitemap command
   * @returns {string} Site structure and command overview
   */
  execute() {
    return `Site Structure & Commands

Core Navigation:
├── <cmd>about</cmd>      Learn about me and my background
├── <cmd>skills</cmd>     Technical skills and expertise  
├── <cmd>projects</cmd>   Recent work and projects
└── <cmd>contact</cmd>    Get in touch

Terminal Commands:
├── <cmd>help</cmd>       Show all available commands
├── <cmd>sitemap</cmd>    Show this site structure (you are here)
├── <cmd>clear</cmd>      Clear the terminal screen
├── <cmd>theme</cmd>      Toggle dark/light theme
└── <cmd>fullscreen</cmd> Enter/exit fullscreen mode

Navigation Tips:
• Click any <cmd>command</cmd> name to execute it
• Type commands manually for the full experience
• Use 'help' to see detailed command descriptions

Site Map:
nate.green/
├── Terminal Interface
├── About Section
├── Skills Overview  
├── Project Portfolio
└── Contact Information`;
  },
};

export default sitemapCommand;