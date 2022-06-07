/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/core";
import { useConfig } from "../hooks/configHooks";
import Box, { v } from "../base/Box";
import { mergeProps } from "../utils/deepMerge";
import { isDevBuild } from "../env";

const Divider = (props) => {
  const config = useConfig();

  const {
    color,
    size: providedSize = 6,
    width: providedWidth = "full",
    children,
    CSS: externalCSS,
    ...otherProps
  } = mergeProps(config.Divider, props);

  const size = config.sizes[providedSize] || v(providedSize, config);

  if (typeof size === "undefined") {
    if (isDevBuild) {
      throw new Error(`Size "${providedSize}" is not valid for Spacer.`);
    }
  }

  const widths = {
    small: "25%",
    medium: "50%",
    big: "75%",
    full: "100%",
  };

  const width = widths[providedWidth] || providedWidth;

  const mainCSS = css`
    width: 100%;
    border-bottom: 1px solid ${color};
    max-width: ${width};
    flex: 0 0 auto;
  `;

  return (
    <Box css={[mainCSS, externalCSS]} mt={size} mb={size} {...otherProps}>
      {children}
    </Box>
  );
};

export default Divider;
