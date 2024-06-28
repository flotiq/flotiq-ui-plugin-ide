import pluginInfo from "../../plugin-manifest.json";
import {
  addElementToCache,
  getCachedElement,
} from "../../common/plugin-element-cache";

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
    const cbEl = new Function("flotiqEvent", "client", "globals", code)(
      flotiqEvent,
      client,
      globals,
    );

    if (cbEl) {
      previewElement.innerHTML = "";
      previewElement.append(cbEl);
    }
  }

  addElementToCache(previewElement, cacheKey);

  return previewElement.children.length ? previewElement : null;
};
