import { useEffect, useState } from 'react';
import fontNames from '../font-names.json';

/**
 * Hook to check if a font is loaded and available in the browser
 * @param fontFamily The font family name to check
 * @returns Object containing isLoaded status and error message if applicable
 */
export function useFontCheck(fontFamily: string | undefined) {
  const [fontStatus, setFontStatus] = useState<{
    isLoaded: boolean;
    errorMessage: string | null;
  }>({
    isLoaded: false,
    errorMessage: null,
  });

  function getCachedFonts() {
    try {
      const raw = localStorage.getItem('userFontCache');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function isServerFont(font: string): boolean {
    return font in fontNames;
  }

  async function loadServerFont(font: string): Promise<void> {
    const fontInfo = fontNames[font as keyof typeof fontNames];
    if (!fontInfo) return;

    const fontFace = new FontFace(
      font,
      `url(/fonts/${fontInfo.path})`,
      { style: 'normal', weight: '400' }
    );

    const loadedFace = await fontFace.load();
    (document.fonts as any).add(loadedFace);
  }

  useEffect(() => {
    if (!fontFamily) {
      setFontStatus({ isLoaded: true, errorMessage: null });
      return;
    }

    // First check if this is a server font that should be available
    if (isServerFont(fontFamily)) {
      // Try to load the server font if not already loaded
      loadServerFont(fontFamily)
        .then(() => {
          setFontStatus({ isLoaded: true, errorMessage: null });
        })
        .catch(() => {
          // Server font failed to load - this shouldn't happen but handle gracefully
          setFontStatus({
            isLoaded: false,
            errorMessage: `Server font "${fontFamily}" failed to load`,
          });
        });
      return;
    }

    // Check if the font is available using the FontFace API
    try {
      document.fonts.ready.then(() => {
        // Create a test element to check if the font is applied
        const testElement = document.createElement('span');
        testElement.style.fontFamily = `${fontFamily}, __INVALID_FONT__`;
        testElement.style.fontSize = '0';
        testElement.style.visibility = 'hidden';
        testElement.textContent = 'Font Test';
        document.body.appendChild(testElement);

        // Check computed font style to see if our font was applied
        const computedFont = window.getComputedStyle(testElement).fontFamily;
        const isFontLoaded = !computedFont.includes('__INVALID_FONT__');

        document.body.removeChild(testElement);

        if (!isFontLoaded) {
          // Try to load from user cache
          const cached = getCachedFonts().find((f: { name: string }) => f.name === fontFamily);
          if (cached) {
            // Dynamically load the font from cache
            const fontFace = new FontFace(
              cached.name,
              `url(data:font/${cached.type};base64,${cached.data})`,
              { style: 'normal', weight: '400' }
            );
            fontFace.load().then(loadedFace => {
              (document.fonts as any).add(loadedFace);
              setFontStatus({ isLoaded: true, errorMessage: null });
            }).catch(() => {
              setFontStatus({
                isLoaded: false,
                errorMessage: `Font "${fontFamily}" could not be loaded from cache`,
              });
            });
            return;
          }
          // Only report as missing if it's not a server font and not in cache
          setFontStatus({
            isLoaded: false,
            errorMessage: `Font "${fontFamily}" not available`,
          });
        } else {
          setFontStatus({ isLoaded: true, errorMessage: null });
        }
      });
    } catch (error) {
      console.error('Font check error:', error);
      setFontStatus({
        isLoaded: false,
        errorMessage: `Error checking font: ${error}`,
      });
    }
  }, [fontFamily]);

  return fontStatus;
}
