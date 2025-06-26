function TerminalFooter({ status, vimMode }) {
  return (
    <div className="footer">
      <div className="footer-links">
        <a href="mailto:contact@nate.green">contact@nate.green</a> |
        <a
          href="https://github.com/mrilikecoding"
          target="_blank"
          rel="noreferrer"
        >
          github
        </a>
      </div>
      <div className="footer-right">
        <div className={`vim-mode vim-mode-${vimMode.toLowerCase()}`}>
          {vimMode}
        </div>
        <div className="status">{status}</div>
      </div>
    </div>
  );
}

export default TerminalFooter;
