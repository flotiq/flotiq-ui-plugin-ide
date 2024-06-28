import pluginInfo from "../../plugin-manifest.json";
import {
  addElementToCache,
  getCachedElement,
} from "../../common/plugin-element-cache";
import * as simulatedCache from "../../common/simulated-cache";

let toastRef;

export const getCodeResults = (flotiqEvent, client, globals, code) => {
  try {
    return new Function(
      "flotiqEvent",
      "client",
      "globals",
      "addElementToCache",
      "getCachedElement",
      "registerFn",
      "pluginInfo",
      code,
    )(
      flotiqEvent,
      client,
      globals,
      simulatedCache.addElementToCache,
      simulatedCache.getCachedElement,
      simulatedCache.registerFn,
      pluginInfo,
    );
  } catch (e) {
    setTimeout(() => {
      if (toastRef) globals.toast.remove(toastRef);
      toastRef = globals.toast.error(e.message);
    });
  }
  return;
};

export const editorPreviewEventhandler = (
  editorEventName,
  uniqueKey,
  flotiqEvent,
  client,
  globals,
) => {
  const cacheKey = `${pluginInfo.id}-${editorEventName}-${uniqueKey}-preview`;

  let previewElement = getCachedElement(cacheKey)?.element;

  if (!previewElement) {
    previewElement = document.createElement("div");
  }

  const code = JSON.parse(localStorage[pluginInfo.id])?.[editorEventName];

  if (code) {
    const cbEl = getCodeResults(flotiqEvent, client, globals, code);

    if (cbEl) {
      previewElement.innerHTML = "";
      previewElement.append(cbEl);
    }
  }

  addElementToCache(previewElement, cacheKey);

  return previewElement.children.length ? previewElement : null;
};
