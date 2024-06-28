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
  exportElement.textContent = "To download the project ";

  const downloadButton = document.createElement("button");
  downloadButton.textContent = "click here";
  downloadButton.style.color = "blue";
  downloadButton.onclick = () => onDownload(openSchemaModal, toast);
  downloadButton.type = "button";

  exportElement.appendChild(downloadButton);
  return exportElement;
};
