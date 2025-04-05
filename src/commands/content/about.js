import { CATEGORIES } from "../index.js";

/**
 * About command - Displays information about the developer
 */
const aboutCommand = {
  metadata: {
    name: "about",
    description: "Display information about me",
    usage: "about",
    category: CATEGORIES.CONTENT,
    aliases: ["bio", "profile"],
  },

  /**
   * Execute the about command
   * @param {Array} args - Command arguments (not used for this command)
   * @returns {string} Information about the developer
   */
  execute() {
    return `
 Hey there. Welcome here. About me: I am software engineer, researcher, musician, and theater maker.
 I'm passionate about digital and analog processes that help humans be better humans together in service to our collective well-being.
`;
  },
};

export default aboutCommand;

