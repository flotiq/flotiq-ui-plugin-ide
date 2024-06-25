const appRoots = {};

export const addElementToCache = (element, key, data = {}, onRemove = null) => {
  appRoots[key] = {
    element,
    data,
  };

  element.addEventListener("flotiq.detached", () => {
    setTimeout(() => {
      delete appRoots[key];
      if (onRemove) onRemove();
    }, 50);
  });
};

export const getCachedElement = (key) => {
  return appRoots[key];
};

export const removeCachedElement = (key) => {
  delete appRoots[key];
};

export const addObjectToCache = (data, key) => {
  appRoots[key] = data;
};

export const registerFn = (pluginInfo, callback) => {
  if (window.FlotiqPlugins?.add) {
    window.FlotiqPlugins.add(pluginInfo, callback);
    return;
  }
  if (!window.initFlotiqPlugins) window.initFlotiqPlugins = [];
  window.initFlotiqPlugins.push({ pluginInfo, callback });
};
