/**
 * Navigation System Type Definitions
 * 
 * These types define the structure of navigation menu data returned from the backend API.
 * Based on the Laravel navigation menu system implementation.
 */

/**
 * Navigation menu item
 */
export interface NavigationMenuItem {
  id: number;
  menu_id: number;
  parent_id: number | null;
  label: string;
  url: string;
  target: '_self' | '_blank' | '_parent' | '_top';
  css_classes: string | null;
  position: number;
  is_visible: boolean;
  children?: NavigationMenuItem[];
  created_at: string;
  updated_at: string;
}

/**
 * Navigation menu structure
 */
export interface NavigationMenu {
  id: number;
  store_id: number;
  handle: string;
  title: string;
  description: string | null;
  location: 'header' | 'footer' | 'sidebar' | 'mobile' | null;
  is_active: boolean;
  items: NavigationMenuItem[];
  created_at: string;
  updated_at: string;
}

/**
 * Navigation API response wrapper
 */
export interface NavigationResponse {
  success: boolean;
  data: NavigationMenu;
  message?: string;
}

/**
 * Navigation state for composable
 */
export interface NavigationState {
  menus: Map<string, NavigationMenu>;
  loading: Map<string, boolean>;
  errors: Map<string, Error | null>;
  initialized: Set<string>;
}
