import { CATEGORIES } from "../index.js";

/**
 * Contact command - Displays contact information
 */
const contactCommand = {
  metadata: {
    name: "contact",
    description: "Get in touch",
    usage: "contact",
    category: CATEGORIES.CONTENT,
    aliases: ["email"],
  },

  /**
   * Execute the contact command
   * @returns {string} Contact information
   */
  execute() {
    return `Contact Information:
• Email: <a href="mailto:contact@nate.green" target="_blank" rel="noopener noreferrer">contact@nate.green</a>
• GitHub: <a href="https://github.com/mrilikecoding" target="_blank" rel="noopener noreferrer">github.com/mrilikecoding</a>`;
  },
};

export default contactCommand;

