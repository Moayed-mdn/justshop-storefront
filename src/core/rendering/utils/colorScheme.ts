/**
 * Color Scheme Management Utilities (Shopify-Style)
 * 
 * This module handles color scheme resolution and application for runtime sections.
 * Color schemes are pre-defined palettes that ensure consistent, accessible design.
 */

import type { RuntimeThemeResponse, ColorScheme } from '../../runtime/contracts/types'
import { getContrastingTextColor } from './colorContrast'

/**
 * Applied color scheme with all calculated values
 */
export interface AppliedColorScheme {
  backgroundColor: string
  color: string
  buttonBackground: string
  buttonColor: string
  secondaryBackground: string
  borderColor: string
}

/**
 * Get a color scheme by key from theme settings
 * 
 * @param theme - Runtime theme response data
 * @param schemeKey - Color scheme key (e.g., 'brand', 'dark', 'default')
 * @returns Color scheme object or null if not found
 */
export function getColorScheme(
  theme: RuntimeThemeResponse['data'] | undefined | null,
  schemeKey: string | undefined
): ColorScheme | null {
  if (!theme || !schemeKey) return null
  
  const schemes = theme.settings?.color_schemes
  if (!schemes || typeof schemes !== 'object') return null
  
  const scheme = schemes[schemeKey]
  if (!scheme || typeof scheme !== 'object') return null
  
  return scheme as ColorScheme
}

/**
 * Get the default color scheme (fallback)
 * 
 * @param theme - Runtime theme response data
 * @returns Default color scheme
 */
export function getDefaultColorScheme(
  theme: RuntimeThemeResponse['data'] | undefined | null
): ColorScheme {
  // Try to get 'default' scheme first
  const defaultScheme = getColorScheme(theme, 'default')
  if (defaultScheme) return defaultScheme
  
  // Fallback: construct from theme colors
  const colors = theme?.settings?.colors || {}
  
  return {
    name: 'Default',
    background: colors.background || '#FFFFFF',
    text: colors.text || '#1F2937',
    button_background: colors.primary || '#3B82F6',
    button_text: '#FFFFFF',
    secondary_background: '#F3F4F6',
    border: colors.border || '#E5E7EB',
  }
}

/**
 * Apply color scheme to a section with automatic contrast calculation
 * 
 * This is the main function to use in components. It:
 * 1. Resolves the color scheme by key
 * 2. Falls back to default scheme if not found
 * 3. Auto-calculates contrasting text colors if needed
 * 4. Returns ready-to-use color values
 * 
 * @param theme - Runtime theme response data
 * @param schemeKey - Color scheme key from section settings
 * @returns Applied color scheme with all calculated values
 */
export function applyColorScheme(
  theme: RuntimeThemeResponse['data'] | undefined | null,
  schemeKey: string | undefined
): AppliedColorScheme {
  // Resolve scheme (with fallback to default)
  const scheme = schemeKey 
    ? getColorScheme(theme, schemeKey) || getDefaultColorScheme(theme)
    : getDefaultColorScheme(theme)
  
  // Auto-calculate contrasting text colors if needed
  // This ensures accessibility even if scheme is poorly configured
  const textColor = scheme.text || getContrastingTextColor(scheme.background)
  const buttonTextColor = scheme.button_text || getContrastingTextColor(scheme.button_background)
  
  return {
    backgroundColor: scheme.background,
    color: textColor,
    buttonBackground: scheme.button_background,
    buttonColor: buttonTextColor,
    secondaryBackground: scheme.secondary_background,
    borderColor: scheme.border,
  }
}

/**
 * Backward compatibility: Map old semantic names to color scheme keys
 * 
 * Old format: settings.background = 'brand'
 * New format: settings.color_scheme = 'brand'
 * 
 * @param settings - Section settings object
 * @returns Color scheme key
 */
export function resolveColorSchemeKey(settings: any): string | undefined {
  // New format (preferred)
  if (settings?.color_scheme) {
    return settings.color_scheme
  }
  
  // Old format (backward compatibility)
  if (settings?.background) {
    // Map semantic names directly (they match color scheme keys)
    return settings.background
  }
  
  return undefined
}

/**
 * Get all available color schemes from theme
 * 
 * Useful for dropdowns and selection UI
 * 
 * @param theme - Runtime theme response data
 * @returns Array of [key, scheme] pairs
 */
export function getAvailableColorSchemes(
  theme: RuntimeThemeResponse['data'] | undefined | null
): Array<[string, ColorScheme]> {
  const schemes = theme?.settings?.color_schemes
  
  if (!schemes || typeof schemes !== 'object') {
    return [['default', getDefaultColorScheme(theme)]]
  }
  
  return Object.entries(schemes).filter(
    ([_, scheme]) => scheme && typeof scheme === 'object'
  ) as Array<[string, ColorScheme]>
}
