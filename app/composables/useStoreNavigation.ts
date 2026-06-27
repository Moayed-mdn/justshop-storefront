/**
 * useStoreNavigation Composable
 * 
 * Manages navigation menu data from the backend.
 * Supports multiple menus (main, footer, mobile, etc.) with independent state.
 */

import type { NavigationMenu } from '~~/types/navigation';
import { API_ROUTES } from '~~/shared/utils/routes';
import { useCacheKey, CacheResources } from '~~/src/core/cache/createCacheKey';

export const useStoreNavigation = (handle: string = 'main-menu') => {
  const { getCacheKey } = useCacheKey();
  
  // Create unique state keys per menu handle
  const stateKey = `nav-${handle}`;
  const loadingKey = `nav-${handle}-loading`;
  const errorKey = `nav-${handle}-error`;
  const initializedKey = `nav-${handle}-initialized`;

  // State management (per menu)
  const menu = useState<NavigationMenu | null>(stateKey, () => null);
  const loading = useState<boolean>(loadingKey, () => false);
  const error = useState<Error | null>(errorKey, () => null);
  const initialized = useState<boolean>(initializedKey, () => false);

  const api = useApi();

  /**
   * Get session storage key with locale/tenant awareness
   */
  const getStorageKey = (menuHandle: string) => {
    return getCacheKey({ 
      resource: CacheResources.STORE_NAVIGATION, 
      identifier: menuHandle 
    });
  };

  /**
   * Fetch navigation menu data from the backend API
   */
  const fetchMenu = async (menuHandle?: string): Promise<void> => {
    const targetHandle = menuHandle || handle;

    if (loading.value) return; // Prevent duplicate requests

    loading.value = true;
    error.value = null;

    try {
      const response = await api<{ data: NavigationMenu }>(
        API_ROUTES.storefront.runtime.navigation,
        {
          query: { handle: targetHandle },
          showError: false, // Handle errors manually
        }
      );

      if (response?.data) {
        menu.value = response.data;
        initialized.value = true;

        // ✅ Cache in session storage with locale/tenant-aware key
        if (process.client) {
          try {
            const storageKey = getStorageKey(targetHandle);
            sessionStorage.setItem(storageKey, JSON.stringify(response.data));
            sessionStorage.setItem(`${storageKey}-timestamp`, Date.now().toString());
          } catch (e) {
            console.warn(`Failed to cache navigation menu ${targetHandle}:`, e);
          }
        }
      }
    } catch (err: any) {
      console.error(`Failed to fetch navigation menu ${targetHandle}:`, err);
      error.value = err instanceof Error ? err : new Error('Failed to fetch navigation menu');

      // Try to load from cache on error
      if (process.client) {
        try {
          const storageKey = getStorageKey(targetHandle);
          const cached = sessionStorage.getItem(storageKey);
          if (cached) {
            menu.value = JSON.parse(cached);
            initialized.value = true;
            console.info(`Loaded navigation menu ${targetHandle} from cache after API error`);
          }
        } catch (e) {
          console.warn('Failed to load cached navigation menu:', e);
        }
      }
    } finally {
      loading.value = false;
    }
  };

  /**
   * Load menu from cache if available (for SSR hydration)
   */
  const loadFromCache = (menuHandle?: string): boolean => {
    if (!process.client) return false;

    const targetHandle = menuHandle || handle;

    try {
      const cached = sessionStorage.getItem(`nav-${targetHandle}`);
      const timestamp = sessionStorage.getItem(`nav-${targetHandle}-timestamp`);

      if (cached && timestamp) {
        const age = Date.now() - parseInt(timestamp, 10);
        const maxAge = 0; // Disabled cache for development - was: 5 * 60 * 1000 (5 minutes)

        if (age < maxAge) {
          menu.value = JSON.parse(cached);
          initialized.value = true;
          return true;
        }
      }
    } catch (e) {
      console.warn(`Failed to load navigation menu ${targetHandle} from cache:`, e);
    }

    return false;
  };

  /**
   * Get top-level menu items (no parent)
   */
  const getTopLevelItems = () => {
    return computed(() => {
      if (!menu.value?.items) return [];
      return menu.value.items
        .filter((item) => !item.parent_id && item.is_visible)
        .sort((a, b) => a.position - b.position);
    });
  };

  /**
   * Get child items for a specific parent
   */
  const getChildItems = (parentId: number) => {
    return computed(() => {
      if (!menu.value?.items) return [];
      return menu.value.items
        .filter((item) => item.parent_id === parentId && item.is_visible)
        .sort((a, b) => a.position - b.position);
    });
  };

  /**
   * Build hierarchical menu structure (items with nested children)
   */
  const getHierarchicalItems = () => {
    return computed(() => {
      if (!menu.value?.items) return [];

      const itemMap = new Map<number, NavigationMenu['items'][0] & { children: any[] }>();
      const rootItems: (NavigationMenu['items'][0] & { children: any[] })[] = [];

      // First pass: create map of all items
      menu.value.items
        .filter((item) => item.is_visible)
        .forEach((item) => {
          itemMap.set(item.id, { ...item, children: [] });
        });

      // Second pass: build hierarchy
      itemMap.forEach((item) => {
        if (item.parent_id && itemMap.has(item.parent_id)) {
          itemMap.get(item.parent_id)!.children.push(item);
        } else {
          rootItems.push(item);
        }
      });

      // Sort all levels by position
      const sortByPosition = (items: any[]) => {
        items.sort((a, b) => a.position - b.position);
        items.forEach((item) => {
          if (item.children?.length) {
            sortByPosition(item.children);
          }
        });
      };

      sortByPosition(rootItems);

      return rootItems;
    });
  };

  /**
   * Check if menu has items
   */
  const hasItems = computed(() => {
    return (menu.value?.items?.length || 0) > 0;
  });

  /**
   * Check if menu is active
   */
  const isActive = computed(() => {
    return menu.value?.is_active ?? false;
  });

  /**
   * Clear navigation cache
   */
  const clearCache = (menuHandle?: string): void => {
    const targetHandle = menuHandle || handle;
    if (process.client) {
      sessionStorage.removeItem(`nav-${targetHandle}`);
      sessionStorage.removeItem(`nav-${targetHandle}-timestamp`);
    }
    menu.value = null;
    initialized.value = false;
  };

  /**
   * Refresh menu (force refetch)
   */
  const refresh = async (menuHandle?: string): Promise<void> => {
    const targetHandle = menuHandle || handle;
    clearCache(targetHandle);
    await fetchMenu(targetHandle);
  };

  return {
    // State
    menu: computed(() => menu.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    initialized: computed(() => initialized.value),
    hasItems,
    isActive,

    // Computed getters
    topLevelItems: getTopLevelItems(),
    hierarchicalItems: getHierarchicalItems(),

    // Methods
    fetchMenu,
    loadFromCache,
    getChildItems,
    clearCache,
    refresh,
  };
};
