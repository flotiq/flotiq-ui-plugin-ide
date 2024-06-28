/**
 * Add HTML element to cache. When a "flotiq.detached" event is fired,
 * the element will be removed from cache.
 *
 * @property {HTMLElement} element - element to add to cache
 * @property {string} key - unique cache key
 * @property {object} data - any data that should be stored with the element
 */
declare const addElementToCache: (
  element: HTMLElement,
  key: string,
  data?: any,
) => void;

/**
 * Get element from cache by providing unique cache element key.
 *
 * @property {string} key - unique cache key
 */
declare const getCachedElement: (key: string) =>
  | {
      element: HTMLElement;
      data: any;
    }
  | undefined;

/**
 * Register an event to the Flotiq
 *
 * @property {object} pluginInfo - plugin information
 * @property {func} callback - callback called after registration
 */
declare const registerFn: (
  pluginInfo: PluginInfo,
  callback: PluginRegistrationCallback,
) => void;

declare const pluginInfo: PluginInfo;

interface Window {
  FlotiqPlugins: FlotiqPluginsRegistry;
}
