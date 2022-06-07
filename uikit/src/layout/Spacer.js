import { css, jsx } from "@emotion/core";
import { useConfig } from "../hooks/configHooks";
import Box, { v } from "../base/Box";
import { mergeProps } from "../utils/deepMerge";

const Spacer = (props) => {
  const config = useConfig();
  const { size = "l", ...otherProps } = mergeProps(config.Spacer, props);

  let height;

  if (typeof size === "string") {
    height = config.sizes[size];

    if (typeof height === "undefined") {
      height = v(size, config);
    }
  } else {
    height = v(size, config);
  }

  const mainCSS = css`
    width: 100%;
    height: ${height};
    flex: 0 0 ${height};
  `;

  return <Box css={mainCSS} {...otherProps} />;
};

export default Spacer;
