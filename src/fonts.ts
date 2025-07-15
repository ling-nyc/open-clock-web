import fontNames from './font-names.json';
import './fonts.css';

/**
 * List of available fonts loaded via the CSS bundle.
 */
export const knownFonts: readonly string[] = Object.keys(fontNames);
