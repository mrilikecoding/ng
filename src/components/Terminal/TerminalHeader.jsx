
import packageJson from '../../../package.json';

function TerminalHeader({ isFullscreen, toggleFullscreen, theme, toggleTheme, onHeaderClick }) {
  const handleHeaderClick = (e) => {
    e.stopPropagation();
    if (onHeaderClick) {
      onHeaderClick('banner');
    }
  };

  return (
    <div className="header">
      <h1 
        className="domain" 
        onClick={handleHeaderClick}
        style={{ cursor: 'pointer' }}
        title="Click to show banner"
      >
        nate.green
      </h1>
      <div className="header-info">
        v{packageJson.version}
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
