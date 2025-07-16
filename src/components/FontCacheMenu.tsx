import React, { useEffect, useState } from 'react';

interface CachedFont {
  name: string;
  type: string;
  data: string; // base64 or url
}

const FONT_CACHE_KEY = 'userFontCache';

function getCachedFonts(): CachedFont[] {
  try {
    const raw = localStorage.getItem(FONT_CACHE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function clearFontCache() {
  localStorage.removeItem(FONT_CACHE_KEY);
}

export function addFontToCache(font: CachedFont) {
  const fonts = getCachedFonts();
  const filtered = fonts.filter(f => f.name !== font.name);
  localStorage.setItem(FONT_CACHE_KEY, JSON.stringify([...filtered, font]));
}

function getCacheSize(fonts: CachedFont[]): string {
  const bytes = fonts.reduce((sum, f) => sum + (f.data.length * 3 / 4), 0);
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

const FontCacheMenu: React.FC<{ onCacheChange?: () => void }> = ({ onCacheChange }) => {
  const [fonts, setFonts] = useState<CachedFont[]>(getCachedFonts());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setFonts(getCachedFonts());
    window.addEventListener('fontcachechange', handler);
    return () => window.removeEventListener('fontcachechange', handler);
  }, []);

  // Accordion toggle
  const handleToggle = () => setOpen((o) => !o);

  const handleClear = () => {
    clearFontCache();
    setFonts([]);
    onCacheChange?.();
    window.dispatchEvent(new Event('fontcachechange'));
  };

  return (
    <div className={`font-cache-menu${open ? ' open' : ''}`}
      style={{
        position: 'fixed',
        right: 16,
        bottom: 16,
        zIndex: 1000,
        fontSize: '1em',
        color: 'var(--font-cache-color, #222)',
        background: 'none',
        border: 'none',
        minWidth: 0,
        boxShadow: 'none',
        padding: 0,
      }}
    >
      <button
        className="font-cache-toggle"
        onClick={handleToggle}
        aria-expanded={open}
        style={{
          background: 'none',
          border: 'none',
          color: 'inherit',
          fontWeight: 600,
          fontSize: '1em',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: 0,
        }}
      >
        <span style={{ display: 'inline-block', transition: 'transform 0.2s', transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>
          ▶
        </span>
        Font Cache
      </button>
      {open && (
        <div className="font-cache-list" style={{ marginTop: 6, fontWeight: 400, fontSize: '0.97em', background: 'none', border: 'none', padding: 0 }}>
          {fonts.length === 0 ? (
            <div style={{ color: '#888' }}>No user fonts</div>
          ) : (
            <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
              {fonts.map(f => (
                <li key={f.name} style={{ marginBottom: 2 }}>{f.name}</li>
              ))}
            </ul>
          )}
          <div style={{ color: '#888', marginTop: 4, fontSize: '0.93em' }}>
            Total: {getCacheSize(fonts)}
          </div>
          <button
            className="font-cache-clear"
            onClick={handleClear}
            style={{
              background: 'none',
              border: 'none',
              color: '#ef4444',
              fontSize: '0.97em',
              fontWeight: 500,
              cursor: 'pointer',
              marginTop: 8,
              padding: 0,
              textDecoration: 'underline',
              display: 'block',
            }}
            disabled={fonts.length === 0}
          >
            Clear Cache
          </button>
        </div>
      )}
    </div>
  );
};

export default FontCacheMenu; 