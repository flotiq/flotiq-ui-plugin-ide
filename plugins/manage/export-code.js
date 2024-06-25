import untar from "js-untar";
import pako from "pako";
import pluginInfo from "../../plugin-manifest.json";
import JSZip from "jszip";

const repoLink =
  "https://codeload.github.com/flotiq/flotiq-ui-plugin-templates-plain-js/zip/refs/tags/0.1.2";

const parseEventValue = {
  "flotiq.plugins.manage::form-schema": (value, mode) => {
    if (mode !== "form") return;
    return `
    const getFields = () => {
    ${value}
    };
    return {
        schema: {
            ...getFields(),
            id: pluginInfo.id,
          },
        };
    `;
  },
  "flotiq.plugins.manage::render": (value, mode) => {
    if (mode === "form") return;
    return value;
  },
};

export const getProject = async () => {
  try {
    const url = "https://corsproxy.io/?" + encodeURIComponent(repoLink);

    const jszip = new JSZip();

    const newZip = await fetch(url)
      .then((res) => res.arrayBuffer())
      .then((arrayBuffer) => {
        return jszip.loadAsync(arrayBuffer);
      })
      .then((zip) => {
        console.log("zip", zip);
        return zip;
      });

    console.log(newZip);

    //     const files = await fetch(url)
    //       .then((res) => res.arrayBuffer())
    //       .then(pako.inflate)
    //       .then((arr) => arr.buffer)
    //       .then(untar);

    Object.keys(newZip.files)
      .filter((key) => key.match(/\/plugins\/(?!index).+/))
      .forEach((key) => {
        newZip.remove(key);
      });

    const indexFileKey = Object.keys(newZip.files).find((key) =>
      key.includes("/plugins/index.js"),
    );

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
          pluginCode += `
        handler.on("${key}", (flotiqEvent) => {
        ${eventCode}
        });
                `;
      });

    const indexCode = `
    import { registerFn } from "../common/plugin-element-cache";
    import pluginInfo from "../plugin-manifest.json";

    registerFn(pluginInfo, (handler) => {
    ${pluginCode}
    });
        `;

    const decodedNewCode = new TextEncoder().encode(indexCode);

    newZip.file(indexFileKey, decodedNewCode);

    newZip.generateAsync({ type: "uint8array" }).then((file) => {
      const blob = new Blob([file], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "my-zip.zip";
      a.click();
    });
  } catch (e) {
    console.log(e);
    console.log("Something occured, try again");
  }
};
