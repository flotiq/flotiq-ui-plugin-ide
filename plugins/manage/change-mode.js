import pluginInfo from "../../plugin-manifest.json";

export const onModeChange = (refreshes, value) => {
  const ls = JSON.parse(localStorage[pluginInfo.id]);
  if (ls.mode === value) return;
  localStorage[pluginInfo.id] = JSON.stringify({
    ...ls,
    mode: value,
  });

  refreshes.forEach((refresh) => {
    if (refresh) refresh();
  });
};

export const getChangeModeElement = (mode, refreshes) => {
  const infoElement = document.createElement("div");
  infoElement.classList.add("flotiq-ide-manage-mode");
  infoElement.innerHTML = `
    Select how your plugin is going to manage settings:
    <div>
      <label>
        <input type="radio" value="form" ${mode === "form" ? "checked" : ""} name="mode">
        via Form schema
      </label>
      <label style="margin-left: 0.25rem;">
        <input type="radio" value="custom" ${mode === "custom" ? "checked" : ""} name="mode">
        via Custom Html
      </label>
    </div>
  `;
  infoElement.querySelectorAll("input[name=mode]").forEach((input) => {
    input.addEventListener("change", () => {
      if (input.checked) {
        onModeChange(refreshes, input.value);
      }
    });
  });
  return infoElement;
};
