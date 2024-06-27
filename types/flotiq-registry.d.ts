class FlotiqScopedApiClient {
  constructor(permissions: any);
  getObject(type: any, id: any): any;
  listObjects(type: any, query: any): any;
  postObject(type: any, object: any): any;
  putObject(type: any, id: any, object: any): any;
  patchObject(type: any, id: any, object: any): any;
  deleteObject(type: any, id: any): any;
  getContentTypes(params: any): any;
  getContentType(type: any): any;
  getMediaUrl(mediaData: any, height?: number, width?: number): string;
  #private;
}

/**
 * This handler is passed to each plugin instance to allow it to register callbacks for events or run new events.
 *
 * @memberof FlotiqPlugins.Core
 * @name PluginEventHandler
 * @class
 *
 * @property {PluginInfo} plugin Plugin info
 * @property {FlotiqPlugins} registry Plugin registry
 *
 */
export class PluginEventHandler {
  /**
   *
   * @param {PluginInfo} pluginInfo
   * @param {FlotiqPlugins} registry
   */
  constructor(
    pluginInfo: PluginInfo,
    registry: FlotiqPlugins,
    callbackRegister: any,
    registeredPluginHandlers: any,
  );
  plugin: PluginInfo;
  registry: FlotiqPlugins;
  /**
   * Registers a callback for given event
   *
   * @param {string} event
   * @param {function} callback
   */
  on(event: string, callback: Function): void;
  /**
   * Runs an event with given params
   */
  run(event: any, ...params: any[]): void;
  /**
   * Unregisters all callbacks for given plugin
   */
  unregister(): void;
  #private;
}

export default FlotiqPlugins;
export type PluginPermission = any;
/**
 * A set of information required from plugin to register in Flotiq UI.
 * It also represents the structure of the `plugin-manifest.json` file, which is used
 * to add plugin permanently to the account, or to the Flotiq UI Plugins Registry (coming soon).
 */
export type PluginInfo = any;
/**
 * Api client
 */
export type FlotiqApiClient = any;
export type Jodit = any;
/**
 * Function that will be called on formik validate. If there will be no result,
 * there will be yup validation based on schema. If returns errors, they will be passed
 * to formik.
 */
export type onValidate = () => any;
/**
 * Function that will be called on formik submit. Should return array with new settings data
 * and errors
 */
export type onSubmit = () => any;
/**
 * Modal button config.
 */
export type FlotiqModalButton = object;
/**
 * Modal properties to generate modal.
 */
export type FlotiqModalConfig = object;
/**
 * Function that will open the modal With an HTML content managed by the plugin.
 */
export type openModal = () => any;
/**
 * Form properties to generate modal with form.
 */
export type FlotiqModalFormConfig = object;
/**
 * Modal properties with form data to generate modal with form.
 */
export type FlotiqSchemaModalConfig = object;
/**
 * Function that will open the modal with a form based on the Content Type Definition schema.
 */
export type openSchemaModal = () => any;
/**
 * Function that will return the plugin setting.
 */
export type getPluginSettings = () => any;
export type FlotiqGlobals = any;
/**
 * A callback function that will be called when plugin is registered and started.
 * This callback should register all event handlers for the plugin.
 */
export type PluginRegistrationCallback = () => any;
const FlotiqPlugins: FlotiqPluginsRegistry;
/**
 * Main class for handling Flotiq plugins. It is responsible for registering, running and managing plugins.
 * A global instance of this class is available as `window.FlotiqPlugins`.
 *
 * @memberof FlotiqPlugins.Core
 */
class FlotiqPluginsRegistry {
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
