import React from "react";
import Box, { SharedBoxProps, UIKitCSSProperties } from "../base/Box";
import { useConfig } from "../hooks/configHooks";
import { HorizontalAlign, VerticalAlign } from "../types";
import { mergeProps } from "../utils/deepMerge";

export type CardFooterProps = SharedBoxProps & {
  inline?: boolean;
  children?: React.ReactNode;
  border?: string;
  background?: string;
  radius?: string | number;
  bigRadius?: string | number;
  smallRadius?: string | number;
  padding?: string | number;
  bigPadding?: string | number;
  smallPadding?: string | number;
  align?: HorizontalAlign | object;
  vAlign?: VerticalAlign | object;
  style?: UIKitCSSProperties;
  bottomSheet?: boolean;
  justChildren?: boolean;
};

const CardFooter = (props: CardFooterProps) => {
  const config = useConfig();

  const {
    inline,
    children,
    border,
    background,
    radius: providedRadius,
    bigRadius,
    smallRadius,
    padding: providedPadding,
    bigPadding,
    smallPadding,
    style: providedStyle,
    align,
    vAlign,
    bottomSheet,
    justChildren,
    ...otherProps
  }: CardFooterProps = mergeProps(config.CardFooter, props);

  const { bottomSheetCardPadding } = config.Modal;

  if (justChildren) return children;

  const radius = providedRadius ?? (inline ? smallRadius : bigRadius);

  const padding = (() => {
    if (providedPadding) return providedPadding;
    if (bottomSheet) return bottomSheetCardPadding;
    if (inline) return smallPadding;
    return bigPadding;
  })();

  const reversePadding = `${padding} -${padding} -${padding}`;

  const flexStyle =
    align || vAlign
      ? {
          display: "flex",
          flexDirection: "column",
        }
      : {};

  const style = {
    flex: "999 1 auto",
    background: background,
    padding: padding,
    margin: reversePadding,
    borderTop: border,
    borderRadius: bottomSheet ? "none" : `0 0 ${radius} ${radius}`,
    ...flexStyle,
    ...providedStyle,
  } as UIKitCSSProperties;

  return (
    <Box style={style} {...otherProps}>
      {children}
    </Box>
  );
};

export default CardFooter;
