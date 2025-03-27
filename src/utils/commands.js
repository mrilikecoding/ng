// Available commands
export const commands = {
  help: function() {
    return `Available commands:
about       - Display information about me
skills      - List my technical skills
projects    - Show my portfolio
contact     - Show contact information
clear       - Clear the console
banner      - Display welcome banner
fullscreen  - Toggle fullscreen mode (or press F11)
theme       - Toggle between light and dark mode`;
  },
  fullscreen: function(args, { toggleFullscreen }) {
    setTimeout(() => toggleFullscreen(), 100);
    return 'Toggling fullscreen mode...';
  },
  theme: function(args, { toggleTheme, theme }) {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTimeout(() => toggleTheme(), 100);
    return `Switching to ${newTheme} mode...`;
  },
  about: function() {
    return `Nate Green - Developer, explorer, and creator.
Passionate about clean code, elegant design, and building useful things.
Based in [Your Location].

Currently focusing on web development and creative coding projects.`;
  },
  skills: function() {
    return `Technical Skills:
• Languages: JavaScript, Python, Go, HTML/CSS
• Frontend: React, Vue, TailwindCSS
• Backend: Node.js, Express, Django
• Tools: Git, Docker, AWS, Linux`;
  },
  projects: function() {
    return `Portfolio Projects:

1. Project Name
   Description: A web application that does something cool.
   Technologies: React, Node.js, MongoDB

2. Another Project
   Description: Mobile app for tracking something interesting.
   Technologies: React Native, Firebase`;
  },
  contact: function() {
    return `Contact Information:
• Email: hello@nate.green
• GitHub: github.com/username
• Twitter: @nategreen`;
  },
  clear: function() {
    // This will be handled in the Terminal component
    return 'CLEAR_COMMAND';
  },
  banner: function() {
    return `
_   _       _         _____
| \\ | |     | |       / ____|
|  \\| | __ _| |_ ___ | |  __ _ __ ___  ___ _ __
| . \` |/ _\` | __/ _ \\| | |_ | '__/ _ \\/ _ \\ '_ \\
| |\\  | (_| | ||  __/| |__| | | |  __/  __/ | | |
|_| \\_|\\__,_|\\__\\___| \\_____|_|  \\___|\\__|_| |_|

Welcome to nate.green interactive terminal [Version 1.0.3]
Type 'help' for available commands.`;
  }
};
