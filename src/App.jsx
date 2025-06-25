import { useEffect } from 'react';
import Terminal from './components/Terminal/Terminal';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css';

function App() {
  useEffect(() => {
    const umamiId = import.meta.env.VITE_UMAMI_WEBSITE_ID;
    const isProd = import.meta.env.PROD;

    if (isProd && umamiId) {
      const script = document.createElement('script');
      script.defer = true;
      script.src = 'https://cloud.umami.is/script.js';
      script.setAttribute('data-website-id', umamiId);
      document.head.appendChild(script);
    }
  }, []);

  return (
    <ThemeProvider>
      <Terminal />
    </ThemeProvider>
  );
}

export default App;
