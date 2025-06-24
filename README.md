# nate.green Terminal Portfolio

A modern terminal-style portfolio website built with React and Vite.

## 🚀 Live Site

Visit the live site at [nate.green](https://nate.green)

## 🎯 What is this?

This is a web-based terminal emulator that presents my portfolio in an interactive command-line interface. Users can type commands to navigate through different sections and learn about my background, skills, and projects.

## 💻 Available Commands

- `help` - Show all available commands
- `about` - Learn about me
- `skills` - View my technical skills
- `projects` - See my recent projects
- `contact` - Get my contact information
- `sitemap` - Show site structure and navigation
- `theme` - Toggle between dark/light themes
- `fullscreen` - Enter/exit fullscreen mode
- `clear` - Clear the terminal

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Vitest** - Testing framework
- **ESLint** - Code linting
- **CSS3** - Custom styling with CSS variables
- **GitHub Actions** - CI/CD pipeline

## 🏗️ Development

### Prerequisites
- Node.js 18+ 
- npm

### Getting Started

```bash
# Clone the repository
git clone https://github.com/your-username/ng.git
cd ng

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests once
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
```

## 🧪 Testing

The project includes comprehensive tests covering:
- Command registry and loading
- Command execution
- Terminal component behavior
- Theme context functionality
- Error handling and edge cases

Run tests with coverage:
```bash
npm run test:coverage
```

## 📁 Project Structure

```
src/
├── commands/           # Terminal command implementations
│   ├── core/          # Core commands (help, clear, theme, etc.)
│   ├── content/       # Content commands (about, skills, etc.)
│   └── index.js       # Command registry and loading
├── components/        # React components
│   └── Terminal/      # Terminal UI components
├── contexts/          # React contexts (theme)
└── test/             # Test setup
```

## 🎨 Features

### Terminal Experience
- **Command execution** - Type commands to navigate
- **Command history** - Navigate previous commands with ↑/↓ arrow keys
- **Tab completion** - Press Tab to auto-complete command names
- **Clickable commands** - Click on command names in output
- **Smart suggestions** - Shows possible completions for partial commands

### Responsive Design
- **Mobile optimized** - Touch-friendly interface
- **Fixed terminal width** - Consistent layout across sections
- **Smooth animations** - Transitions between fullscreen modes

### Theming
- **Dark/light themes** - Toggle with `theme` command
- **System preference** - Respects user's OS theme
- **Persistent settings** - Theme choice saved to localStorage

### Performance
- **Dynamic imports** - Commands loaded on demand
- **Optimized builds** - Vite bundling and optimization
- **Fast loading** - Minimal initial bundle size

## 🚀 Deployment

The site deploys automatically via GitHub Actions:
- **On push to main** - Builds and deploys to GitHub Pages
- **Custom domain** - Configured for nate.green
- **CI/CD pipeline** - Automated testing and deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Run linting (`npm run lint`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Connect

- **Website**: [nate.green](https://nate.green)
- **GitHub**: Use the `contact` command for links
- **Email**: Available via the `contact` command

---

*Built with ❤️ and beer*
