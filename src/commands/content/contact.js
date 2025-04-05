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
• Email: contact@nate.green
• GitHub: github.com/mrilikecoding`;
  },
};

export default contactCommand;

