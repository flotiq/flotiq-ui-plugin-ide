/**
 * @interface
 */
class IFlotiqPluginEvent {
  constructor(initData: any);
}

/**
 * An event that is rendering addintional element at start in the content object form.
 * It also renders at webhook form page.
 *
 * @memberof FlotiqPlugins.Events
 * @event "flotiq.form::add"
 * @type {FormAddElementEvent}
 * @returns {null|string|array|number|boolean|HTMLElement|ReactElement}
 *          Null if rendering should be passed to either Flotiq or other plugins.
 *          Renderable result if plugin wants to add additional field to content object form.
 */
/**
 * @class
 * @memberof FlotiqPlugins.Events
 * @name FormAddElementEvent
 *
 * @property {object} contentType Content type that includes the field
 *
 * @property {FormikContextType} formik An instance of Formik
 *
 * @property {function} onMediaUpload Function to upload media files (mostly for media relations)
 *
 * @property {object} initialData Initial data of the content object.
 *    This will be either a new object or the object being edited.
 *
 * @property {object} userPlugins User plugins data with settings
 */
class FormAddElementEvent extends IFlotiqPluginEvent {
  contentType: any;
  formik: any;
  onMediaUpload: any;
  initialData: any;
  userPlugins: any;
}

/**
 * An event that is fired sidebar is rendered
 * Returning anything will embed that result in the sidebar in addition to the original sidebar.
 * It also renders at webhook form page.
 *
 * @memberof FlotiqPlugins.Events
 * @event "flotiq.form.sidebar-panel::add"
 * @type {FormAddSidebarPanelEvent}
 * @returns {null|string|array|number|boolean|HTMLElement|ReactElement}
 *          Null if rendering should be passed to either Flotiq or other plugins.
 *          Renderable result if plugin wants to replace the default renderer.
 */
/**
 * @class
 * @memberof FlotiqPlugins.Events
 * @name FormAddSidebarPanelEvent
 *
 * @property {object} contentType Content type that includes the field
 * @property {object} contentObject Data of the content object.
 *    This will be either a new object or the object being edited.
 *
 * @property {boolean} disabled If form is disabled
 * @property {boolean} duplicate If an object is being duplicated
 * @property {boolean} create If an object is being created
 *
 * @property {object} userPlugins User plugins data with settings
 */
class FormAddSidebarPanelEvent extends IFlotiqPluginEvent {
  contentType: any;
  contentObject: any;
  disabled: any;
  duplicate: any;
  create: any;
  userPlugins: any;
}

/**
 * An event that is fired when an object form is submitted (after the API call is triggered).
 * It will be skipped if client side validation fails.
 * No result is expected.
 *
 * @memberof FlotiqPlugins.Events
 * @event "flotiq.form::after-submit"
 * @type {FormAfterSubmitEvent}
 */
/**
 * @class
 * @memberof FlotiqPlugins.Events
 * @name FormAfterSubmitEvent
 *
 * @property {boolean} success If the form submission was successful
 * @property {object} contentObject New content object data returned from API.
 *                    If the form submission fails, the data will return the values
 *                    with which the submission was triggered.
 * @property {object} errors Errors returned after submitting the form.
 */
class FormAfterSubmitEvent extends IFlotiqPluginEvent {
  success: any;
  contentObject: any;
  errors: any;
}

/**
 * An event that is fired when a field is rendered in the object form.
 * No result is expected, but event may modify the config object that is then passed to the field.
 * This event is fired for every field in the form except hidden ones.
 *
 * If additionalElements are added to the configuration, additional elements will be rendered in the field component
 *
 * @memberof FlotiqPlugins.Events
 * @event "flotiq.form.field::config"
 * @type {FormConfigFieldEvent}
 */
/**
 * @class
 * @extends FormRenderFieldEvent
 * @memberof FlotiqPlugins.Events
 * @name FormConfigFieldEvent
 *
 * @property {object} config Field configuration
 */
class FormConfigFieldEvent extends FormRenderFieldEvent {
  config: any;
}

/**
 * An event that is fired when a field is rendered in the object form.
 * Returning anything will embed that result in the form for the field instead of the original control.
 * This event is fired for every field in the form except hidden ones.
 *
 * @memberof FlotiqPlugins.Events
 * @event "flotiq.form.field::render"
 * @type {FormRenderFieldEvent}
 * @returns {null|string|array|number|boolean|HTMLElement|ReactElement}
 *          Null if rendering should be passed to either Flotiq or other plugins.
 *          Renderable result if plugin wants to replace the default renderer.
 */
