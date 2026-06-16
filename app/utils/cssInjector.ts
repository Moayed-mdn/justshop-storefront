/**
 * CSS Injector Utilities
 * 
 * Dynamically inject CSS custom properties (variables) into the document.
 * Supports theme switching without page reload.
 */

import type { ThemeTokens } from '~~/types/theme';

/**
 * Inject theme tokens as CSS custom properties on the root element
 * 
 * @param tokens - Object with CSS variable names as keys and values as strings
 * @param target - Target element (defaults to document.documentElement)
 */
export const injectThemeTokens = (
  tokens: ThemeTokens,
  target: HTMLElement = document.documentElement
): void => {
  if (process.server) {
    console.warn('injectThemeTokens should only be called on the client');
    return;
  }

  Object.entries(tokens).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      target.style.setProperty(key, value);
    }
  });
};

/**
 * Remove theme tokens from the target element
 * 
 * @param tokens - Object with CSS variable names to remove
 * @param target - Target element (defaults to document.documentElement)
 */
export const removeThemeTokens = (
  tokens: ThemeTokens,
  target: HTMLElement = document.documentElement
): void => {
  if (process.server) return;

  Object.keys(tokens).forEach((key) => {
    target.style.removeProperty(key);
  });
};

/**
 * Get computed CSS custom property value
 * 
 * @param propertyName - CSS variable name (with or without --)
 * @param target - Target element (defaults to document.documentElement)
 */
export const getCSSVariable = (
  propertyName: string,
  target: HTMLElement = document.documentElement
): string => {
  if (process.server) return '';

  const normalizedName = propertyName.startsWith('--') ? propertyName : `--${propertyName}`;
  return getComputedStyle(target).getPropertyValue(normalizedName).trim();
};

/**
 * Check if a CSS custom property is set
 * 
 * @param propertyName - CSS variable name
 * @param target - Target element (defaults to document.documentElement)
 */
export const hasCSSVariable = (
  propertyName: string,
  target: HTMLElement = document.documentElement
): boolean => {
  const value = getCSSVariable(propertyName, target);
  return value !== '';
};

/**
 * Apply theme with transition effect
 * 
 * @param tokens - Theme tokens to apply
 * @param transitionDuration - Duration in ms (default: 300)
 */
export const applyThemeWithTransition = (
  tokens: ThemeTokens,
  transitionDuration: number = 300
): void => {
  if (process.server) return;

  const root = document.documentElement;

  // Add transition class
  root.style.transition = `background-color ${transitionDuration}ms ease, color ${transitionDuration}ms ease`;

  // Apply tokens
  injectThemeTokens(tokens, root);

  // Remove transition after completion
  setTimeout(() => {
    root.style.transition = '';
  }, transitionDuration);
};

/**
 * Create a style element with CSS rules
 * Useful for injecting complex CSS beyond just custom properties
 * 
 * @param css - CSS rules as a string
 * @param id - Optional ID for the style element
 */
export const injectStyleSheet = (css: string, id?: string): HTMLStyleElement => {
  if (process.server) {
    throw new Error('injectStyleSheet should only be called on the client');
  }

  // Check if style element already exists
  if (id) {
    const existing = document.getElementById(id);
    if (existing && existing instanceof HTMLStyleElement) {
      existing.textContent = css;
      return existing;
    }
  }

  // Create new style element
  const style = document.createElement('style');
  if (id) {
    style.id = id;
  }
  style.textContent = css;
  document.head.appendChild(style);

  return style;
};

/**
 * Remove a style sheet by ID
 * 
 * @param id - The ID of the style element to remove
 */
export const removeStyleSheet = (id: string): void => {
  if (process.server) return;

  const element = document.getElementById(id);
  if (element) {
    element.remove();
  }
};

/**
 * Generate CSS from theme tokens for SSR
 * Returns a string of CSS custom properties
 * 
 * @param tokens - Theme tokens
 */
export const generateThemeCSS = (tokens: ThemeTokens): string => {
  const properties = Object.entries(tokens)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');

  return `:root:root {\n${properties}\n}`;
};

/**
 * Inject theme CSS for SSR (server-side)
 * Returns a style tag as a string
 * 
 * @param tokens - Theme tokens
 */
export const generateThemeStyleTag = (tokens: ThemeTokens): string => {
  const css = generateThemeCSS(tokens);
  return `<style data-theme-ssr="true">\n${css}\n</style>`;
};
