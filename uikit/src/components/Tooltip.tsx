import React, { Fragment } from "react";
import { Tooltip as TippyTooltip } from "react-tippy";
import UIContextProvider from "../contexts/UIContextProvider";
import { useConfig, useDetectBrowser } from "../hooks";
import { CssSize } from "../types";
import { mergeProps } from "../utils/deepMerge";
import "./tooltip.css";

export type TooltipProps = {
  open?: boolean;
  title?: string;
  description?: string;
  hotkey?: string;
  arrow?: boolean;
  arrowSize?: "small" | "regular" | "big";
  position?: "top" | "bottom" | "left" | "right";
  sticky?: boolean;
  stickyDuration?: number;
  interactive?: boolean;
  interactiveBorder?: number;
  animation?: "shift" | "perspective" | "fade" | "scale" | "none";
  touchHold?: boolean;
  duration?: number;
  animateFill?: boolean;
  delay?: number;
  trigger?: "mouseenter" | "focus" | "click" | "manual";
  style?: React.CSSProperties;
  innerStyle?: React.CSSProperties;
  inertia?: boolean;
  hideOnClick?: boolean;
  offset?: number;
  gap?: CssSize;
  maxWidth?: CssSize;
  titleStyle?: React.CSSProperties;
  hotkeyStyle?: React.CSSProperties;
  descriptionStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  popperOptions?: object;
  multiple?: boolean;
  onRequestClose?: () => void;
  noMobile?: boolean;
  children?: React.ReactNode;
  content?: React.ReactNode;
};

const Tooltip = (props: TooltipProps) => {
  const config = useConfig();

  const {
    open,
    title,
    description,
    hotkey,
    gap,
    arrow,
    arrowSize,
    position,
    sticky,
    stickyDuration,
    interactive,
    interactiveBorder,
    maxWidth,
    animation,
    touchHold,
    duration,
    animateFill,
    delay,
    trigger,
    style,
    innerStyle,
    inertia,
    hideOnClick,
    offset,
    titleStyle,
    hotkeyStyle,
    descriptionStyle,
    contentStyle,
    popperOptions,
    multiple,
    noMobile,
    children,
    content,
    onRequestClose,
  } = mergeProps(config.Tooltip, props);

  const { hasTouch } = useDetectBrowser();

  if (!(title || description || hotkey)) return children;

  const contentComponent = (
    <div style={{ ...contentStyle, maxWidth: maxWidth }}>
      {(title || hotkey) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: description ? "3px" : "0px",
            gap,
          }}
        >
          {title && (
            <span
              style={{
                fontWeight: description ? 600 : 400,
                ...titleStyle,
                ...innerStyle,
              }}
            >
              {title}
            </span>
          )}
          {hotkey && <span style={hotkeyStyle}>{hotkey}</span>}
        </div>
      )}
      {description && (
        <span
          style={{
            ...descriptionStyle,
            fontSize: title || hotkey ? descriptionStyle.fontSize : titleStyle.fontSize,
            textAlign: title || hotkey ? "left" : "center",
            ...innerStyle,
          }}
        >
          {description}
        </span>
      )}
      {content && <Fragment>{content}</Fragment>}
    </div>
  );

  if (noMobile && hasTouch) return children;

  return (
    <TippyTooltip
      open={open}
      html={<UIContextProvider configOverrides={config}>{contentComponent}</UIContextProvider>}
      arrow={arrow}
      arrowSize={arrowSize}
      position={position}
      sticky={sticky}
      stickyDuration={stickyDuration}
      interactive={interactive}
      interactiveBorder={interactiveBorder}
      theme={"light"}
      animation={animation}
      // @ts-ignore
      touchHold={touchHold}
      duration={duration}
      animateFill={animateFill}
      delay={delay}
      trigger={trigger}
      style={{ ...style, lineHeight: 1 }}
      inertia={inertia}
      hideOnClick={hideOnClick}
      offset={offset}
      onRequestClose={onRequestClose}
      popperOptions={popperOptions}
      multiple={multiple}
    >
      {children}
    </TippyTooltip>
  );
};

export default Tooltip;
