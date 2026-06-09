/**
 * Theme Token Utilities
 * 
 * Extract theme settings and convert them to CSS custom properties (variables).
 * These utilities support dynamic theme styling across the storefront.
 */

import type { Theme, ThemeTokens, ThemeSettings } from '~~/types/theme';

/**
 * Default theme values (fallback)
 */
const DEFAULT_THEME_VALUES = {
  colors: {
    primary: '#3b82f6',
    secondary: '#6366f1',
    accent: '#ec4899',
    background: '#ffffff',
    text: '#1f2937',
    'text-light': '#6b7280',
    'text-dark': '#111827',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    border: '#e5e7eb',
  },
  typography: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
    'font-size-base': '16px',
    'line-height-base': '1.5',
  },
  layout: {
    'container-width': '1280px',
    'spacing-unit': '8px',
    'border-radius': '8px',
    'header-height': '64px',
    'footer-padding': '48px',
  },
} as const;

/**
 * Extract theme tokens from theme settings
 * Converts theme settings into CSS custom property format
 */
export const extractThemeTokens = (theme: Theme | null): ThemeTokens => {
  const tokens: ThemeTokens = {};

  if (!theme) {
    const merged = flattenThemeSettings(DEFAULT_THEME_VALUES);
    applyAliases(merged);
    return merged;
  }

  // Handle runtime API format: theme.tokens.colorPrimary, theme.settings.radius
  // The runtime endpoint returns a compact format without nested settings.colors.
  const runtime = theme as unknown as Record<string, unknown>;
  const runtimeTokens = runtime.tokens as Record<string, string> | undefined;

  if (runtimeTokens) {
    tokens['--color-primary'] = runtimeTokens.colorPrimary;
    tokens['--color-secondary'] = runtimeTokens.colorSecondary;
    tokens['--color-accent'] = runtimeTokens.colorAccent;
    tokens['--color-background'] = runtimeTokens.colorSurface ?? runtimeTokens.colorBackground;
    tokens['--color-text'] = runtimeTokens.colorText;
    tokens['--runtime-font-body'] = runtimeTokens.fontBody ?? '';
    tokens['--runtime-font-heading'] = runtimeTokens.fontHeading ?? '';
  }

  // Handle legacy format: theme.settings.colors.primary
  if (theme.settings?.colors) {
    Object.entries(theme.settings.colors).forEach(([key, value]) => {
      if (value) {
        tokens[`--color-${kebabCase(key)}`] = value;
      }
    });
  }

  // Extract typography
  if (theme.settings?.typography) {
    Object.entries(theme.settings.typography).forEach(([key, value]) => {
      if (value) {
        tokens[`--font-${kebabCase(key)}`] = value;
      }
    });
  }

  // Extract layout settings
  if (theme.settings?.layout) {
    Object.entries(theme.settings.layout).forEach(([key, value]) => {
      if (value) {
        tokens[`--layout-${kebabCase(key)}`] = value;
      }
    });
  }

  // Apply defaults for missing values only
  // Convert default key names to match runtime API format (--colors-* -> --color-*)
  const defaultTokens = flattenThemeSettings(DEFAULT_THEME_VALUES);
  
  Object.entries(defaultTokens).forEach(([key, value]) => {
    // Normalize --colors-* to --color-* to match API format
    const normalizedKey = key.startsWith('--colors-') 
      ? key.replace('--colors-', '--color-')
      : key.startsWith('--typography-')
      ? key.replace('--typography-', '--font-')
      : key;
    
    // Only add if not already present
    if (!tokens[normalizedKey]) {
      tokens[normalizedKey] = value;
    }
  });

  applyAliases(tokens);

  return tokens;
};

/**
 * Apply alias mappings so component-used variables (--color-bg-page, --color-text-primary)
 * are derived from API-returned variables (--color-background, --color-text).
 * Handles both --color-* (from API) and --colors-* (from DEFAULT_THEME_VALUES fallback).
 */
