import { createRoot } from 'react-dom/client';

import App from './components/App';
import './fonts';

// Import reorganized CSS files
import './styles/base.css';
import './styles/components/carousel.css';
import './styles/components/dark-mode-toggle.css';
import './styles/components/font-cache.css';
import './styles/components/font-import.css';
import './styles/components/import-form.css';
import './styles/components/preview.css';
import './styles/components/time-customizer.css';
import './styles/components/toast.css';

const container = document.getElementById('app');
if (container) {
  createRoot(container).render(<App />);
}
