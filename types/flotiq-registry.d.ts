/**
 * A set of information required from plugin to register in Flotiq UI.
 * It also represents the structure of the `plugin-manifest.json` file, which is used
 * to add plugin permanently to the account, or to the Flotiq UI Plugins Registry (coming soon).
 */
declare type PluginInfo = any;

/**
 * A callback function that will be called when plugin is registered and started.
 * This callback should register all event handlers for the plugin.
 */
declare type PluginRegistrationCallback = () => any;
declare const FlotiqPlugins: FlotiqPluginsRegistry;
/**
 * Main class for handling Flotiq plugins. It is responsible for registering, running and managing plugins.
 * A global instance of this class is available as `window.FlotiqPlugins`.
 *
 * @memberof FlotiqPlugins.Core
 */
declare class FlotiqPluginsRegistry {
  openModal: (config: any) => Promise<any>;
  openSchemaModal: (config: any) => Promise<any>;
  enabled: () => boolean;
  getCurrentLanguage: () => any;
  getLoadedPlugins: () => {
    [k: string]: any;
  };
  getPluginSettings: (id: any) => any;
  setPluginSettings: (id: any, newSettings: any) => void;
  runPluginCode(code: any): void;
  loadPlugin(id: any, url: any, settings: any): Promise<void>;
  /**
   * Register new plugin. If plugin with given ID already exists, it will be unregistered first.
   *
   * @param {PluginInfo} pluginInfo
   * @param {PluginRegistrationCallback} callback
   */
  add(pluginInfo: PluginInfo, callback: PluginRegistrationCallback): void;
  /**
   * Unregister plugin event handlers by id
   * @param {string} pluginId The id of the plugin that should be unregistered from the plugin list
   */
  unregister(pluginId: string): void;
  /**
   * Unregister plugin event handlers by id
   * @param {string} pluginId The id of the plugin that should be unregistered from the plugin list
   */
  unregisterAllPlugins(): void;
  /**
   * Execute all handlers for an event. Event name and parameters must be paired correctly.
   *
   * @param {string} event An event name to run. All registered handlers of this event will be executed.
   * @param  {...any} params Parameters to pass to the handlers.
   * @returns {Array} Array of results from all handlers
   */
  run(event: string, ...params: any[]): any[];
  /**
   * Execute all handlers for an event for the given plugin. Event name and parameters must be paired correctly.
   *
   * @param {string} event An event name to run. Only specified plugin handlers of this event will be executed.
   * @param {string} pluginId Plugin id to run the event for
   * @param  {...any} params Parameters to pass to the handlers.
   * @returns {Array} Array of results from all handlers of given plugin
   */
  runScoped(event: string, pluginId: string, ...params: any[]): any[];
  hasPluginOneOfEvents(pluginId: any, events: any): boolean;
  init(): void;
  getLoadedPluginsIds(): string[];
  getPluginErrors(pluginId: any): any[];
  #private;
}
