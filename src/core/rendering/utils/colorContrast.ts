/**
 * Color contrast utility functions
 * Based on YIQ formula for perceived brightness calculation
 */

/**
 * Converts a hex color to RGB values
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Remove # if present
  const cleanHex = hex.replace(/^#/, '')
  
  // Parse 3-digit or 6-digit hex
  const hexValue = cleanHex.length === 3
    ? cleanHex.split('').map(char => char + char).join('')
    : cleanHex
  
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexValue)
  
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

/**
 * Calculate perceived brightness using YIQ formula
 * Returns a value between 0 (dark) and 255 (bright)
 * 
 * The YIQ formula weights colors by their perceived brightness:
 * - Red: 299 (most impactful)
 * - Green: 587 (highly impactful)
 * - Blue: 114 (least impactful)
 */
export function getPerceivedBrightness(hex: string): number {
  const rgb = hexToRgb(hex)
  if (!rgb) return 128 // Default to medium brightness
  
  return ((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000
}

/**
 * Get contrasting text color (black or white) based on background color
 * Uses WCAG-compliant threshold of 128 (midpoint of 0-255 range)
 * 
 * @param backgroundColor - Hex color string (with or without #)
 * @param threshold - Brightness threshold (0-255). Default 128. Higher = prefer black text
 * @returns '#000000' for dark backgrounds, '#FFFFFF' for light backgrounds
 */
export function getContrastingTextColor(
  backgroundColor: string,
  threshold: number = 128
): string {
  const brightness = getPerceivedBrightness(backgroundColor)
  return brightness >= threshold ? '#000000' : '#FFFFFF'
}

/**
 * Check if a color is considered "light" (needs dark text)
 */
export function isLightColor(hex: string): boolean {
  return getPerceivedBrightness(hex) >= 128
}

/**
 * Check if a color is considered "dark" (needs light text)
 */
export function isDarkColor(hex: string): boolean {
  return getPerceivedBrightness(hex) < 128
}
