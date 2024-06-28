import pluginInfo from "../../../plugin-manifest.json";
import { editorEventhandler } from "../../editor";
import { getChangeModeElement } from "../change-mode";
import {
  addElementToCache,
  getCachedElement,
} from "../../../common/plugin-element-cache";
import { getDownloadElement } from "../download";
import { getCodeResults } from "../../preview";

const isFormMode = () => {
  const manageMode = JSON.parse(localStorage[pluginInfo.id])?.mode;
  return manageMode === "form";
};

export const handleManageFormAddEvent = (flotiqEvent, refreshes, globals) => {
  if (flotiqEvent.contentType?.id !== pluginInfo.id || !isFormMode()) return;

  const cacheKey = `${pluginInfo.id}-manage-form-add`;
  let element = getCachedElement(cacheKey)?.element;

  const elementData = { refreshes, globals };

  if (!element) {
    element = document.createElement("div");

    element.appendChild(getDownloadElement(elementData.globals));
    element.appendChild(getChangeModeElement("form", elementData.refreshes));

    const editorElement = editorEventhandler(
      "flotiq.plugins.manage::form-schema",
      refreshes,
    );
    element.appendChild(editorElement);

    element.addEventListener("flotiq.attached", () => {
      editorElement.dispatchEvent(new Event("flotiq.attached"));
    });
  }

  addElementToCache(element, cacheKey, elementData);

  return element;
};

export const handleManageFormEvent = (flotiqEvent, client, globals) => {
  if (!isFormMode()) return;

  const code = JSON.parse(localStorage[pluginInfo.id])?.[
    "flotiq.plugins.manage::form-schema"
  ];

  if (code) {
    const fields = getCodeResults(flotiqEvent, client, globals, code);

    if (fields)
      return {
        schema: {
          ...fields,
          id: pluginInfo.id,
        },
        options: {
          onSubmit: (values) => {
            console.log(values);
            return [{ settings: values }, {}];
          },
        },
      };
  }

  return {
    schema: { id: pluginInfo.id },
    options: {
      onSubmit: (values) => {
        console.log(values);
        return [{ settings: values }, {}];
      },
    },
  };
};
