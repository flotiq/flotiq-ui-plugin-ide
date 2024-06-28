/**
 * Jodit editor instance
 */
declare type Jodit = any;
/**
 * Toast ui instance
 */
declare type toast = any;
/**
 * Function that will return the plugin setting.
 */
declare type getPluginSettings = () => string;

/**
 * Modal button config.
 *
 * @property {string} key - Unique button key
 * @property {string} label - Button label
 * @property {('blue' | 'blueBordered' | 'borderless' | 'gray' | 'grayBordered' | 'redBordered')} color -
 *            Predefined button colors
 * @property {any} result - Result that will be returned from the modal promise on the button click.
 *            You can return any data type, including objects and arrays.
 * @property {func} onClick -
 *            Whenever you want to perform some action on button click that is e.g. waiting for some results,
 *            you can use buttons `onClick` property. If the onClick method will return some result, the modal
 *            will be resolved with this value, otherwise undefined will be the result.
 */
declare type FlotiqModalButton = {
  key: string;
  label: string;
  color:
    | "blue"
    | "blueBordered"
    | "borderless"
    | "gray"
    | "grayBordered"
    | "redBordered";
  result: any;
  onClick: () => any;
};
/**
 * Modal properties to generate modal.
 *
 * @property {string} title - Modal title
 * @property {null | string | number | boolean | HTMLElement} content - Modal content
 * @property {FlotiqModalButton[]} buttons - Modal buttons
 * @property {('sm'|'md'|'lg'|'xl'|'2xl')} size - Modal predefined size
 * @property {boolean} hideClose - If close icon should be hidden in the modal.
 *            Closing modal will be avaiable only on modal buttons click.
 */
declare type FlotiqModalConfig = {
  title: string;
  content: null | string | number | boolean | HTMLElement;
  buttons: FlotiqModalButton[];
  size: "sm" | "md" | "lg" | "xl" | "2xl";
  hideClose: boolean;
};
/**
 * Function that will open the modal With an HTML content managed by the plugin.
 *
 * @see {@link .docs/public/plugin-examples.md#open-custom-modal|Open custom modal} section in our examples.
 *
 * @param {FlotiqModalConfig} config Modal properties
 * @returns {Promise<any>}
 *          Our internal modal system is based on promises. You'll get the modal promise upon creating the modal
 *          and it will be resolved (or rejected) automatically once result button is clicked.
 *          Result can be provided either by using the `result` field of each button,
 *          or by returning it from `onClick` method of the button.
 */
declare type openModal = ({ config: FlotiqModalConfig }) => Promise<any>;

/**
 * Function that will be called on formik validate. If there will be no result,
 * there will be yup validation based on schema. If returns errors, they will be passed
 * to formik.
 *
 * @param {object} values Current setttings
 * @returns {null|object} Object or null if there are no errors
 */
declare type onValidate = ({ values: object }) => null | object;
/**
 * Function that will be called on formik submit. Should return array with new settings data
 * and errors
 *
 * @param {object} values Submitted setttings
 * @returns {Array}
 *          Result that has contains 2-element array:
 *          `[settings: object, errors: object]` with new settings and errors if occured during submission.
 */
declare type onSubmit = ({ values: object }) => [object, object];
/**
 * Form properties to generate modal with form.
 *
 * @property {object} schema - Schema object compatible flotiq api
 * @property {object} options Additional options passed to settings form
 * @property {onValidate} options.onValidate Custom validate on form data change
 * @property {onSubmit} options.onSubmit Custom submit handler.
 *            If not provided on form submission, the modal will be resolved with form values.
 * @property {object} initialData - Initial data for form
 * @property {object} labels - Custom labels for modal buttons
 * @property {string} labels.ok - Custom label for submit button, default: "Ok"
 * @property {string} labels.cancel - Custom label for cancel button, default: "Cancel"
 */
declare type FlotiqModalFormConfig = {
  schema: object;
  options: { onValidate: onValidate; onSubmit: onSubmit };
  initialData: object;
  labels: {
    ok: string;
    cancel: string;
  };
};
/**
 * Modal properties with form data to generate modal with form.
 *
 * @property {string} title - Modal title
 * @property {('sm'|'md'|'lg'|'xl'|'2xl')} size - Modal predefined size
 * @property {boolean} hideClose - If close icon should be hidden in the modal.
 *            Closing modal will be avaiable only on modal buttons click.
 * @property {FlotiqModalFormConfig} form Form config
 */
declare type FlotiqSchemaModalConfig = {
  title: string;
  size: "sm" | "md" | "lg" | "xl" | "2xl";
  hideClose: boolean;
  form: FlotiqModalFormConfig;
};
/**
 * Function that will open the modal with a form based on the Content Type Definition schema.
 *
 * @see {@link .docs/public/plugin-examples.md#form-defined-with-a-schema-that-returns-data CTD form modal}
 *      and {@link .docs/public/plugin-examples.md#form-with-custom-submit-and-button-labels customized CTD form modal}
 *      in our examples.
 *
 * @param {FlotiqSchemaModalConfig} config Modal properties
 * @returns {Promise<any>}
 *          Our internal modal system is based on promises. You'll get the modal promise upon creating the modal
 *          and it will be resolved (or rejected) automatically once result button is clicked.
 *          Result can be provided either by using the `result` field of each button,
 *          or by returning it from `onClick` method of the button.
 */
declare type openSchemaModal = ({
  config: FlotiqSchemaModalConfig,
}) => Promise<any>;

declare type FlotiqGlobals = {
  Jodit: Jodit;
  toast: toast;
  getPluginSettings: getPluginSettings;
  openModal: openModal;
  openSchemaModal: openSchemaModal;
};
