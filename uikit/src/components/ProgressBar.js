import React from "react";
import { useConfig } from "../hooks/configHooks";
import Box, { v } from "../base/Box";
import { mergeProps } from "../utils/deepMerge";
import { motion } from "framer-motion";

const ProgressBar = (props) => {
  const { progress = 0.2 } = props;

  const config = useConfig();

  const {
    height,
    borderRadius: providedBorderRadius,
    innerBorderRadius: providedInnerBorderRadius,
    width: providedWidth,
    background,
    transition,
    color,
    ...otherProps
  } = mergeProps(config.ProgressBar, props);

  const width = v(providedWidth, config);
  const borderRadius = v(providedBorderRadius, config);
  const innerBorderRadius = v(providedInnerBorderRadius, config);
  const progressWidth = progress * 100 + "%";

  return (
    <Box
      background={background}
      width={width}
      height={height}
      borderRadius={borderRadius}
      overflow="hidden"
      {...otherProps}
    >
      <Box
        as={motion.div}
        animate={{ width: progressWidth }}
        transition={{ type: "spring", ...transition }}
        background={color}
        height={height}
        width={progressWidth}
        borderRadius={innerBorderRadius}
      />
    </Box>
  );
};

export default ProgressBar;
