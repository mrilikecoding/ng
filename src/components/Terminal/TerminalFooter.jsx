function TerminalFooter({ status }) {
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
      <div className="status">{status}</div>
    </div>
  );
}

export default TerminalFooter;
