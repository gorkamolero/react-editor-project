import { motion, Transition } from "framer-motion";
import React from "react";
import { UIKitCSSProperties } from "../base/Box";
import { useConfig } from '../hooks/configHooks'
import { mergeProps } from "../utils/deepMerge";
import { getVariantProps, resetsStyle } from "./Button";

type SwitchProps = {
  colorOn?: string;
  colorOff?: string;
  colorForeground?: string;
  spring?: Partial<Transition>;
  width?: number;
  height?: number;
  padding?: number;
  style?: UIKitCSSProperties;
  on?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children?: React.ReactNode;
  variant?: string | string[];
};

const Switch = (props: SwitchProps) => {
  const config = useConfig();

  const providedVariant: string | string[] | undefined = props.variant;

  // Take variant prop and return array
  const variants =
    typeof providedVariant === "string" ? [providedVariant] : Array.isArray(providedVariant) ? providedVariant : null;

  const variantProps: SwitchProps = getVariantProps(variants, config, "Switch");

  const mergedProps = mergeProps(config.Switch, variantProps);

  const {
    colorOn,
    colorOff,
    colorForeground,
    spring,
    width,
    height,
    padding,
    style,
    on,
    onClick,
    children,
    // @ts-ignore remove variantProps from otherProps
    variantProps: _v,
    ...otherProps
  }: SwitchProps = mergeProps(mergedProps, props);

  const nobSize = height && padding && height - padding * 2;

  const mainStyle: UIKitCSSProperties = {
    ...resetsStyle,
    background: on ? colorOn : colorOff,
    flex: "0 0 auto",
    width: width + "px",
    height: height + "px",
    borderRadius: height + "px",
    position: "relative",
    boxSizing: "border-box",
    transition: "0.2s",
    padding: padding + "px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: on ? "flex-end" : "flex-start",
    ...style,
  };

  const nobStyle: UIKitCSSProperties = {
    width: nobSize + "px",
    height: nobSize + "px",
    borderRadius: "50%",
    background: colorForeground,
    boxSizing: "border-box",
    boxShadow: "0px 1.5px 2.5px rgba(0, 0, 0, 0.22)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <button style={mainStyle} onClick={onClick} {...otherProps}>
      <motion.div
        layout
        transition={{
          layoutX: { type: "spring", ...spring },
          layoutY: { duration: 0 },
        }}
        style={nobStyle}
      >
        {children}
      </motion.div>
    </button>
  );
};

export default Switch;
