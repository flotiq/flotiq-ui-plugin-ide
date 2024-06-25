import pluginInfo from "../../plugin-manifest.json";
import {
  addElementToCache,
  addObjectToCache,
  getCachedElement,
  removeCachedElement,
} from "../../common/plugin-element-cache";
import loader from "@monaco-editor/loader";

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
};

export const editorEventhandler = (editorEventName, options, refreshes) => {
  const defaultValue = options.defaultValue || `// Type your code here`;

  const cacheKey = `${pluginId}-${editorEventName}-editor`;
  let element = getCachedElement(cacheKey)?.element;

  if (!element) {
    element = document.createElement("div");
    element.innerHTML = `
          <details>
            <summary style="cursor: pointer">Inline IDE: <code>${editorEventName}</code></summary>
            <div style="position: absolute; background-color: white; height: 25rem;
                  padding: 1rem; z-index: 20; width: 50rem; border:2px solid black; ${options.containerStyles || ""}">
              <h4>Inline Flotiq IDE</h4>
              <div style="margin-bottom: 1rem">Event: <code>${editorEventName}</code>
              <div data-editor style="margin-bottom: 2rem; min-height: 300px; max-height: 20rem"></div>
            </div>
          </details>
        `;
    const editorElement = element.querySelector("[data-editor]");

    const monacoCacheKey = `${pluginId}-${editorEventName}-monaco`;

    element.addEventListener("flotiq.attached", () => {
      let monacoPromise = getCachedElement(monacoCacheKey);

      if (!monacoPromise) {
        monacoPromise = loader.init().then((monaco) => {
          const monacoEditor = monaco.editor.create(editorElement, {
            value:
              JSON.parse(localStorage[pluginId])?.[editorEventName] ||
              defaultValue,
            language: "javascript",
            theme: "vs-dark",
            lineNumbers: "off",
            automaticLayout: true,
          });

          monacoEditor.onDidFocusEditorText(() => {
            monacoEditor.addCommand(
              monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
              () => onSave(editorEventName, monacoEditor, refreshes),
            );
          });
        });

        addObjectToCache(monacoPromise, monacoCacheKey);
      }
    });

    addElementToCache(element, cacheKey, {}, () => {
      removeCachedElement(monacoCacheKey);
    });
  }

  return element;
};
