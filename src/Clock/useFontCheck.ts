import { useEffect, useState } from 'react';

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

  useEffect(() => {
    if (!fontFamily) {
      setFontStatus({ isLoaded: true, errorMessage: null });
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
          console.warn(`Font not loaded: ${fontFamily}`);
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
