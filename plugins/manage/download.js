import pluginInfo from "../../plugin-manifest.json";
import { exportProject } from "./export-code";

const onDownload = (openSchemaModal, toast) => {
  openSchemaModal({
    title: "Fill information about your plugin",
    size: "lg",
    form: {
      labels: { ok: "Download" },
      schema: {
        id: `${pluginInfo.id}.project-settings`,
        metaDefinition: {
          order: ["id", "name"],
          propertiesConfig: {
            id: {
              label: "Plugin ID",
              helpText: "",
              unique: false,
              inputType: "text",
            },
            name: {
              label: "Plugin name",
              helpText: "",
              unique: false,
              inputType: "text",
            },
          },
        },
        schemaDefinition: {
          additionalProperties: false,
          required: ["id"],
          type: "object",
          allOf: [
            {
              $ref: "#/components/schemas/AbstractContentTypeSchemaDefinition",
            },
            {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  minLength: 1,
                  pattern: "^[a-z0-9.-]+$",
                },
                name: {
                  type: "string",
                  minLength: 1,
                },
              },
            },
          ],
        },
      },
    },
  }).then((values) => {
    if (!values) return;
    exportProject(values.id, values.name, toast);
  });
};

export const getDownloadElement = ({ openSchemaModal, toast }) => {
  const exportElement = document.createElement("div");

  exportElement.innerHTML = /*html*/ `
    <button 
      type="button" 
      class="flotiq-ide-tooltip flotiq-ide-tooltip--blue" 
      id="${pluginInfo.id.replaceAll(".", "-")}-download"
    >
      Export source code
      <div class="flotiq-ide-tooltip__popup" data-pos="botom left">
        Click here to download the project as a zip file      
      </div>
    </button>
  `;

  const btn = exportElement.querySelector(
    `#${pluginInfo.id.replaceAll(".", "-")}-download`,
  );

  btn.onclick = () => onDownload(openSchemaModal, toast);

  return exportElement;
};

const onDownloadJson = function () {
  const filename = "flpotiq-plugin.json";
  const element = document.createElement("a");
  const projectText = JSON.stringify(
    JSON.parse(localStorage[pluginInfo.id]),
    null,
    2,
  );
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(projectText),
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

export const getDownloadJsonElement = () => {
  const exportElement = document.createElement("div");

  exportElement.innerHTML = /*html*/ `
    <button 
      type="button" 
      class="flotiq-ide-tooltip flotiq-ide-tooltip--green" 
      id="${pluginInfo.id.replaceAll(".", "-")}-save"
    >
      Save project file
      <div class="flotiq-ide-tooltip__popup">
        Click here to save the project file. You can later import it to the Flotiq IDE.
      </div>
    </button>
  `;

  const btn = exportElement.querySelector(
    `#${pluginInfo.id.replaceAll(".", "-")}-save`,
  );

  btn.onclick = onDownloadJson;

  return exportElement;
};

export const getUploadJsonElement = (onLodalSettingsChange) => {
  const exportElement = document.createElement("div");

  exportElement.innerHTML = /*html*/ `
    <button type="button" class="flotiq-ide-tooltip" id="${pluginInfo.id.replaceAll(".", "-")}-load">
      Load project file
      <div class="flotiq-ide-tooltip__popup">
        Click here to load previously exported project file.
      </div>
    </button>
    <input type="file" id="${pluginInfo.id.replaceAll(".", "-")}-file" style="display: none;" />
  `;

  const btn = exportElement.querySelector(
    `#${pluginInfo.id.replaceAll(".", "-")}-load`,
  );
  const fileInput = exportElement.querySelector(
    `#${pluginInfo.id.replaceAll(".", "-")}-file`,
  );
  btn.onclick = () => fileInput.click();

  fileInput.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target.result;
      localStorage[pluginInfo.id] = JSON.stringify(JSON.parse(content));
      onLodalSettingsChange();
    };

    reader.readAsText(file);
  };

  return exportElement;
};

export const getClearElement = (onLodalSettingsChange) => {
  const exportElement = document.createElement("div");

  exportElement.innerHTML = /*html*/ `
    <button 
      type="button" 
      class="flotiq-ide-tooltip flotiq-ide-tooltip--red" 
      id="${pluginInfo.id.replaceAll(".", "-")}-clear"
    >
      Clear project
      <div class="flotiq-ide-tooltip__popup" data-pos="botom right">
        Click here to clear the project. This action cannot be undone!
      </div>
    </button>
  `;

  const btn = exportElement.querySelector(
    `#${pluginInfo.id.replaceAll(".", "-")}-clear`,
  );

  btn.onclick = () => {
    localStorage[pluginInfo.id] = "{}";
    onLodalSettingsChange();
  };

  return exportElement;
};
