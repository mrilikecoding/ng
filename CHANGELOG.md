# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2025-01-26

### Added
- **Umami Analytics Integration**
  - Added production-only analytics tracking
  - Environment variable support for `VITE_UMAMI_WEBSITE_ID`
  - Configured GitHub Actions workflow to pass analytics variables
  
- **Vim Mode Support**
  - Added INSERT/NORMAL mode switching with visual indicators
  - Vim-style navigation with `hjkl` keys for scrolling in NORMAL mode
  - Mode command (`mode`, `vim`, `m` aliases) for toggling between modes
  - Global key listener for `i` key to switch to INSERT mode
  - Click input field to switch to INSERT mode
  - Silent mode switching (no console output)
  
- **URL Routing for Analytics**
  - Dynamic URL updates for content commands (`/about`, `/contact`, `/projects`, `/skills`)
  - Browser back/forward navigation support
  - Initial page load routing based on URL
  - Home page routing for banner commands (`/`)
  - URL tracking for improved analytics insights
  
- **Command Alias System**
  - Enhanced command registry to support aliases
  - Added `home` and `h` aliases for banner command
  - All existing command aliases now functional
  
- **Footer Copyright Notice**
  - Added `© 2025 Nate Green` to footer
  - Clean spacing without pipe separators
  - Subtle styling that matches terminal aesthetic

### Enhanced
- **Banner Command Improvements**
  - Added rainbow animation to ASCII art with CSS keyframes
  - Enhanced command descriptions with more personality
  - Integrated available commands display on page load
  
- **Terminal UI Polish**
  - Improved footer layout with flexbox and consistent spacing
  - Enhanced mode indicator styling (green for INSERT, orange for NORMAL)
  - Better visual hierarchy and spacing

### Added Tests
- **Comprehensive Vim Mode Testing**
  - Mode switching functionality
  - Navigation key handling
  - Silent command execution
  - Click-to-INSERT behavior
  - Command history preservation
  
- **URL Routing Test Suite**
  - URL updates for content commands
  - Browser navigation handling
  - Initial page load routing
  - Clickable command integration
  - Alias support verification

### Technical Improvements
- **Code Quality**
  - Fixed all ESLint warnings and errors
  - Added proper React hooks dependencies
  - Implemented useCallback optimization for performance
  - Resolved circular dependency issues
  
- **Build Process**
  - Production analytics integration
  - Environment variable configuration
  - GitHub Actions workflow updates

### Legal & Licensing
- **Open Source Licensing**
  - Added MIT License with clear scope definition
  - Created comprehensive README licensing section
  - Established framework vs. content licensing boundaries
  - Updated copyright year to 2025

### Documentation
- **Enhanced README**
  - Added licensing scope clarification
  - Updated feature descriptions
  - Improved contribution guidelines
  - Added analytics and vim mode documentation

---

## Development Stats for v0.1.1
- **50 total tests** (all passing)
- **18 new tests added** (Vim mode + URL routing)
- **0 ESLint warnings/errors**
- **5 major features implemented**
- **100% backward compatibility maintained**

## What's Next
- Enhanced command system
- Additional vim-style navigation features
- Extended analytics integration
- Performance optimizations