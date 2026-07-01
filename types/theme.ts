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
 * Mirrors backend App\Models\Theme\Theme::$settings structure
 */
export interface ThemeSettings {
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
    textMuted?: string;
    border?: string;
    success?: string;
    error?: string;
    warning?: string;
    [key: string]: string | undefined;
  };
  color_schemes?: Record<string, ColorScheme>;
  fonts?: {
    heading?: string;
    body?: string;
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
    container_width?: 'boxed' | 'full_width';
    page_width?: string;
    spacingUnit?: string;
    borderRadius?: string;
    border_radius?: string;
    direction?: 'ltr' | 'rtl';
    [key: string]: string | undefined;
  };
  buttons?: {
    primary?: any;
    secondary?: any;
    outline?: any;
  };
  branding?: {
    logo_url?: string | null;
    favicon_url?: string | null;
    store_name?: string;
    tagline?: string;
  };
  social?: Record<string, string>;
  topbar?: {
    show_topbar?: boolean;
    phone?: string;
    announcement_text?: string;
    announcement_link?: string;
  };
  footer?: {
    show_newsletter?: boolean;
    copyright_text?: string;
    payment_icons?: string[];
  };
  seo?: {
    default_title?: string;
    default_description?: string;
    default_og_image?: string;
  };
  search?: {
    placeholder?: string;
    show_suggestions?: boolean;
    products_per_page?: number;
  };
  maintenance?: {
    enabled?: boolean;
    message?: string;
  };
  custom_css?: string;
  custom_js?: string;
  [key: string]: any;
}

export interface ColorScheme {
  name: string;
  background: string;
  text: string;
  button_background: string;
  button_text: string;
  secondary_background: string;
  border: string;
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

// ── Template types (Phase 0: Template-Everything) ─────────────────────────

export interface TemplateBlockInstance {
  id: string;
  type: string;
  name: string | null;
  settings: Record<string, unknown>;
  content: Record<string, unknown> | null;
  position: number;
}

export interface TemplateSection {
  id: string;
  type: string;
  settings: Record<string, unknown>;
  data: Record<string, unknown>;
  blocks?: TemplateBlockInstance[];
}

export interface SystemTemplate {
  id: number;
  type: string;
  handle: string;
  name: string;
  sections: Record<string, TemplateSection>;
  section_order: string[];
}

// ── Section Group types ────────────────────────────────────────────────────

export interface SectionGroupSection {
  id: string;
  type: string;
  settings: Record<string, unknown>;
  data: Record<string, unknown>;
}

export interface SectionGroup {
  handle: string;
  sections: SectionGroupSection[];
}

// ── Template Type helpers ─────────────────────────────────────────────────

export const TEMPLATE_TYPE_LABELS: Record<string, string> = {
  home: 'Home Page',
  product: 'Product Page',
  category: 'Category Page',
  page: 'Static Page',
  cart: 'Shopping Cart',
  search: 'Search Results',
  login: 'Login Page',
  register: 'Register Page',
  account: 'Account / Profile Page',
  orders: 'Order History',
  order: 'Order Detail',
  categories: 'All Categories',
  error_404: '404 Not Found',
};

export const TEMPLATE_TYPE_ROUTES: Record<string, string> = {
  cart: '/cart',
  search: '/search',
  login: '/login',
  register: '/register',
  profile: '/profile',
  orders: '/orders',
  categories: '/categories',
};

export function getTemplateLabel(type: string): string {
  return TEMPLATE_TYPE_LABELS[type] ?? type;
}
