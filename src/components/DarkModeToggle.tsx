import { useState, useEffect } from 'react';

const SunIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);
const MoonIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
  </svg>
);

const DarkModeToggle = () => {
  // Dark mode state (default: true)
  const [darkMode, setDarkMode] = useState(true);

  // Ensure dark mode is default on mount
  useEffect(() => {
    document.body.classList.add('dark');
  }, []);

  // Toggle dark mode and update body class
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      document.body.classList.toggle('dark', next);
      return next;
    });
  };

  return (
    <button
      className="dark-mode-toggle"
      onClick={toggleDarkMode}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? <SunIcon /> : <MoonIcon />}
    </button>
  );
};

export default DarkModeToggle;