/**
 * @class
 * @memberof FlotiqPlugins.Events
 * @name FormRenderFieldEvent
 *
 * @property {string} name Field name
 * @property {*} value Field value
 * @property {object} contentType Content type that includes the field
 * @property {object} initialData Initial data of the content object.
 *    This will be either a new object or the object being edited.
 *
 * @property {object} properties Field properties
 * @property {object} schema Field schema
 *
 * @property {boolean} required If field is required
 * @property {boolean} disabled If field is disabled
 * @property {boolean} isEditing If content object is editing
 *
 * @property {FormikContextType} formik An instance of Formik
 *
 * @property {string} error Field error returned by validation
 * @property {function} onMediaUpload Function to upload media files (mostly for media relations)
 *
 * @property {object} userPlugins User plugins data with settings
 */
class FormRenderFieldEvent extends IFlotiqPluginEvent {
  name: any;
  value: any;
  contentType: any;
  properties: any;
  schema: any;
  isEditing: any;
  required: any;
  disabled: any;
  formik: any;
  error: any;
  onMediaUpload: any;
  initialData: any;
  userPlugins: any;
}

/**
 * An event that is fired when a grid is rendered.
 * Returning anything will embed that result above the grid.
 *
 * @memberof FlotiqPlugins.Events
 * @event "flotiq.grid::add"
 * @type {GridAddElementEvent}
 * @returns {null|string|array|number|boolean|HTMLElement|ReactElement}
 *          Null if rendering should be passed to either Flotiq or other plugins.
 *          Renderable result if plugin wants to place the item above the grid.
 */
/**
 * @class
 * @memberof FlotiqPlugins.Events
 * @name GridRenderFieldEvent
 *
 * @property {string} contentTypeName Content type api name
 * @property {object} contentType Content type that includes the field
 * @property {array} contentObjects Content Type Objects for current page
 * @property {object} pagination Pagination returned from API
 * @property {func} handlePageChange Function to change page
 */
class GridAddElementEvent extends IFlotiqPluginEvent {
  contentTypeName: any;
  contentType: any;
}

/**
 * An event that is fired when a field is rendered in the grid.
 * Returning anything will embed that result in the grid cell for the field.
 *
 * @memberof FlotiqPlugins.Events
 * @event "flotiq.grid.cell::render"
 * @type {GridRenderFieldEvent}
 * @returns {null|string|array|number|boolean|HTMLElement|ReactElement}
 *          Null if rendering should be passed to either Flotiq or other plugins.
 *          Renderable result if plugin wants to replace the default renderer.
 */
/**
 * @class
 * @memberof FlotiqPlugins.Events
 * @name GridRenderFieldEvent
 *
 * @property {string} accessor Full path to the field within the object
 * @property {*} data Field value
 * @property {string} inputType Field input type
 * @property {object} contentObject An entire object that is being rendered
 * @property {object} contentType Content type that includes the field
 * @property {string} contentTypeName Content type api name
 */
class GridRenderFieldEvent extends IFlotiqPluginEvent {
  accessor: any;
  data: any;
  inputType: any;
  contentObject: any;
  contentTypeName: any;
  contentType: any;
}

/**
 * An event that is fired when a filter is being rendered on a top of a column.
 * Returning anything will embed that result in the column header for the field.
 *
 * @memberof FlotiqPlugins.Events
 * @event "flotiq.grid.filter::render"
 * @type {GridRenderFilterEvent}
 * @returns {null|string|array|number|boolean|HTMLElement|ReactElement}
 *          Null if rendering should be passed to either Flotiq or other plugins.
 *          Renderable result if plugin wants to replace the default renderer.
 */
/**
 * @class
 * @memberof FlotiqPlugins.Events
 * @name GridRenderFilterEvent
 *
 * @property {string} accessor Full path to the field within the object
 * @property {string} inputType Field input type
 * @property {function} updateFilters Function to update filters
 * @property {object} allFilters All current filters
 * @property {boolean} disabled If the fifilter is disabled
 * @property {object} contentType Content type that includes the field
 */
class GridRenderFilterEvent extends IFlotiqPluginEvent {
  accessor: any;
  inputType: any;
  updateFilters: any;
  allFilters: any;
  disabled: any;
  contentType: any;
}

