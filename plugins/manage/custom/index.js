import { editorEventhandler } from "../../editor";
import pluginInfo from "../../../plugin-manifest.json";
import { editorPreviewEventhandler } from "../../preview";
import { getChangeModeElement } from "../change-mode";
import {
  addElementToCache,
  getCachedElement,
} from "../../../common/plugin-element-cache";
import {
  getClearElement,
  getDownloadElement,
  getDownloadJsonElement,
  getUploadJsonElement,
} from "../buttons";

export const handleManageEvent = (refreshes, flotiqEvent, client, globals) => {
  const manageMode = JSON.parse(localStorage[pluginInfo.id])?.mode;
  if (typeof manageMode !== "undefined" && manageMode !== "custom") return;

  const cacheKey = `${pluginInfo.id}-manage-render`;
  let element = getCachedElement(cacheKey)?.element;

  const elementData = { refreshes, globals };

  if (!element) {
    element = document.createElement("div");
    const buttonBar = document.createElement("div");
    buttonBar.classList.add("flotiq-ide-button-bar");

    buttonBar.appendChild(getDownloadElement(elementData.globals));
    buttonBar.appendChild(getDownloadJsonElement());
    buttonBar.appendChild(
      getUploadJsonElement(flotiqEvent.modalInstance.resolve),
    );
    buttonBar.appendChild(getClearElement(flotiqEvent.modalInstance.resolve));

    element.appendChild(buttonBar);
    element.appendChild(getChangeModeElement("custom", elementData.refreshes));

    const editorElement = editorEventhandler(
      "flotiq.plugins.manage::render",
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
