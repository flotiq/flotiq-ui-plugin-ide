import { deepReadKeyValue } from "../common/helpers";
import { registerFn } from "../common/plugin-element-cache";
import pluginInfo from "../plugin-manifest.json";
import { editorEventhandler } from "./editor";
import { events } from "./events-config/events";
import { handleManageEvent } from "./manage/custom";
import { handleManageFormAddEvent, handleManageFormEvent } from "./manage/form";
import { editorPreviewEventhandler } from "./preview";

import cssString from "inline:./style.css";

registerFn(pluginInfo, async (handler, client, globals) => {
  /**
   * Add plugin styles to the head of the document
   */
  let style = document.getElementById(`${pluginInfo.id}-styles`);
  if (!style) {
    style = document.createElement("style");
    style.id = `${pluginInfo.id}-styles`;
    document.head.appendChild(style);
  }
  style.textContent = cssString;

  if (!localStorage[pluginInfo.id])
    localStorage[pluginInfo.id] = '{"mode":"custom"}';

  const modeResreshes = new Map();
  let settingsModalInstance = null;
  // Manage form handlers
  handler.on("flotiq.plugins.manage::render", (data) => {
    modeResreshes.set("custom", data.rerender);
    return handleManageEvent(modeResreshes, data, client, globals);
  });
  handler.on("flotiq.plugins.manage::form-schema", (data) => {
    settingsModalInstance = data.modalInstance;
    modeResreshes.set("form", data.rerender);
    return handleManageFormEvent(data, client, globals);
  });
  handler.on("flotiq.form::add", (data) => {
    return handleManageFormAddEvent(
      data,
      modeResreshes,
      globals,
      settingsModalInstance,
    );
  });

  // Event handlers
  Object.entries(events).forEach(([eventName, options]) => {
    const refreshes = new Map();

    handler.on(eventName, (flotiqEvent) => {
      const filtered = options.filterCallback?.(flotiqEvent, eventName);
      if (filtered) return;

      const refreshKey = options.refreshKeys
        ? options.refreshKeys
            .map((refreshKey) => deepReadKeyValue(refreshKey, flotiqEvent))
            .join("-")
        : "default";

      refreshes.set(refreshKey, flotiqEvent.rerender);

      return editorPreviewEventhandler(
        eventName,
        refreshKey,
        flotiqEvent,
        client,
        globals,
      );
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
