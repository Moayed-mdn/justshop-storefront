/**
 * useThemeColors Composable
 * 
 * Provides access to merchant's theme colors with computed hover states.
 * Works with dynamic merchant brand colors without hardcoding.
 */

import { darkenColor, addAlpha } from '~/utils/colorUtils'

export const useThemeColors = () => {
  /**
   * Get CSS variable value from the document
   */
  const getCSSVar = (varName: string): string => {
    if (!process.client) {
      // On server, return fallback values
      return ''
    }
    
    // Ensure varName starts with --
    const cssVarName = varName.startsWith('--') ? varName : `--${varName}`
    
    // Get computed style from :root
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(cssVarName)
      .trim()
    
    return value
  }

  /**
   * Primary color (merchant's brand color)
   */
  const primary = computed(() => {
    if (!process.client) return '#3b82f6'
    return getCSSVar('--color-primary') || '#3b82f6'
  })
  
  /**
   * Primary hover color (automatically darkened by 10%)
   */
  const primaryHover = computed(() => {
    if (!process.client) return '#2563eb'
    return darkenColor(primary.value, 10)
  })
  
  /**
   * Primary with alpha transparency
   */
  const primaryAlpha = (alpha: number) => {
    if (!process.client) return `rgba(59, 130, 246, ${alpha})`
    return addAlpha(primary.value, alpha)
  }
  
  /**
   * Secondary color
   */
  const secondary = computed(() => {
    if (!process.client) return '#10b981'
    return getCSSVar('--color-secondary') || '#10b981'
  })
  
  /**
   * Secondary hover color
   */
  const secondaryHover = computed(() => {
    if (!process.client) return '#059669'
    return darkenColor(secondary.value, 10)
  })
  
  /**
   * Background color
   */
  const background = computed(() => {
    if (!process.client) return '#ffffff'
    return getCSSVar('--color-background') || '#ffffff'
  })
  
  /**
   * Text color
   */
  const text = computed(() => {
    if (!process.client) return '#1f2937'
    return getCSSVar('--color-text') || '#1f2937'
  })
  
  /**
   * On primary (text color on primary background)
   */
  const onPrimary = computed(() => {
    if (!process.client) return '#ffffff'
    return getCSSVar('--color-on-primary') || '#ffffff'
  })
  
  /**
   * Border color
   */
  const border = computed(() => {
    if (!process.client) return '#e5e7eb'
    return getCSSVar('--color-border') || '#e5e7eb'
  })
  
  /**
   * Error color
   */
  const error = computed(() => {
    if (!process.client) return '#ef4444'
    return getCSSVar('--color-error') || '#ef4444'
  })
  
  /**
   * Success color
   */
  const success = computed(() => {
    if (!process.client) return '#10b981'
    return getCSSVar('--color-success') || '#10b981'
  })
  
  /**
   * Warning color
   */
  const warning = computed(() => {
    if (!process.client) return '#f59e0b'
    return getCSSVar('--color-warning') || '#f59e0b'
  })

  /**
   * Get button styles for primary button (with hover)
   * Returns inline styles object
   */
  const primaryButtonStyles = computed(() => ({
    backgroundColor: primary.value,
    color: onPrimary.value,
    '--hover-bg': primaryHover.value,
  }))

  /**
   * Get button styles for secondary button (with hover)
   * Returns inline styles object
   */
  const secondaryButtonStyles = computed(() => ({
    borderColor: primary.value,
    color: primary.value,
    '--hover-bg': addAlpha(primary.value, 0.05),
  }))

  return {
    // Base colors
    primary,
    primaryHover,
    primaryAlpha,
    secondary,
    secondaryHover,
    background,
    text,
    onPrimary,
    border,
    error,
    success,
    warning,
    
    // Helper methods
    getCSSVar,
    
    // Pre-built button styles
    primaryButtonStyles,
    secondaryButtonStyles,
  }
}

// Default export for better compatibility
export default useThemeColors