/**
 * An event that is fired on language change in the editor.
 * No result is expected.
 *
 * @memberof FlotiqPlugins.Events
 * @event "flotiq.language::changed"
 * @type {LanguageChangedEvent}
 */
/**
 * @class
 * @memberof FlotiqPlugins.Events
 * @name LanguageChangedEvent
 *
 * @property {("pl"|"en")} language Current selected language
 */
class LanguageChangedEvent extends IFlotiqPluginEvent {
  language: any;
}

/**
 * An event that is fired when a variant modal with crop is open.
 * No result is expected, but event may modify the config object for overiding crop presets.
 *
 * @memberof FlotiqPlugins.Events
 * @event "flotiq.media.crop::config"
 * @type {MediaConfigCropEvent}
 */
/**
 * @class
 * @memberof FlotiqPlugins.Events
 * @name MediaConfigCropEvent
 *
 * @property {object} config Variants crop configuration with default presets thay is array of objects with unique key,
 *                    label that will be shown in the popover menu, name that will be set when no variant name was provided and aspect ratio.
 */
class MediaConfigCropEvent extends IFlotiqPluginEvent {
  config: any;
}

/**
 * An event that is fired when plugin is removed from an account.
 * A plugin will **not** receive this event when other plugins are removed.
 * No result is expected.
 *
 * @memberof FlotiqPlugins.Events
 * @event "flotiq.plugin::removed"
 * @type {PluginRemovedEvent}
 */
/**
 * @class
 * @memberof FlotiqPlugins.Events
 * @name PluginRemovedEvent
 */
class PluginRemovedEvent extends IFlotiqPluginEvent {}

/**
 * An event that is fired when plugin settings are updated.
 * A plugin will **not** receive this event when settings are updated for any other plugin.
 * No result is expected.
 *
 * @memberof FlotiqPlugins.Events
 * @event "flotiq.plugin.settings::changed"
 * @type {PluginSettingsChangedEvent}
 */
/**
 * @class
 * @memberof FlotiqPlugins.Events
 * @name PluginSettingsChangedEvent
 *
 * @property {object} settings Updated settings
 */
class PluginSettingsChangedEvent extends IFlotiqPluginEvent {
  settings: any;
}

/**
 * An event that is fired on manage button click.
 * Returning object will be used to render manage modal content.
 *
 * A plugin will **not** receive this event when manage button is clicked for any other plugin.
 *
 * @memberof FlotiqPlugins.Events
 * @event "flotiq.plugins.manage::render"
 * @type {PluginsManageEvent}
 * @returns {null|string|array|number|boolean|HTMLElement|ReactElement}
 */
/**
 * @class
 * @memberof FlotiqPlugins.Events
 * @name PluginsManageEvent
 *
 * @property {object} plugin Plugin data
 * @property {func} reload Callback for reloading plugin settings
 * @property {object} modalInstance Settings modal instance with resolve method
 * @property {array} contentTypes Content types data
 */
class PluginsManageEvent extends IFlotiqPluginEvent {
  plugin: any;
  reload: any;
  modalInstance: any;
  contentTypes: any;
}

class SchemaEventResponse {
  schema: object;
  options: {
    onValidate: () => any;
    onSubmit: () => any;
  };
}

/**
 * Expected resposne fron event that will generate form
 *
 * @typedef {object} SchemaEventResponse
 * @memberof FlotiqPlugins.Events
 * @property {object} schema Schema object compatible flotiq api
 * @property {object} options Additional options passed to settings form
 * @property {FlotiqPlugins.Form.onValidate} options.onValidate
 * @property {FlotiqPlugins.Form.onSubmit} options.onSubmit
 */
/**
 * An event that is fired on manage button click.
 * Returning object will be used to generate manage form for plugin settings.
 *
 * A plugin will **not** receive this event when manage button is clicked for any other plugin.
 *
 * @memberof FlotiqPlugins.Events
 * @event "flotiq.plugins.manage::form-schema"
 * @type {PluginsManageFormSchemaEvent}
 * @returns {null|SchemaEventResponse}
 */
/**
 * @class
 * @memberof FlotiqPlugins.Events
 * @name PluginsManageFormSchemaEvent
 *
 * @property {object} plugin Plugin data
 * @property {array} contentTypes Content types data
 * @property {object} modalInstance Settings modal instance with resolve method
 */
class PluginsManageFormSchemaEvent extends IFlotiqPluginEvent {
  plugin: any;
  contentTypes: any;
  modalInstance: any;
}
