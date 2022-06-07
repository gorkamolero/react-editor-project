import React, { forwardRef } from "react";
import { useConfig } from '../hooks/configHooks'
import { CssSize } from "../types";
import { mergeProps } from "../utils/deepMerge";
import Button, { Ref, ButtonProps } from "./Button";

export type CircleButtonProps = ButtonProps & {
  size?: CssSize;
  iconSize?: CssSize;
};

const CircleButton = forwardRef<Ref, CircleButtonProps>((props, ref) => {
  const config = useConfig();

  const { size, iconSize, style: providedStyle, children, ...otherProps } = mergeProps(config.CircleButton, props);

  return (
    <Button
      iconSize={iconSize}
      radius={size}
      padding={0}
      style={{
        width: size,
        height: size,
        ...providedStyle,
      }}
      ref={ref}
      {...otherProps}
    >
      {children}
    </Button>
  );
});

CircleButton.displayName = "CircleButton";

export default CircleButton;
