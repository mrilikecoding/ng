import { CATEGORIES } from "../index.js";

/**
 * Projects command - Displays portfolio projects
 */
const projectsCommand = {
  metadata: {
    name: "projects",
    description: "Show my portfolio",
    usage: "projects",
    category: CATEGORIES.CONTENT,
    aliases: ["portfolio", "work"],
  },

  /**
   * Execute the projects command
   * @returns {string} Portfolio project information
   */
  execute() {
    return `
1. StreamPoseML

StreamPoseML is an open-source, end-to-end toolkit for creating realtime, video-based classification experiments that rely on using labeled data alongside captured body keypoint / pose data. 

`;
  },
};

export default projectsCommand;

