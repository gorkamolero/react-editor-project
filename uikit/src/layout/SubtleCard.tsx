/** @jsxImportSource @emotion/react */
import Box, { SharedBoxProps, UIKitCSSProperties } from "../base/Box";
import { useConfig } from "../hooks/configHooks";
import useIsClient from "../hooks/useIsClient";
import { transparent } from "../utils/colorUtils";
import { mergeProps } from "../utils/deepMerge";

export type SubtleCardProps = {
  inline?: boolean;
  background?: string;
  alpha?: number;
  border?: string;
  children?: React.ReactNode;
  bigPadding?: string | number;
  smallPadding?: string | number;
  bigRadius?: string | number;
  smallRadius?: string | number;
  style?: UIKitCSSProperties;
} & SharedBoxProps;

const SubtleCard = (props: SubtleCardProps) => {
  const config = useConfig();
  const {
    inline,
    background,
    alpha,
    border,
    children,
    bigPadding,
    smallPadding,
    bigRadius,
    smallRadius,
    style: providedStyle,
    ...otherProps
  }: SubtleCardProps = mergeProps(config.SubtleCard, props);

  const isClient = useIsClient();

  const bgColor = transparent(background, alpha);

  const radius = inline ? smallRadius : bigRadius;
  const padding = inline ? smallPadding : bigPadding;

  const style = {
    ...(isClient ? {} : { visibility: "hidden" }),
    background: bgColor,
    boxSizing: "border-box",
    borderRadius: radius,
    ...providedStyle,
  } as UIKitCSSProperties;

  return (
    <Box key={isClient ? "client" : "server"} style={style} p={padding} {...otherProps}>
      {children}
    </Box>
  );
};

export default SubtleCard;
