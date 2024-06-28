/**
 * List of permissions that plugin requires
 *
 * @property {'CO' | 'CTD'} type - permission type. Can be either 'CO' or 'CTD'
 * @property {string} ctdName - name of content type permission applies to. '*' means all content types
 * @property {boolean} canRead - whether plugin can read content of given type
 * @property {boolean} canWrite - whether plugin can write content of given type
 * @property {boolean} canCreate - whether plugin can read create of given type
 * @property {boolean} canDelete - cwhether plugin can read delete of given type
 */
declare type PluginPermission = {
  type: "CO" | "CTD";
  ctdName: string;
  canRead?: boolean;
  canWrite?: boolean;
  canCreate?: boolean;
  canDelete?: boolean;
};

/**
 * A set of information required from plugin to register in Flotiq UI.
 * It also represents the structure of the `plugin-manifest.json` file, which is used
 * to add plugin permanently to the account, or to the Flotiq UI Plugins Registry (coming soon).
 *
 * @property {string} id - unique plugin id. This information is requried both during development
 *             and in plugin-manifest.json
 * @property {string} name - plugin display name. This information is requried both during development
 *             and in plugin-manifest.json
 * @property {string} version - plugin version. This information is requried in plugin-manifest.json.
 *             It can be omitted when registering plugin with FlotiqPlugins.add during development.
 * @property {string} url - plugin URL. This information is requried in plugin-manifest.json.
 *             It can be omitted when registering plugin with FlotiqPlugins.add during development.
 * @property {string} description - plugin description.
 * @property {string} repository - URL to source code repository
 * @property {string} permissions - list of permissions that plugin requires
 */
declare type PluginInfo = {
  id: string;
  name: string;
  version?: string;
  url?: string;
  description?: string;
  repository?: string;
  permissions?: Array<PluginPermission>;
};

/**
 * Handler callback
 *
 * @param {any} params
 */
declare type handlerCallback = (...params: any) => any | null;
declare type handlerOn = (event: string, callback: handlerCallback) => {};
declare type handlerRun = (event: string, ...params: any) => {};
declare type handlerUnregister = () => {};

/**
 * This handler is passed to each plugin instance to allow it to register callbacks for events or run new events.
 *
 * @property {PluginInfo} pluginInfo Plugin info
 * @property {FlotiqPlugins} registry Plugin registry
 *
 */
declare type PluginEventHandler = {
  /**
   * Registers a callback for given event
   *
   * @param {string} event
   * @param {function} callback
   */
  on: handlerOn;
  /**
   * Runs an event with given params
   * @param {string} event
   * @param {any} params
   */
  run: handlerRun;
  /**
   * Unregisters all callbacks for given plugin
   */
  unregister: () => {};
};

/**
 * A callback function that will be called when plugin is registered and started.
 * This callback should register all event handlers for the plugin.
 *
 * @property {object} eventHandler - plugin information
 * @property {object} client - plugin information
 * @property {object} globals - plugin information
 */
declare type PluginRegistrationCallback = (
  eventHandler: PluginEventHandler,
  client: FlotiqApiClient,
  globals: FlotiqGlobals,
) => {};

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
