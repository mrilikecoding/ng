
function TerminalHeader({ isFullscreen, toggleFullscreen, theme, toggleTheme }) {
  return (
    <div className="header">
      <h1 className="domain">nate.green</h1>
      <div className="header-info">
        v1.0.3
        <button 
          className="theme-toggle" 
          onClick={toggleTheme} 
          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <button 
          className="fullscreen-toggle" 
          onClick={toggleFullscreen} 
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? '⊠' : '⊞'}
        </button>
      </div>
    </div>
  );
}

export default TerminalHeader;
