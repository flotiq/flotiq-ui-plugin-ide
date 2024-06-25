import { registerFn } from "../common/plugin-element-cache";
import pluginInfo from "../plugin-manifest.json";
import { editorEventhandler } from "./editor";
import {
  handleManageEvent,
  handleManageFormAddEvent,
  handleManageFormEvent,
} from "./manage";
import { getProject } from "./manage/export-code";
import { editorPreviewEventhandler } from "./preview";

export const defaultAdd = `
const el = document.createElement('div');

// do your magic!

return el;
`;

const defaultRender = `
if(flotiqEvent.name !== 'test_field')
    return null; // Don't override fields other than 'test_field'

const el = document.createElement('div');

// do your magic!

return el;
`;

const events = {
  "flotiq.form.sidebar-panel::add": {
    attachEvent: "flotiq.form.sidebar-panel::add",
    defaultValue: defaultAdd,
    containerStyles: "right: 10px",
  },
  "flotiq.form::add": {
    attachEvent: "flotiq.form::add",
    defaultValue: defaultAdd,
    filterCallback: ({ contentType }) => {
      if (contentType.id === pluginInfo.id) return true;
    },
  },
  "flotiq.form.field::render": {
    attachEvent: "flotiq.form::add",
    defaultValue: defaultRender,
    refreshKey: "name",
    filterCallback: ({ contentType }) => {
      if (
        !contentType ||
        contentType?.internal ||
        contentType.id === pluginInfo.id
      )
        return true;
    },
  },
  "flotiq.grid::add": {
    attachEvent: "flotiq.grid::add",
    defaultValue: defaultAdd,
  },
  "flotiq.grid.cell::render": {
    attachEvent: "flotiq.grid::add",
    defaultValue: defaultRender,
    refreshKey: "accessor",
  },
  "flotiq.grid.filter::render": {
    attachEvent: "flotiq.grid::add",
    defaultValue: defaultRender,
    refreshKey: "accessor",
  },
};

registerFn(pluginInfo, async (handler) => {
  getProject()

  if (!localStorage[pluginInfo.id])
    localStorage[pluginInfo.id] = '{"mode":"custom"}';

  const modeResreshes = new Map();

  handler.on("flotiq.plugins.manage::render", (flotiqEvent) => {
    modeResreshes.set("custom", flotiqEvent.rerender);
    return handleManageEvent(flotiqEvent, modeResreshes);
  });
  handler.on("flotiq.plugins.manage::form-schema", (flotiqEvent) => {
    modeResreshes.set("form", flotiqEvent.rerender);
    return handleManageFormEvent(flotiqEvent);
  });
  handler.on("flotiq.form::add", (flotiqEvent) => {
    return handleManageFormAddEvent(flotiqEvent, modeResreshes);
  });

  Object.entries(events).forEach(([eventName, options]) => {
    const refreshes = new Map();

    handler.on(eventName, (flotiqEvent) => {
      const filtered = options.filterCallback?.(flotiqEvent, eventName);
      if (filtered) return;

      const refreshKey = options.refreshKey
        ? flotiqEvent[options.refreshKey]
        : "default";

      refreshes.set(refreshKey, flotiqEvent.rerender);

      return editorPreviewEventhandler(eventName, flotiqEvent, options);
    });

    handler.on(options.attachEvent, (flotiqEvent) => {
      const filtered = options.filterCallback?.(
        flotiqEvent,
        options.attachEvent,
      );
      if (filtered) return;

      return editorEventhandler(eventName, options, refreshes);
    });
  });
});
