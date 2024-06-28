import { editorEventhandler } from "../../editor";
import pluginInfo from "../../../plugin-manifest.json";
import { editorPreviewEventhandler } from "../../preview";
import { getChangeModeElement } from "../change-mode";
import {
  addElementToCache,
  getCachedElement,
} from "../../../common/plugin-element-cache";
import { getDownloadElement } from "../download";

export const handleManageEvent = (refreshes, flotiqEvent, client, globals) => {
  const manageMode = JSON.parse(localStorage[pluginInfo.id])?.mode;
  if (manageMode !== "custom") return;

  const cacheKey = `${pluginInfo.id}-manage-render`;
  let element = getCachedElement(cacheKey)?.element;

  const elementData = { refreshes, globals };

  if (!element) {
    element = document.createElement("div");

    element.appendChild(getDownloadElement(elementData.globals));
    element.appendChild(getChangeModeElement("custom", elementData.refreshes));

    const editorElement = editorEventhandler(
      "flotiq.plugins.manage::render",
      refreshes,
    );

    element.appendChild(editorElement);

    const previewElement = editorPreviewEventhandler(
      "flotiq.plugins.manage::render",
      "default",
      flotiqEvent,
      client,
      globals,
    );

    if (previewElement) element.appendChild(previewElement);

    element.addEventListener("flotiq.attached", () => {
      editorElement.dispatchEvent(new Event("flotiq.attached"));
    });
  }

  addElementToCache(element, cacheKey, elementData);

  return element;
};
