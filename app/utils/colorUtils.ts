/**
 * Color Utilities
 * 
 * Utilities for color manipulation used in dynamic theming.
 * These functions work with merchant's custom brand colors.
 */

/**
 * Converts a hex color to RGB values
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Remove # if present
  hex = hex.replace(/^#/, '');

  // Handle 3-digit hex
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }

  if (hex.length !== 6) {
    return null;
  }

  const num = parseInt(hex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Converts RGB values to hex color
 */
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b]
    .map(x => Math.round(Math.max(0, Math.min(255, x))))
    .map(x => x.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Darkens a hex color by a given percentage (0-100)
 * Used for creating hover states for buttons
 * 
 * @param hex - Hex color (e.g., '#3b82f6')
 * @param percent - Percentage to darken (default 10)
 * @returns Darkened hex color
 */
export function darkenColor(hex: string, percent: number = 10): string {
  const rgb = hexToRgb(hex);
  
  if (!rgb) {
    console.warn(`Invalid hex color: ${hex}`);
    return hex;
  }

  const factor = 1 - (percent / 100);
  
  return rgbToHex(
    rgb.r * factor,
    rgb.g * factor,
    rgb.b * factor
  );
}

/**
 * Lightens a hex color by a given percentage (0-100)
 * Used for creating light backgrounds or hover states on light surfaces
 * 
 * @param hex - Hex color (e.g., '#3b82f6')
 * @param percent - Percentage to lighten (default 10)
 * @returns Lightened hex color
 */
export function lightenColor(hex: string, percent: number = 10): string {
  const rgb = hexToRgb(hex);
  
  if (!rgb) {
    console.warn(`Invalid hex color: ${hex}`);
    return hex;
  }

  const factor = percent / 100;
  
  return rgbToHex(
    rgb.r + (255 - rgb.r) * factor,
    rgb.g + (255 - rgb.g) * factor,
    rgb.b + (255 - rgb.b) * factor
  );
}

/**
 * Adds alpha transparency to a hex color
 * 
 * @param hex - Hex color (e.g., '#3b82f6')
 * @param alpha - Alpha value (0-1)
 * @returns RGBA string
 */
export function addAlpha(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  
  if (!rgb) {
    console.warn(`Invalid hex color: ${hex}`);
    return hex;
  }

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${Math.max(0, Math.min(1, alpha))})`;
}

/**
 * Get theme color with hover variant
 * Returns both the base color and hover color (darkened by 10%)
 * 
 * @param baseColor - Base hex color from theme
 * @returns Object with color and hoverColor
 */
export function getColorWithHover(baseColor: string) {
  return {
    color: baseColor,
    hoverColor: darkenColor(baseColor, 10),
  };
}

/**
 * Check if a color is light or dark
 * Useful for determining text color (light text on dark bg, dark text on light bg)
 * 
 * @param hex - Hex color
 * @returns true if light, false if dark
 */
export function isLightColor(hex: string): boolean {
  const rgb = hexToRgb(hex);
  
  if (!rgb) {
    return true; // Default to light
  }

  // Calculate relative luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  
  return luminance > 0.5;
}

/**
 * Get appropriate text color (black or white) for a given background color
 * 
 * @param bgHex - Background hex color
 * @returns '#000000' or '#ffffff'
 */
export function getContrastTextColor(bgHex: string): string {
  return isLightColor(bgHex) ? '#000000' : '#ffffff';
}
