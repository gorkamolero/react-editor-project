import React from "react";
import { UIKitCSSProperties } from "../base/Box";
import { useBreakpoint, useConfig } from "../hooks/configHooks";
import { CardProps } from "../layout/Card";
import Grid from "../layout/Grid";
import Stack from "../layout/Stack";
import SubtleCard from "../layout/SubtleCard";
import { CssSize } from "../types";
import { P1 } from "../typography";
import { mergeProps } from "../utils/deepMerge";
import { IconName } from "./Icon";
import IconBadge from "./IconBadge";

type CalloutProps = {
  title?: string;
  body?: string;
  icon?: IconName;
  iconSize?: CssSize;
  color?: string;
  padding?: CssSize;
  style?: UIKitCSSProperties;
  children?: React.ReactNode;
} & CardProps;

const Callout = (props: CalloutProps) => {
  const config = useConfig();
  const hit = useBreakpoint(480);

  const { title, body, icon, iconSize, color, padding, style, children, ...otherProps }: CalloutProps = mergeProps(
    config.Callout,
    props
  );

  // titleColor;
  // bodyColor;

  return (
    <SubtleCard inline p={padding} background={color} style={style} {...otherProps}>
      <Grid gap={2.5} columns={!icon ? "1fr" : `${iconSize} 1fr`} vAlign="center" mb={hit ? 1 : 1.5}>
        {icon && <IconBadge name={icon} color={color} size={iconSize} />}
        {title && (
          <P1 style={{ fontWeight: 600 }} color={color}>
            {title}
          </P1>
        )}
      </Grid>
      <Grid gap={2.5} columns={!icon || hit ? "1fr" : `${iconSize} 1fr`}>
        {icon && <div />}
        <Stack vertical gap={1} w="100%">
          {body && <P1 color={color}>{body}</P1>}
          {children && <div style={{ marginTop: 10, width: "100%" }}>{children}</div>}
        </Stack>
      </Grid>
    </SubtleCard>
  );
};

export default Callout;
