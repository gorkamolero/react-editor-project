import React, { forwardRef } from "react";
import ReactDOM from "react-dom";
import { useConfig } from '../hooks/configHooks'
import { mergeProps } from "../utils/deepMerge";
import { Ref, ButtonProps } from "./Button";
import CircleButton, { CircleButtonProps } from "./CircleButton";

export type Props = CircleButtonProps & {
  position?: { top?: number; bottom?: number; left?: number; right?: number };
};

const FloatingButton = forwardRef<Ref, ButtonProps>((props, ref) => {
  const config = useConfig();

  const { position, children, style: providedStyle, ...otherProps } = mergeProps(config.FloatingButton, props);

  const style = {
    position: "fixed",
    ...(typeof position.top !== "undefined" ? { top: parseFloat(position.top) + "px" } : {}),
    ...(typeof position.right !== "undefined" ? { right: parseFloat(position.right) + "px" } : {}),
    ...(typeof position.left !== "undefined" ? { left: parseFloat(position.left) + "px" } : {}),
    ...(typeof position.bottom !== "undefined"
      ? {
          bottom: `calc(${parseFloat(position.bottom) + "px"} + env(safe-area-inset-bottom))`,
        }
      : {}),
    ...providedStyle,
  };

  const bodyElement = document.querySelector("body");

  return bodyElement
    ? window &&
        ReactDOM.createPortal(
          <CircleButton style={style} ref={ref} {...otherProps}>
            {children}
          </CircleButton>,
          bodyElement
        )
    : null;
});

FloatingButton.displayName = "FloatingButton";

export default FloatingButton;
