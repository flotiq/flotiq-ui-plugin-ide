import pluginInfo from "../../plugin-manifest.json";

export const onModeChange = (refreshes) => {
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

export const getChangeModeElement = (mode, refreshes) => {
  const infoElement = document.createElement("div");
  infoElement.textContent = `Now the manage mode is ${mode}. If you want to create a manage modal with form `;

  const modeButton = document.createElement("button");
  modeButton.textContent = "click here";
  modeButton.onclick = () => onModeChange(refreshes);
  modeButton.type = "button";
  modeButton.style.color = "green";

  infoElement.appendChild(modeButton);
  return infoElement;
};
