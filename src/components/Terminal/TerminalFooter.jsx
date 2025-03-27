import React from 'react';

function TerminalFooter({ status }) {
  return (
    <div className="footer">
      <div className="footer-links">
        <a href="mailto:hello@nate.green">hello@nate.green</a> |
        <a href="https://github.com/username" target="_blank" rel="noreferrer">github</a>
      </div>
      <div className="status">{status}</div>
    </div>
  );
}

export default TerminalFooter;
