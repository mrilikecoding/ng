import Terminal from './components/Terminal/Terminal';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Terminal />
    </ThemeProvider>
  );
}

export default App;
