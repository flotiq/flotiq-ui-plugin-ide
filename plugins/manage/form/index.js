import pluginInfo from "../../../plugin-manifest.json";
import { editorEventhandler } from "../../editor";
import { getChangeModeElement } from "../change-mode";
import {
  addElementToCache,
  getCachedElement,
} from "../../../common/plugin-element-cache";
import { getDownloadElement } from "../download";
import { codeTemplates } from "../../handlebars";

const isFormMode = () => {
  const manageMode = JSON.parse(localStorage[pluginInfo.id])?.mode;
  return manageMode === "form";
};

export const handleManageFormAddEvent = (
  flotiqEvent,
  refreshes,
  { openSchemaModal },
) => {
  if (flotiqEvent.contentType?.id !== pluginInfo.id || !isFormMode()) return;

  const cacheKey = `${pluginInfo.id}-manage-form-add`;
  let element = getCachedElement(cacheKey)?.element;

  const elementData = { refreshes, openSchemaModal };

  if (!element) {
    element = document.createElement("div");

    element.appendChild(getDownloadElement(elementData.openSchemaModal));
    element.appendChild(getChangeModeElement("form", elementData.refreshes));

    const editorElement = editorEventhandler(
      "flotiq.plugins.manage::form-schema",
      {
        defaultValue: codeTemplates.schema(),
      },
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

export const handleManageFormEvent = (flotiqEvent) => {
  if (!isFormMode()) return;

  const code = JSON.parse(localStorage[pluginInfo.id])?.[
    "flotiq.plugins.manage::form-schema"
  ];

  if (code) {
    try {
      const fields = new Function("flotiqEvent", code)(flotiqEvent);
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
    } catch {
      //
    }
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
