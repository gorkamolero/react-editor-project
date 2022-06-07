import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import Box, { SharedBoxProps } from "../base/Box";
import { useConfig, useTimeout } from "../hooks/configHooks";
import { mergeProps } from "../utils/deepMerge";

type Props = SharedBoxProps & {
  animated?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  spring?: object;
  delay?: number;
  startAnimatingAfter?: number;
  animateOn?: object;
};

const AnimatedContainer = (props: Props) => {
  const config = useConfig();
  const {
    animated = true,
    style,
    children,
    spring,
    delay,
    startAnimatingAfter,
    animateOn: providedDeps,
    ...otherProps
  } = mergeProps(config.AnimatedContainer, props);

  const [animate, setAnimate] = useState(typeof startAnimatingAfter === "undefined");

  useTimeout(
    () => {
      setAnimate(true);
    },
    startAnimatingAfter,
    []
  );

  const deps = providedDeps ?? [children];

  const ref = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  const [scrollHeight, setScrollHeight] = useState<number | null>(null);
  const [innerScrollHeight, setInnerScrollHeight] = useState<number | null>(null);

  useEffect(() => {
    if (animated) {
      if (ref.current) {
        setScrollHeight(ref.current.scrollHeight);
      }
      if (innerRef.current) {
        setInnerScrollHeight(innerRef.current.scrollHeight);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  if (!animated) return children;

  return (
    <motion.div
      initial={{ height: "auto" }}
      animate={
        scrollHeight && animate ? { height: Math.min(scrollHeight, innerScrollHeight ?? 0) } : { height: "auto" }
      }
      transition={{ type: "spring", ...spring, delay: delay }}
      ref={ref}
      style={style}
    >
      <Box ref={innerRef} {...otherProps}>
        {children}
      </Box>
    </motion.div>
  );
};

AnimatedContainer.displayName = "AnimatedContainer";

export default AnimatedContainer;
