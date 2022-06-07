import React from 'react'
import { css } from "@emotion/core";
import Box, { SharedBoxProps } from "../base/Box";
import { useConfig } from "../hooks/configHooks";
import useIsClient from "../hooks/useIsClient";
import { CssSize } from "../types";
import { getTypographyCss } from "../typography";
import { transparent } from "../utils/colorUtils";
import { mergeProps } from "../utils/deepMerge";
import { Icon, IconName } from "./Icon";

type Props = SharedBoxProps & {
  children?: React.ReactNode;
  color?: string;
  align: "center" | undefined;
  variant: "secondary" | undefined;
  secondaryBackgroundAlpha?: number;
  badgeRadius?: CssSize;
  padding?: CssSize;
  iconName?: IconName;
  iconPosition?: "left" | "right";
  CSS?: any;
  noWrap?: boolean;
};

const Badge = (props: Props) => {
  const config = useConfig();
  const {
    children,
    align,
    variant,
    secondaryBackgroundAlpha = 1.0,
    badgeRadius,
    color,
    iconName,
    padding = "0.35em 0.8em",
    iconPosition = "right",
    CSS: externalCSS,
    noWrap,
    ...otherProps
  } = mergeProps(config.Badge, props);

  const isClient = useIsClient();

  const colorTransparent = transparent(color, secondaryBackgroundAlpha);

  const mainCSS = css`
    ${getTypographyCss("Badge", config, props)}
    flex: 0 999 auto;
    width: auto;
    overflow: hidden;
    ${align === "center"
      ? `
      margin: 0 auto;
      text-align: center;
      `
      : ""}
    border-radius: ${badgeRadius};
    padding: ${padding};
    ${variant === "secondary"
      ? `color: ${color};
      background-color: ${colorTransparent};`
      : `color: white;
      background-color: ${color};`}
    >div {
      width: 100%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    span {
      ${noWrap
        ? `
      white-space: nowrap;
      word-break: break-word;
      text-overflow: ellipsis;
      overflow: hidden;
    `
        : ""}
    }
  `;

  const icon = iconName && (
    <Icon
      style={iconPosition === "left" ? { marginRight: ".3em" } : { marginLeft: ".3em" }}
      name={iconName}
      size="1.1em"
      color={color}
    />
  );

  return (
    <Box
      style={{
        ...(isClient ? {} : { visibility: "hidden" }),
      }}
      key={isClient ? "client" : "server"}
      css={[mainCSS, externalCSS]}
      {...otherProps}
    >
      <div>
        {iconPosition === "left" && icon}
        <span>{children}</span>
        {iconPosition === "right" && icon}
      </div>
    </Box>
  );
};

export default Badge;
