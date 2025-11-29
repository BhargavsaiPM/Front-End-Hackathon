import React from 'react';
import './QuickExit.css';

const QuickExit = () => {
  const handleQuickExit = () => {
    // Redirect to a neutral page (Google in this case)
    window.location.href = 'https://www.google.com';
  };

  return (
    <button 
      className="quick-exit-btn" 
      onClick={handleQuickExit}
      aria-label="Quick Exit - Leave this site immediately"
    >
      🚪 Quick Exit
    </button>
  );
};

export default QuickExit;

