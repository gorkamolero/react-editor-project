import React from "react";
import Box, { SharedBoxProps, UIKitCSSProperties } from "../base/Box";
import { useConfig } from "../hooks/configHooks";
import { HorizontalAlign, VerticalAlign } from "../types";
import { mergeProps } from "../utils/deepMerge";

export type CardHeaderProps = SharedBoxProps & {
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

const CardHeader = (props: CardHeaderProps) => {
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
    bottomSheet,
    justChildren,
    ...otherProps
  }: CardHeaderProps = mergeProps(config.CardFooter, props);

  const { bottomSheetCardPadding } = config.Modal;

  if (justChildren) return children;

  const radius = providedRadius ?? inline ? smallRadius : bigRadius;

  const padding = (() => {
    if (providedPadding) return providedPadding;
    if (bottomSheet) return bottomSheetCardPadding;
    if (inline) return smallPadding;
    return bigPadding;
  })();

  const reversePadding = `-${padding} -${padding} ${padding}`;

  const flexStyle =
    props.align || props.vAlign
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
    borderBottom: border,
    borderRadius: `${radius} ${radius} 0 0`,
    ...flexStyle,
    ...providedStyle,
  } as UIKitCSSProperties;

  return (
    <Box style={style} {...otherProps}>
      {children}
    </Box>
  );
};

export default CardHeader;
