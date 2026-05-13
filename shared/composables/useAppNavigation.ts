// shared/composables/useAppNavigation.ts
// Lightweight navigation wrapper for locale-aware routing

export const useAppNavigation = () => {
  const localePath = useLocalePath();

  /**
   * Navigate to a path with automatic locale prefix handling
   * @param path - The route path (without locale prefix)
   */
  const go = (path: string) => {
    return navigateTo(localePath(path));
  };

  /**
   * Navigate to a path with replace option
   * @param path - The route path (without locale prefix)
   * @param replace - Whether to replace current history entry
   */
  const goReplace = (path: string, replace: boolean = true) => {
    return navigateTo(localePath(path), { replace });
  };

  return {
    go,
    goReplace,
  };
};
