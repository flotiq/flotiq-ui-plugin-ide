import { registerFn } from "../common/plugin-element-cache";
import pluginInfo from "../plugin-manifest.json";
import { editorEventhandler } from "./editor";
import { events } from "./events-config/events";
import { handleManageEvent } from "./manage/custom";
import { handleManageFormAddEvent, handleManageFormEvent } from "./manage/form";
import { editorPreviewEventhandler } from "./preview";

registerFn(pluginInfo, async (handler, _, global) => {
  if (!localStorage[pluginInfo.id])
    localStorage[pluginInfo.id] = '{"mode":"custom"}';

  const modeResreshes = new Map();

  // Manage form handlers
  handler.on("flotiq.plugins.manage::render", (data) => {
    modeResreshes.set("custom", data.rerender);
    return handleManageEvent(data, modeResreshes, global);
  });
  handler.on("flotiq.plugins.manage::form-schema", (data) => {
    modeResreshes.set("form", data.rerender);
    return handleManageFormEvent(data);
  });
  handler.on("flotiq.form::add", (data) => {
    return handleManageFormAddEvent(data, modeResreshes, global);
  });

  // Event handlers
  Object.entries(events).forEach(([eventName, options]) => {
    const refreshes = new Map();

    handler.on(eventName, (flotiqEvent) => {
      const filtered = options.filterCallback?.(flotiqEvent, eventName);
      if (filtered) return;

      const refreshKey = options.refreshKey
        ? flotiqEvent[options.refreshKey]
        : "default";

      refreshes.set(refreshKey, flotiqEvent.rerender);

      return editorPreviewEventhandler(eventName, flotiqEvent, refreshKey);
    });

    handler.on(options.attachEvent, (flotiqEvent) => {
      const filtered = options.filterCallback?.(
        flotiqEvent,
        options.attachEvent,
      );
      if (filtered) return;

      return editorEventhandler(eventName, refreshes);
    });
  });

  // Plugin removed handler
  handler.on("flotiq.plugin::removed", () => {
    delete localStorage[pluginInfo.id];
  });
});
