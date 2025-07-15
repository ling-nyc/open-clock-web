import { createRoot } from 'react-dom/client';

import App from './components/App';
import './fonts';

const container = document.getElementById('app');
if (container) {
  createRoot(container).render(<App />);
}
