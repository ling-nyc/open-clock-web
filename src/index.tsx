import { createRoot } from 'react-dom/client';

import App from './components/App';
import './fonts';

// Import all CSS files directly
import './styles/style.css';
import './styles/components/time-customizer.css';
import './styles/components/preview.css';
import './styles/components/sample-dropdown.css';
import './styles/components/toast.css';
import './styles/components/font-cache.css';
import './styles/components/dark-mode-toggle.css';
import './styles/components/json-form.css';
import './styles/components/mobile-time-toggle.css';
import './styles/components/modal.css';

const container = document.getElementById('app');
if (container) {
  createRoot(container).render(<App />);
}
