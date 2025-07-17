import { createRoot } from 'react-dom/client';

import App from './components/App';
import './fonts';

// Import clean CSS
import './components/clean-style.css';

const container = document.getElementById('app');
if (container) {
  createRoot(container).render(<App />);
}
