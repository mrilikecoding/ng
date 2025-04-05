import { CATEGORIES } from "../index.js";

/**
 * Skills command - Displays technical skills
 */
const skillsCommand = {
  metadata: {
    name: "skills",
    description: "List my technical skills",
    usage: "skills",
    category: CATEGORIES.CONTENT,
    aliases: ["technologies", "tech"],
  },

  /**
   * Execute the skills command
   * @returns {string} List of technical skills
   */
  execute() {
    return `Technical Skills:

• Languages & Core: 
  - Python, JavaScript, HTML/CSS, Ruby
  - Learning Rust!
  - Data Structures & Algorithms
  - MS in Comptuer Science focused on Computational Perception and Interactive Intelligence

• Machine Learning & Computer Vision:
  - Pose Estimation 
  - Real-time Video Classification
  - Feature Engineering
  - Scikit-learn, MLflow

• Frontend:
  - React
  - Data Visualization

• Backend:
  - Flask / Django 
  - Rails

• DevOps & Tools:
  - Docker
  - Git, Version Control
  - AWS, Cloud Services
  - Linux, macOS`;
  },
};

export default skillsCommand;

