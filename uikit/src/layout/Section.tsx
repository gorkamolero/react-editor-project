import React from 'react'
import { forwardRef } from "react";
import Box, { SharedBoxProps, v } from "../base/Box";
import { useConfig } from "../hooks/configHooks";
import { translateAlignToFlex } from "../utils.js";
import { mergeProps } from "../utils/deepMerge";

export type SectionProps = SharedBoxProps & {
  background?: string;
  style?: React.CSSProperties;
  align?: string;
  center?: boolean;
  vAlign?: string;
  borderTop?: string;
  borderBottom?: string;
  skew?: string;
  noPadding?: boolean;
  noLateralPadding?: boolean;
  noBorder?: boolean;
  expandBackground?: string;
  first?: boolean;
  innerStyle?: string;
  id?: string;
};

const Section = forwardRef<HTMLElement, SectionProps>((props, ref) => {
  const config = useConfig();

  const { padding: layoutPadding, width: layoutWidth } = config.layout;

  const {
    children,
    center,
    flex,
    fd,
    flexDirection,
    align: providedAlign,
    vAlign: providedVAlign,
    padding,
    border,
    borderTop,
    borderBottom,
    skew,
    noPadding,
    noLateralPadding,
    background,
    noBorder,
    minHeight = 0,
    expandBackground,
    w,
    width: providedWidth = layoutWidth,
    first,
    style,
    innerStyle,
    id,
    zIndex = 1,
    ...otherProps
  } = mergeProps(config.Section, props);

  const width = v(providedWidth, config);

  const align = center ? "center" : translateAlignToFlex(providedAlign);
  const vAlign = center ? "center" : translateAlignToFlex(providedVAlign);

  const verticalPadding = noPadding ? 0 : v(padding, config);
  const horizontalPadding = noLateralPadding ? 0 : v(layoutPadding, config);
  const styleFlex = first ? "0 1 auto" : "1 0 auto";

  const expandBackgroundStyle = expandBackground
    ? {
        margin: `-${expandBackground} 0`,
        padding: `${expandBackground} 0`,
      }
    : {};

  const wrapperStyle = {
    zIndex: zIndex,
    boxSizing: "border-box",
    minHeight: minHeight,
    display: "flex",
    flex: styleFlex,
    ...style,
  };

  const backdropStyle: React.CSSProperties = {
    content: "",
    position: "absolute",
    background: background,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: zIndex ? zIndex - 1 : 0,
    borderTop: !noBorder && !first ? border || borderTop : "none",
    borderBottom: borderBottom,
    transform: skew ? `skewY(${skew})` : "",
    ...expandBackgroundStyle,
  };

  const childStyle = {
    width: width,
    maxWidth: "100%",
    margin: "0 auto",
    boxSizing: "border-box",
    display: flex || center ? "flex" : "block",
    flexDirection: flexDirection || fd ? flexDirection || fd : "column",
    alignItems: vAlign,
    justifyContent: align,
    zIndex: zIndex ? zIndex + 1 : 1,
    ...innerStyle,
  };

  return (
    <Box
      w={w || "100%"}
      position="relative"
      pt={verticalPadding}
      pb={verticalPadding}
      style={wrapperStyle}
      id={id}
      ref={ref}
      {...otherProps}
    >
      <Box pl={horizontalPadding} pr={horizontalPadding} style={childStyle}>
        {children}
      </Box>
      <div style={backdropStyle} />
    </Box>
  );
});

Section.displayName = "Section";

export default Section;
