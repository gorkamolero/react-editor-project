import { useContext, useState } from "react";
import { UIContext } from "../contexts/contexts";
import defaultConfig from "../defaultConfig";
import { updateAfterConfig } from "../globals";
import deepMerge from "../utils/deepMerge";
import wrapConfig from "../utils/wrapConfig";

function useConfigSetup(overrides) {
  const startConfig = deepMerge(defaultConfig, overrides);
  const [config, setConfig] = useState(startConfig);
  updateAfterConfig(config);

  function updateConfig(update) {
    const updatedConfig = deepMerge(config, update);
    setConfig(updatedConfig);
  }

  function resetConfig() {
    setConfig(startConfig);
  }

  return { config, updateConfig, resetConfig };
}

function useConfig() {
  const uiContext = useContext(UIContext);
  return wrapConfig(uiContext?.config ?? {});
}

function useUpdateConfig() {
  const uiContext = useContext(UIContext);
  const updateConfig = uiContext?.updateConfig ?? (() => {});
  return updateConfig;
}

function useResetConfig() {
  const uiContext = useContext(UIContext);
  const resetConfig = uiContext?.resetConfig ?? (() => {});
  return resetConfig;
}

export { useConfigSetup, useConfig, useUpdateConfig, useResetConfig };
