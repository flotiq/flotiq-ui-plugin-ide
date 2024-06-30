import pluginInfo from "../../plugin-manifest.json";
import {
  addElementToCache,
  addObjectToCache,
  getCachedElement,
  removeCachedElement,
} from "../../common/plugin-element-cache";
import loader from "@monaco-editor/loader";
import FlotiqPluginEvents from "inline:../../types/flotiq/events.d.ts";
import FlotiqApiClient from "inline:../../types/flotiq/api-client.d.ts";
import FlotiqGlobals from "inline:../../types/flotiq/globals.d.ts";
import FlotiqPluginsRegistry from "inline:../../types/flotiq/flotiq-registry.d.ts";
import CommonTypes from "inline:../../types/common.d.ts";
import { eventsEditorConfig } from "../events-config/events";
import { clearAllSimulatedCache } from "../../common/simulated-cache";

const pluginId = pluginInfo.id;

const onSave = (editorEventName, monacoEditor, refreshes) => {
  const ls = JSON.parse(localStorage[pluginId]);

  localStorage[pluginId] = JSON.stringify({
    ...ls,
    [editorEventName]: monacoEditor.getValue(),
  });

  refreshes.forEach((refresh) => {
    if (refresh) refresh();
  });

  clearAllSimulatedCache();
};

const loadExtraLibs = (monaco, extraLibs) => {
  const libUri = "ts:filename/events.d.ts";
  monaco.languages.typescript.javascriptDefaults.addExtraLib(
    [
      CommonTypes,
      FlotiqPluginEvents,
      FlotiqApiClient,
      FlotiqGlobals,
      FlotiqPluginsRegistry,
      "const client: FlotiqApiClient;",
      "const globals: FlotiqGlobals;",
    ].join("\n"),
    libUri,
  );

  const importLibUri = "ts:filename/const.d.ts";
  monaco.languages.typescript.javascriptDefaults.addExtraLib(
    extraLibs?.join("\n") || "",
    importLibUri,
  );
};

const loadMonaco = async (
  editorElement,
  editorEventName,
  defaultValue,
  extraLibs,
  refreshes,
) => {
  return loader.init().then((monaco) => {
    const monacoEditor = monaco.editor.create(editorElement, {
      value:
        JSON.parse(localStorage[pluginId])?.[editorEventName] || defaultValue,
      language: "javascript",
      theme: "vs-dark",
      lineNumbers: "off",
      automaticLayout: true,
      autoIndent: "full",
      tabSize: 2,
      detectIndentation: false,
    });

    monacoEditor.onDidBlurEditorText(() => {
      onSave(editorEventName, monacoEditor, refreshes);
      monaco.languages.typescript.javascriptDefaults.setExtraLibs("");
    });

    monacoEditor.onDidFocusEditorText(() => {
      loadExtraLibs(monaco, extraLibs);
      monacoEditor.addCommand(
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
        () => {
          onSave(editorEventName, monacoEditor, refreshes);
          monacoEditor.getAction("editor.action.formatDocument").run();
        },
      );
    });
  });
};

// Close all the details that are not targetDetail.
function setTargetDetail(targetDetail) {
  document.querySelectorAll("details.flotiq-ide").forEach((detail) => {
    if (detail !== targetDetail) {
      detail.open = false;
    }
  });
}

export const editorEventhandler = (
  editorEventName,
  editorAttachEvent,
  refreshes,
) => {
  const options = eventsEditorConfig[editorEventName] || {};

  const cacheKey = `${pluginId}-${editorEventName}-editor`;
  let element = getCachedElement(cacheKey)?.element;

  if (!element) {
    const docsHeading = editorEventName.replace(/[^\w-]/gm, "").toLowerCase();
    element = document.createElement("div");

    if (editorAttachEvent === "flotiq.form::add") {
      element.addEventListener("flotiq.attached", () => {
        element.parentNode.style.marginTop = "0";
      });
    }

    element.innerHTML = /* html */ `
      <details class="flotiq-ide">
        <summary>${editorEventName}</summary>
        <section style="${options.containerStyles || ""}">
          <h4>Inline Flotiq IDE</h4>
          <div style="margin-bottom: 1rem">
            Event: 
            <code>${editorEventName}</code>
            <a 
              href="https://flotiq.com/docs/panel/PluginsDevelopment/PluginDocs/5_Events/#${docsHeading}"
              target="_blank"
              rel="noreferrer"
            >
              (see documentation)
            </a>
            <div data-editor style="margin-bottom: 2rem; min-height: 300px; max-height: 20rem"></div>
        </section>
      </details>
    `;

    const detailsElement = element.querySelector("details");
    detailsElement.addEventListener("toggle", () => {
      if (detailsElement.open) setTargetDetail(detailsElement);
    });

    const editorElement = element.querySelector("[data-editor]");

    const monacoCacheKey = `${pluginId}-${editorEventName}-monaco`;

    element.addEventListener("flotiq.attached", () => {
      let monacoPromise = getCachedElement(monacoCacheKey);

      if (!monacoPromise) {
        monacoPromise = loadMonaco(
          editorElement,
          editorEventName,
          options.defaultValue || `// Type your code here`,
          options.extraLibs,
          refreshes,
        );

        addObjectToCache(monacoPromise, monacoCacheKey);
      }
    });

    addElementToCache(element, cacheKey, {}, async () => {
      const monacoEditorPromise = getCachedElement(monacoCacheKey);
      if (monacoEditorPromise) {
        const editor = await getCachedElement(monacoCacheKey);
        editor?.dispose();
      }
      removeCachedElement(monacoCacheKey);
    });
  }

  return element;
};
