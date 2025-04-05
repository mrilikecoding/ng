import { CATEGORIES } from '../index.js';

/**
 * Skills command - Displays technical skills
 */
const skillsCommand = {
  metadata: {
    name: 'skills',
    description: 'List my technical skills',
    usage: 'skills',
    category: CATEGORIES.CONTENT,
    aliases: ['technologies', 'tech'],
  },
  
  /**
   * Execute the skills command
   * @returns {string} List of technical skills
   */
  execute() {
    return `Technical Skills:
• Languages: JavaScript, Python, Go, HTML/CSS
• Frontend: React, Vue, TailwindCSS
• Backend: Node.js, Express, Django
• Tools: Git, Docker, AWS, Linux`;
  }
};

export default skillsCommand;