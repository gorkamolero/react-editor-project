import React from "react";
import Box, { SharedBoxProps, v } from "../base/Box";
import { useBreakpoint, useConfig } from "../hooks/configHooks";
import { CssSize, DefaultBreakpoint, HorizontalAlign, VerticalAlign } from "../types";
import { translateAlignToFlex } from "../utils";
import { mergeProps } from "../utils/deepMerge";

export type StackProps = SharedBoxProps & {
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  inline?: boolean;
  onMouseEnter?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void;
  gap?: CssSize;
  breakGap?: CssSize;
  align?: HorizontalAlign | object;
  vAlign?: VerticalAlign | object;
  breakpoint?: DefaultBreakpoint;
  breakAt?: DefaultBreakpoint;
  centerAt?: DefaultBreakpoint;
  breakAlign?: HorizontalAlign;
  style?: React.CSSProperties;
  className?: string;
  noWrap?: boolean;
  vertical?: boolean;
};

type Ref = HTMLElement;

const Stack = React.forwardRef<Ref, StackProps>((props, ref) => {
  const config = useConfig();

  const {
    children,
    vertical: providedVertical = false,
    breakpoint: providedBreakpoint,
    breakAt,
    gap: providedGap,
    inline,
    align: providedAlign = "center",
    vAlign: providedVAlign = "center",
    breakAlign,
    breakGap,
    centerAt,
    noWrap = providedVertical,
    style,
    onClick,
    className,
    ...otherProps
  } = mergeProps(config.Stack, props);

  const breakpoint = providedBreakpoint || breakAt;

  const align = v(providedAlign, config);
  const vAlign = v(providedVAlign, config);

  const hits = useBreakpoint([breakpoint, centerAt]);

  const hitBreakingBreakpoint = breakpoint ? hits[0] : false;
  const hitCenteringBreakpoint = centerAt ? hits[1] : false;

  const correctGap = hitBreakingBreakpoint && typeof breakGap !== "undefined" ? breakGap : providedGap;

  const gap = v(correctGap, config);

  const vertical = hitBreakingBreakpoint ? true : providedVertical;

  const alignStyle = alignProperties(
    align,
    vAlign,
    vertical,
    hitCenteringBreakpoint,
    hitBreakingBreakpoint,
    breakAlign
  );

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: !vertical ? "row" : "column",
        flexWrap: noWrap ? "nowrap" : "wrap",
        gap,
        ...alignStyle,
        ...style,
      }}
      onClick={onClick}
      ref={ref}
      className={className}
      {...otherProps}
    >
      {children}
    </Box>
  );
});

export function alignProperties(align, vAlign, isVertical, forceCenter = false, hitBreakingBreakpoint, breakAlign) {
  const res: any = {};

  if (isVertical) {
    // flex-direction: column
    if (hitBreakingBreakpoint && breakAlign) {
      res.alignItems = translateAlignToFlex(breakAlign);
    } else if (forceCenter) {
      res.alignItems = "center";
    } else {
      res.alignItems = translateAlignToFlex(align);
    }
    if (vAlign) {
      // justify-content / top/bottom
      res.justifyContent = translateAlignToFlex(vAlign);
    }
  } else {
    // flex-direction: row
    if (hitBreakingBreakpoint && breakAlign) {
      res.justifyContent = translateAlignToFlex(breakAlign);
    }
    if (align) {
      // justify-content / left/right
      if (forceCenter) {
        res.justifyContent = "center";
      } else {
        res.justifyContent = translateAlignToFlex(align);
      }
    }
    if (vAlign) {
      // align-items / top/bottom
      res.alignItems = translateAlignToFlex(vAlign);
    }
  }

  return res;
}

Stack.displayName = "Stack";

export default Stack;
