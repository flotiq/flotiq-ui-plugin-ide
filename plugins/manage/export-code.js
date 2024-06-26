/* eslint-disable max-len */
import pluginInfo from "../../plugin-manifest.json";
import JSZip from "jszip";
import Handlebars from "handlebars";
import defaultHandlerTemplate from "inline:./templates/defaultHandler.hbs";
import manageFormHandlerTemplate from "inline:./templates/manageFormHandler.hbs";
import indexTemplate from "inline:./templates/index.hbs";
import manifestTemplate from "inline:./templates/manifest.hbs";

Handlebars.registerHelper("indent", function (data, indent) {
  const out = data.replace(/\n/g, "\n" + " ".repeat(indent));
  return new Handlebars.SafeString(out);
});

const templates = {
  index: Handlebars.compile(indexTemplate),
  defaultHandler: Handlebars.compile(defaultHandlerTemplate),
  manageFormHandler: Handlebars.compile(manageFormHandlerTemplate),
  manifest: Handlebars.compile(manifestTemplate),
};

const repoLink =
  "https://codeload.github.com/flotiq/flotiq-ui-plugin-templates-plain-js/zip/refs/tags/0.1.2";

const parseEventValue = {
  "flotiq.plugins.manage::form-schema": (schema, mode) => {
    if (mode !== "form") return;
    return templates.manageFormHandler({ schema });
  },
  "flotiq.plugins.manage::render": (code, mode) => {
    if (mode === "form") return;
    return code;
  },
};

export const getProject = async (id, name) => {
  const repoName = id.replace(/[^a-z0-9]|\s+|\r?\n|\r/gim, "_");

  try {
    const url = "https://corsproxy.io/?" + encodeURIComponent(repoLink);

    const jszip = new JSZip();

    const newZip = await fetch(url)
      .then((res) => res.arrayBuffer())
      .then((arrayBuffer) => {
        return jszip.loadAsync(arrayBuffer);
      })
      .then((zip) => {
        return zip;
      });

    const [githubRepoName] = Object.keys(newZip.files)[0].match(/[^/]+/);

    Object.keys(newZip.files)
      .filter((key) => key.match(/\/plugins\/(?!index).+/))
      .forEach((key) => {
        newZip.remove(key);
      });

    if (githubRepoName !== repoName) {
      await Promise.all(
        Object.values(newZip.files)
          .filter(({ dir }) => !dir)
          .map(async (fileData) => {
            const newPath = fileData.name.replace(/[^/]+/, repoName);

            return newZip
              .file(fileData.name)
              .async("string")
              .then((fileContent) => {
                newZip.file(newPath, fileContent);
                newZip.remove(fileData.name);
              });
          }),
      );

      Object.values(newZip.files)
        .filter(({ dir }) => dir)
        .forEach(({ name }) => {
          if (name.includes(githubRepoName)) newZip.remove(name);
        });
    }

    let pluginCode = "";

    const ls = JSON.parse(localStorage[pluginInfo.id]) || {};
    const mode = ls.mode;

    Object.entries(ls)
      .filter(([key, value]) => key !== "mode" && value)
      .forEach(([key, value]) => {
        let eventCode = value;

        if (parseEventValue[key]) {
          eventCode = parseEventValue[key](value, mode);
        }

        if (eventCode)
          pluginCode += templates.defaultHandler({ eventName: key, eventCode });
      });

    const indexCode = templates.index({ pluginCode });
    newZip.file(`${repoName}/plugins/index.js`, indexCode);

    const newManifest = templates.manifest({ id, name });
    newZip.file(`${repoName}/plugin-manifest.json`, newManifest);

    newZip.generateAsync({ type: "uint8array" }).then((file) => {
      console.log(file);
      const blob = new Blob([file], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${repoName}.zip`;
      a.click();
    });
  } catch (e) {
    console.log(e);
    console.log("Something occured, try again");
  }
};

export const onDownload = (openSchemaModal) => {
  openSchemaModal({
    title: "Fill information about your plugin",
    size: "lg",
    form: {
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
    getProject(values.id, values.name);
  });
};
