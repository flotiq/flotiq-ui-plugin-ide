import JSZip from "jszip";
import pluginInfo from "../../plugin-manifest.json";
import { exportTemplates } from "../handlebars";
import { eventsExportParser } from "../events-config/events";

const repoLink =
  "https://codeload.github.com/flotiq/flotiq-ui-plugin-templates-plain-js/zip/refs/tags/0.1.2";

const loadZip = async (url) => {
  const jszip = new JSZip();
  return fetch(url)
    .then((res) => res.arrayBuffer())
    .then((arrayBuffer) => {
      return jszip.loadAsync(arrayBuffer);
    })
    .then((zip) => {
      return zip;
    });
};

const removeMatchedFiles = (zip, regExp) => {
  Object.keys(zip.files)
    .filter((key) => key.match(regExp))
    .forEach((key) => {
      zip.remove(key);
    });
};

const renameFiles = async (zip, newProjectName, oldProjectName) => {
  await Promise.all(
    Object.values(zip.files)
      .filter(({ dir }) => !dir)
      .map(async (fileData) => {
        const newPath = fileData.name.replace(/[^/]+/, newProjectName);
        return zip
          .file(fileData.name)
          .async("string")
          .then((fileContent) => {
            zip.file(newPath, fileContent);
          });
      }),
  );

  console.log(oldProjectName, "old project name");
  zip.remove(oldProjectName);
};

const getHandlersCode = () => {
  let handlersCode = "";

  const ls = JSON.parse(localStorage[pluginInfo.id]) || {};
  const mode = ls.mode;

  Object.entries(ls)
    .filter(([key, value]) => key !== "mode" && value)
    .forEach(([key, value]) => {
      let eventCode = value;

      if (eventsExportParser[key]) {
        eventCode = eventsExportParser[key](value, mode);
      }

      if (eventCode)
        handlersCode += exportTemplates.defaultHandler({
          eventName: key,
          eventCode,
        });
    });

  return handlersCode;
};

const downloadZip = (zip, repoName) => {
  const blob = new Blob([zip], { type: "application/json" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${repoName}.zip`;
  a.click();
};

export const exportProject = async (id, name) => {
  try {
    const zip = await loadZip(
      "https://corsproxy.io/?" + encodeURIComponent(repoLink),
    );

    removeMatchedFiles(zip, /\/plugins\/(?!index).+/);

    const [githubRepoName] = Object.keys(zip.files)[0].match(/[^/]+/);

    if (githubRepoName !== id) {
      await renameFiles(zip, id, githubRepoName);
    }

    const indexCode = exportTemplates.index({
      handlersCode: getHandlersCode(),
    });
    zip.file(`${id}/plugins/index.js`, indexCode);

    const newManifest = exportTemplates.manifest({ id, name });
    zip.file(`${id}/plugin-manifest.json`, newManifest);

    zip.generateAsync({ type: "uint8array" }).then((file) => {
      downloadZip(file, id);
    });
  } catch (e) {
    console.log(e);
    console.log("Something occured, try again");
  }
};
