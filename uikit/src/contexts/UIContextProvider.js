import React from "react";
import GlobalStyleInjector from "../components/GlobalStyleInjector";
import Notifications from "../components/Notifications";
import { useConfigSetup } from "../hooks/configHooks";
import { UIContext } from "./contexts";

const UIContextProvider = (props) => {
  const { configOverrides, children, notifications } = props;

  const configSetup = useConfigSetup(configOverrides);

  return (
    <UIContext.Provider value={configSetup}>
      {typeof children === "function" ? children(configSetup) : children}
      <GlobalStyleInjector />
      {notifications && <Notifications />}
    </UIContext.Provider>
  );
};

export default UIContextProvider;
