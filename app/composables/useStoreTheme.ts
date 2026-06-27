/**
 * useStoreTheme Composable
 * 
 * Manages store theme data from the backend theme system.
 * Note: The existing useTheme.ts handles light/dark mode toggling.
 * This composable handles the dynamic store theme (colors, typography, sections, blocks).
 */

import type { Theme, ThemeState } from '~~/types/theme';
import { API_ROUTES } from '~~/shared/utils/routes';
import { useCacheKey, CacheResources } from '~~/src/core/cache/createCacheKey';

export const useStoreTheme = () => {
  // State management
  const theme = useState<Theme | null>('store-theme', () => null);
  const loading = useState<boolean>('store-theme-loading', () => false);
  const error = useState<Error | null>('store-theme-error', () => null);
  const initialized = useState<boolean>('store-theme-initialized', () => false);

  const api = useApi();
  const { getCacheKey } = useCacheKey();

  /**
   * Get session storage key with locale/tenant awareness
   */
  const getStorageKey = () => {
    return getCacheKey({ resource: CacheResources.STORE_THEME });
  };

  // ✅ EMERGENCY: Clear all theme caches on composable initialization
  if (process.client && !initialized.value) {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (key.includes(':store-theme') || key.includes(':STORE_THEME') || key.includes('store-theme'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => sessionStorage.removeItem(key));
      if (keysToRemove.length > 0) {
        console.info(`[EMERGENCY CLEANUP] Removed ${keysToRemove.length} old theme cache entries on init`);
      }
    } catch (e) {
      console.warn('Emergency cleanup on init failed:', e);
    }
  }

  /**
   * Clear old theme cache entries from other locales
   */
  const clearOldThemeCaches = (): void => {
    if (!process.client) return;
    
    try {
      const currentKey = getStorageKey();
      const keysToRemove: string[] = [];
      
      // Find all theme-related keys
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (key.includes(':store-theme') || key.includes(':STORE_THEME'))) {
          // Remove if it's not the current locale's key
          if (!key.startsWith(currentKey)) {
            keysToRemove.push(key);
          }
        }
      }
      
      // Remove old entries
      keysToRemove.forEach(key => sessionStorage.removeItem(key));
      
      if (keysToRemove.length > 0) {
        console.info(`Cleaned up ${keysToRemove.length} old theme cache entries`);
      }
    } catch (e) {
      console.warn('Failed to clear old theme caches:', e);
    }
  };

  /**
   * Clear ALL theme cache entries (emergency cleanup)
   */
  const clearAllThemeCaches = (): void => {
    if (!process.client) return;
    
    try {
      const keysToRemove: string[] = [];
      
      // Find all theme-related keys
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (key.includes(':store-theme') || key.includes(':STORE_THEME'))) {
          keysToRemove.push(key);
        }
      }
      
      // Remove all theme entries
      keysToRemove.forEach(key => sessionStorage.removeItem(key));
      
      console.info(`Emergency cleanup: removed ${keysToRemove.length} theme cache entries`);
    } catch (e) {
      console.warn('Failed to clear all theme caches:', e);
    }
  };

  /**
   * Fetch theme data from the backend API
   */
  const fetchTheme = async (): Promise<void> => {
    if (loading.value) return; // Prevent duplicate requests

    loading.value = true;
    error.value = null;

    try {
      const response = await api<{ data: Theme }>(
        API_ROUTES.storefront.runtime.theme,
        {
          showError: false, // Handle errors manually
        }
      );

      // The runtime API returns { data: { data: theme } } structure
      // Extract the actual theme from response.data.data or response.data
      const themeData = (response as any)?.data?.data || response?.data;
      
      if (themeData) {
        theme.value = themeData;
        initialized.value = true;

        // ✅ Cache in session storage with locale/tenant-aware key
        // NOTE: Disabled sessionStorage caching due to quota issues
        // Backend has Redis cache (3600s TTL) which is sufficient
        if (process.client && false) { // Disabled for now
          try {
            // Clear old theme cache entries to prevent quota errors
            clearOldThemeCaches();
            
            const storageKey = getStorageKey();
            sessionStorage.setItem(storageKey, JSON.stringify(themeData));
            sessionStorage.setItem(`${storageKey}-timestamp`, Date.now().toString());
          } catch (e) {
            // If quota exceeded, try to clear space and retry once
            if (e instanceof Error && (e.name === 'QuotaExceededError' || (e as any).code === 22 || (e as any).code === 26)) {
              try {
                clearAllThemeCaches();
                const storageKey = getStorageKey();
                sessionStorage.setItem(storageKey, JSON.stringify(themeData));
                sessionStorage.setItem(`${storageKey}-timestamp`, Date.now().toString());
                console.info('Theme cached successfully after clearing old entries');
              } catch (retryError) {
                console.warn('Failed to cache theme in sessionStorage even after cleanup:', retryError);
              }
            } else {
              console.warn('Failed to cache theme in sessionStorage:', e);
            }
          }
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch store theme:', err);
      error.value = err instanceof Error ? err : new Error('Failed to fetch theme');

      // Try to load from cache on error
      if (process.client) {
        try {
          const storageKey = getStorageKey();
          const cached = sessionStorage.getItem(storageKey);
          if (cached) {
            theme.value = JSON.parse(cached);
            initialized.value = true;
            console.info('Loaded theme from cache after API error');
          }
        } catch (e) {
          console.warn('Failed to load cached theme:', e);
        }
      }
    } finally {
      loading.value = false;
    }
  };

  /**
   * Load theme from cache if available (for SSR hydration)
   * DISABLED: sessionStorage caching disabled due to quota issues
   */
  const loadFromCache = (): boolean => {
    return false; // Disabled - rely on backend Redis cache instead
    
    if (!process.client) return false;

    try {
      const storageKey = getStorageKey();
      const cached = sessionStorage.getItem(storageKey);
      const timestamp = sessionStorage.getItem(`${storageKey}-timestamp`);

      if (cached && timestamp) {
        const age = Date.now() - parseInt(timestamp, 10);
        const maxAge = 0; // Disabled cache for development - was: 5 * 60 * 1000 (5 minutes)

        if (age < maxAge) {
          theme.value = JSON.parse(cached);
          initialized.value = true;
          return true;
        }
      }
    } catch (e) {
      console.warn('Failed to load theme from cache:', e);
    }

    return false;
  };

  /**
   * Get a specific section by type
   */
  const getSection = (sectionType: string) => {
    return computed(() => {
      if (!theme.value?.sections) return null;
      return theme.value.sections.find(
        (section) => section.section_type === sectionType && section.is_visible
      ) || null;
    });
  };

  /**
   * Get all sections of a specific type
   */
  const getSections = (sectionType: string) => {
    return computed(() => {
      if (!theme.value?.sections) return [];
      return theme.value.sections
        .filter((section) => section.section_type === sectionType && section.is_visible)
        .sort((a, b) => a.position - b.position);
    });
  };

  /**
   * Get visible blocks for a section
   */
  const getSectionBlocks = (sectionId: number) => {
    return computed(() => {
      if (!theme.value?.sections) return [];
      const section = theme.value.sections.find((s) => s.id === sectionId);
      if (!section?.blocks) return [];
      return section.blocks
        .filter((block) => block.is_visible)
        .sort((a, b) => a.position - b.position);
    });
  };

  /**
   * Get theme settings with type safety
   */
  const getThemeSettings = () => {
    return computed(() => theme.value?.settings || {});
  };

  /**
   * Get theme colors
   */
  const getThemeColors = () => {
    return computed(() => theme.value?.settings?.colors || {});
  };

  /**
   * Get theme typography
   */
  const getThemeTypography = () => {
    return computed(() => theme.value?.settings?.typography || {});
  };

  /**
   * Get theme layout settings
   */
  const getThemeLayout = () => {
    return computed(() => theme.value?.settings?.layout || {});
  };

  /**
   * Clear theme cache
   */
  const clearCache = (): void => {
    if (process.client) {
      const storageKey = getStorageKey();
      sessionStorage.removeItem(storageKey);
      sessionStorage.removeItem(`${storageKey}-timestamp`);
    }
    theme.value = null;
    initialized.value = false;
  };

  /**
   * Refresh theme (force refetch)
   */
  const refresh = async (): Promise<void> => {
    clearCache();
    await fetchTheme();
  };

  /**
   * Apply theme tokens to the page
   * Extracts CSS variables from theme and injects them into :root
   * Also loads Google Fonts if needed
   */
  const applyThemeTokens = async (): Promise<void> => {
    if (!process.client) return;
    if (!theme.value) {
      console.warn('Cannot apply theme tokens: theme not loaded');
      return;
    }

    try {
      // Dynamically import utilities (code splitting)
      const [
        { extractThemeTokens, extractGoogleFonts },
        { injectThemeTokens },
        { loadGoogleFonts }
      ] = await Promise.all([
        import('~/utils/themeTokens'),
        import('~/utils/cssInjector'),
        import('~/utils/fontLoader')
      ]);

      // Extract tokens from theme
      const tokens = extractThemeTokens(theme.value);

      // Inject CSS custom properties
      injectThemeTokens(tokens);

      // Load Google Fonts if needed
      const fonts = extractGoogleFonts(theme.value);
      if (fonts.length > 0) {
        loadGoogleFonts(fonts);
      }

      console.info('Theme tokens applied successfully', {
        tokenCount: Object.keys(tokens).length,
        fonts: fonts.length > 0 ? fonts : 'none'
      });
    } catch (err) {
      console.error('Failed to apply theme tokens:', err);
    }
  };

  /**
   * Get theme CSS for SSR injection (SSR-compatible)
   * Extracts theme tokens and generates CSS string
   * Works on both server and client
   */
  const getThemeCSS = async (): Promise<string> => {
    if (!theme.value) {
      return '';
    }

    try {
      // Dynamically import utilities
      const [
        { extractThemeTokens },
        { generateThemeCSS }
      ] = await Promise.all([
        import('~/utils/themeTokens'),
        import('~/utils/cssInjector')
      ]);

      // Extract tokens from theme
      const tokens = extractThemeTokens(theme.value);

      // Generate CSS string
      return generateThemeCSS(tokens);
    } catch (err) {
      console.error('Failed to generate theme CSS:', err);
      return '';
    }
  };

  return {
    // State
    theme: computed(() => theme.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    initialized: computed(() => initialized.value),

    // Computed getters
    settings: getThemeSettings(),
    colors: getThemeColors(),
    typography: getThemeTypography(),
    layout: getThemeLayout(),

    // Methods
    fetchTheme,
    loadFromCache,
    getSection,
    getSections,
    getSectionBlocks,
    clearCache,
    refresh,
    applyThemeTokens,
    getThemeCSS,
  };
};
