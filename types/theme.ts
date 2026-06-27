/**
 * Theme System Type Definitions
 * 
 * These types define the structure of theme data returned from the backend API.
 * Based on the Laravel theme system implementation.
 */

/**
 * Theme block - Individual component within a section
 */
export interface ThemeBlock {
  id: number;
  section_id: number;
  block_type: string;
  position: number;
  settings: Record<string, any>;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Theme section - Container for blocks (e.g., header, footer)
 */
export interface ThemeSection {
  id: number;
  theme_id: number;
  section_type: string;
  position: number;
  settings: Record<string, any>;
  is_visible: boolean;
  blocks: ThemeBlock[];
  created_at: string;
  updated_at: string;
}

/**
 * Theme settings - Colors, typography, layout configuration
 */
export interface ThemeSettings {
  colors?: {
    primary?: string;
    secondary?: string;
    background?: string;
    text?: string;
    textMuted?: string;
    border?: string;
    success?: string;
    error?: string;
    warning?: string;
    [key: string]: string | undefined;
  };
  typography?: {
    heading?: string;
    body?: string;
    headingFont?: string;
    bodyFont?: string;
    headingWeight?: string;
    bodyWeight?: string;
    baseFontSize?: string;
    lineHeight?: string;
    letterSpacing?: string;
    [key: string]: string | undefined;
  };
  layout?: {
    containerWidth?: string;
    spacingUnit?: string;
    borderRadius?: string;
    [key: string]: string | undefined;
  };
  buttons?: {
    primary?: any;
    secondary?: any;
    outline?: any;
  };
  [key: string]: any;
}

/**
 * Complete theme data structure
 */
export interface Theme {
  id: number;
  store_id: number;
  name: string;
  description: string | null;
  version: string;
  is_active: boolean;
  settings: ThemeSettings;
  sections: ThemeSection[];
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

/**
 * Theme API response wrapper
 */
export interface ThemeResponse {
  success: boolean;
  data: Theme;
  message?: string;
}

/**
 * CSS Token structure for injection
 */
export interface ThemeTokens {
  [key: string]: string;
}

/**
 * Theme state for composable
 */
export interface ThemeState {
  theme: Theme | null;
  loading: boolean;
  error: Error | null;
  initialized: boolean;
}
