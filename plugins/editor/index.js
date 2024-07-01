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

  refreshes?.forEach((refresh) => {
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
    const value = JSON.parse(localStorage[pluginId])?.[editorEventName];

    const monacoEditor = monaco.editor.create(editorElement, {
      value: typeof value === "undefined" ? defaultValue : value,
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
    return monacoEditor;
  });
};

// Close all the details that are not targetDetail.
const setTargetDetail = (targetDetail) => {
  document.querySelectorAll("details.flotiq-ide").forEach((detail) => {
    if (detail !== targetDetail) {
      detail.open = false;
    }
  });
};

const resetToDefaultValue = (editor, defaultValue) => {
  if (!editor) return;
  editor.setValue(defaultValue);
  editor.focus();
};

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
        <summary>
          <code>${editorEventName}</code>
          <a
            href="https://flotiq.com/docs/panel/PluginsDevelopment/PluginDocs/5_Events/#${docsHeading}"
            target="_blank"
            rel="noreferrer"
          >
            (docs)
          </a> 
        </summary>
        <section style="${options.containerStyles || ""}">
          <div data-editor style="min-height: 400px;"></div>
          <button 
            data-default-code
            type="button" 
            class="flotiq-ide-default-code__button flotiq-ide-tooltip flotiq-ide-tooltip--borderless" 
          >
            <div class="flotiq-ide-default-code__icon"></div>
            <div class="flotiq-ide-tooltip__popup" data-pos="top right" data-color="white">
              Click here to reset to default value    
            </div>
          </button>
        </section>
      </details>
    `;

    const detailsElement = element.querySelector("details");
    detailsElement.addEventListener("toggle", () => {
      if (detailsElement.open) setTargetDetail(detailsElement);
    });

    const editorElement = element.querySelector("[data-editor]");
    const editorRefreshElement = element.querySelector("[data-default-code]");

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

        monacoPromise.then((editor) => {
          editorRefreshElement.onclick = () => {
            resetToDefaultValue(editor, options.defaultValue);
          };
        });

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
