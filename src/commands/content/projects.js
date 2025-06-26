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

An open-source toolkit for creating real-time pose classification applications. Built for researchers studying Parkinson's Disease patients in dance therapy settings with McCamish Foundation support. Provides complete workflow from video processing to model deployment, featuring MediaPipe pose detection, dataset annotation, and browser-based real-time classification.

Link: <a href="https://github.com/mrilikecoding/StreamPoseML/" target="_blank" rel="noopener noreferrer">github.com/mrilikecoding/StreamPoseML</a>

Technologies: Python, MediaPipe, React, Flask, MLflow, Docker

2. Eddi

An experimental platform for creating interactive, movement-responsive environmental systems. Designed to give performers direct agency over their performance environment through computer vision and movement analysis. Explores the intersection of physical theater, computer vision, and environmental design.

Link: <a href="https://github.com/mrilikecoding/eddi" target="_blank" rel="noopener noreferrer">github.com/mrilikecoding/eddi</a>

Technologies: Computer Vision, Motion Analysis, StreamPoseML, Real-time Systems

3. Terminal Portfolio Site

This interactive terminal-style portfolio website you're currently using! Features command history, tab completion, responsive design, and a complete CI/CD pipeline. Built as a modern take on the classic terminal interface with smooth animations and mobile optimization.

Link: <a href="https://github.com/mrilikecoding/ng" target="_blank" rel="noopener noreferrer">github.com/mrilikecoding/ng</a>

Technologies: React, Vite, CSS3, Vitest, GitHub Actions

4. Nyan Pytest

A delightful pytest plugin that adds a colorful nyan cat animation to test result reporting. Makes test runs more engaging with a rainbow trail that grows with test progress and supports both interactive and non-interactive terminals.

Link: <a href="https://github.com/mrilikecoding/nyan-pytest" target="_blank" rel="noopener noreferrer">github.com/mrilikecoding/nyan-pytest</a>

Technologies: Python, pytest
`;
  },
};

export default projectsCommand;