function applyAliases(tokens: ThemeTokens): void {
  const bgColor = tokens['--color-background'] || tokens['--colors-background'];
  if (bgColor) {
    tokens['--color-bg-page'] = bgColor;
    tokens['--color-bg-surface'] = bgColor;
    tokens['--color-bg-elevated'] = bgColor;
    tokens['--color-bg-card'] = bgColor;
    tokens['--color-bg-secondary'] = bgColor; // For footer and secondary surfaces
  }
  const textColor = tokens['--color-text'] || tokens['--colors-text'];
  if (textColor) {
    tokens['--color-text-primary'] = textColor;
    tokens['--color-text-secondary'] = textColor;
    tokens['--color-text-muted'] = textColor;
  }
  const primaryColor = tokens['--color-primary'] || tokens['--colors-primary'];
  if (primaryColor) {
    tokens['--color-primary-dark'] = primaryColor;
  }
  const errorColor = tokens['--color-error'] || tokens['--colors-error'];
  if (errorColor) {
    tokens['--red-error'] = errorColor;
  }
}

/**
 * Flatten nested theme settings into CSS variables
 */
function flattenThemeSettings(settings: any, prefix: string = ''): ThemeTokens {
  const tokens: ThemeTokens = {};

  Object.entries(settings).forEach(([key, value]) => {
    const tokenKey = prefix ? `${prefix}-${kebabCase(key)}` : `--${key}`;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Nested object - recurse
      const nested = flattenThemeSettings(value, tokenKey);
      Object.assign(tokens, nested);
    } else if (value !== null && value !== undefined) {
      // Leaf value
      tokens[tokenKey] = String(value);
    }
  });

  return tokens;
}

/**
 * Convert camelCase or PascalCase to kebab-case
 */
function kebabCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

/**
 * Extract Google Fonts from theme typography settings
 */
export const extractGoogleFonts = (theme: Theme | null): string[] => {
  if (!theme?.settings?.typography) {
    return [];
  }

  const fonts = new Set<string>();
  const typography = theme.settings.typography;

  // Common font keys
  const fontKeys = ['heading', 'body', 'display', 'mono'];

  fontKeys.forEach((key) => {
    const font = typography[key];
    if (font && typeof font === 'string') {
      // Extract the font family name (before any commas)
      const fontFamily = font.split(',')[0].trim().replace(/['"]/g, '');
      
      // Skip system fonts
      const systemFonts = ['system-ui', 'sans-serif', 'serif', 'monospace', 'cursive', 'fantasy'];
      if (!systemFonts.includes(fontFamily.toLowerCase())) {
        fonts.add(fontFamily);
      }
    }
  });

  return Array.from(fonts);
};

/**
 * Generate Google Fonts URL
 */
export const generateGoogleFontsUrl = (fonts: string[]): string | null => {
  if (!fonts.length) return null;

  const fontParams = fonts
    .map((font) => `family=${encodeURIComponent(font.replace(/\s+/g, '+'))}:wght@400;500;600;700`)
    .join('&');

  return `https://fonts.googleapis.com/css2?${fontParams}&display=swap`;
};

/**
 * Get a specific theme token value
 */
export const getThemeToken = (tokens: ThemeTokens, key: string): string | undefined => {
  // Support both with and without -- prefix
  const normalizedKey = key.startsWith('--') ? key : `--${key}`;
  return tokens[normalizedKey];
};

/**
 * Validate theme tokens
 */
export const validateThemeTokens = (tokens: ThemeTokens): boolean => {
  // Check for required tokens
  const requiredTokens = [
    '--color-primary',
    '--color-background',
    '--color-text',
    '--font-body',
  ];

  return requiredTokens.every((token) => token in tokens && tokens[token]);
};

/**
 * Get theme token with fallback
 */
export const getThemeTokenWithFallback = (
  tokens: ThemeTokens,
  key: string,
  fallback: string
): string => {
  return getThemeToken(tokens, key) || fallback;
};
