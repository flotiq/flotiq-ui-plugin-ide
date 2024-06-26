import { editorEventhandler } from "../editor";
import { editorPreviewEventhandler } from "../preview";
import pluginInfo from "../../plugin-manifest.json";
import { defaultAdd } from "..";
import { onDownload } from "./export-code";

const onModeChange = (refreshes) => {
  const ls = JSON.parse(localStorage[pluginInfo.id]);
  const currentMode = ls?.mode;

  localStorage[pluginInfo.id] = JSON.stringify({
    ...ls,
    mode: currentMode === "custom" ? "form" : "custom",
  });

  refreshes.forEach((refresh) => {
    if (refresh) refresh();
  });
};

const defaultSchema = `
/* For proper IDE plugin function custom schema options are not suported in the preview.
* In generated code you will be able to customize the options.
*/
return {
    schemaDefinition: {
      type: "object",
      allOf: [
        {
          $ref: "#/components/schemas/AbstractContentTypeSchemaDefinition",
        },
        {
          type: "object",
          properties: {
            text: {
              type: "string",
              minLength: 1,
            },
          },
        },
      ],
      required: ["text"],
      additionalProperties: false,
    },
    metaDefinition: {
      order: ["text"],
      propertiesConfig: {
        text: {
          label: "Text",
          unique: false,
          helpText: "",
          inputType: "text",
        },
      },
    },
  };`;

export const handleManageEvent = (flotiqEvent, refreshes) => {
  const manageMode = JSON.parse(localStorage[pluginInfo.id])?.mode;
  if (manageMode !== "custom") return;

  const editorElement = editorEventhandler(
    "flotiq.plugins.manage::render",
    {
      defaultValue: defaultAdd,
    },
    refreshes,
  );

  const previewElement = editorPreviewEventhandler(
    "flotiq.plugins.manage::render",
    flotiqEvent,
    {},
  );

  const manageElement = document.createElement("div");

  const infoElement = document.createElement("div");
  infoElement.textContent =
    "Now the manage mode is custom. If you want to create a manage modal with form ";

  const modeButton = document.createElement("button");
  modeButton.textContent = "click here";
  modeButton.onclick = () => onModeChange(refreshes);
  modeButton.type = "button";

  infoElement.appendChild(modeButton);

  manageElement.appendChild(infoElement);
  manageElement.appendChild(editorElement);

  if (previewElement) manageElement.appendChild(previewElement);

  manageElement.addEventListener("flotiq.attached", () => {
    editorElement.dispatchEvent(new Event("flotiq.attached"));
  });

  return manageElement;
};

export const handleManageFormEvent = (flotiqEvent) => {
  const manageMode = JSON.parse(localStorage[pluginInfo.id])?.mode;
  if (manageMode !== "form") return;

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

export const handleManageFormAddEvent = (
  flotiqEvent,
  refreshes,
  openSchemaModal,
) => {
  if (flotiqEvent.contentType.id !== pluginInfo.id) return;

  const manageMode = JSON.parse(localStorage[pluginInfo.id])?.mode;
  if (manageMode !== "form") return;

  const editorElement = editorEventhandler(
    "flotiq.plugins.manage::form-schema",
    {
      defaultValue: defaultSchema,
    },
    refreshes,
  );

  const element = document.createElement("div");

  const exportElement = document.createElement("div");
  exportElement.textContent = "To download the project ";

  const downloadButton = document.createElement("button");
  downloadButton.textContent = "click here";
  downloadButton.style.color = "blue";
  downloadButton.onclick = () => onDownload(openSchemaModal);
  downloadButton.type = "button";

  exportElement.appendChild(downloadButton);

  const infoElement = document.createElement("div");
  infoElement.textContent =
    "Now the manage mode is custom. If you want to create a manage modal with form ";

  const modeButton = document.createElement("button");
  modeButton.textContent = "click here";
  modeButton.style.color = "green";
  modeButton.onclick = () => onModeChange(refreshes);
  modeButton.type = "button";

  infoElement.appendChild(modeButton);

  element.appendChild(exportElement);
  element.appendChild(infoElement);
  element.appendChild(editorElement);

  element.addEventListener("flotiq.attached", () => {
    editorElement.dispatchEvent(new Event("flotiq.attached"));
  });

  return element;
};
