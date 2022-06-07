import { useEffect, useState } from "react";
import { useConfig } from "../hooks";
import useIsClient from "../hooks/useIsClient";
import { transparent } from "../utils/colorUtils";
import { mergeProps } from "../utils/deepMerge";

const TopLoader = (props) => {
  const config = useConfig();

  const isClient = useIsClient();

  const [wasLoading, setWasLoading] = useState(false);

  const { color, height, duration, loading } = mergeProps(config.TopLoader, props);

  const [width, setWidth] = useState(0);
  const [opacity, setOpacity] = useState(0);
  const [transition, setTransition] = useState("0s");

  const color2 = transparent(color, 0.2);

  useEffect(() => {
    if (!loading && !wasLoading) {
      // START LOADING
      setTransition("0s");
      setWidth(0);
      setOpacity(0);
    } else if (loading && !wasLoading) {
      // LOADING
      setOpacity(1);
      setWidth(100);
      setTransition(`width ${duration} cubic-bezier(0.1, 0.1, 0, 1)`);
      setWasLoading(true);
    } else if (!loading && wasLoading) {
      // FINISH LOADING
      setWidth(99.9);
      setOpacity(0);
      setTransition("width 1s, opacity 1s");

      const resetAnimation = setTimeout(() => {
        setWidth(100);
        setTransition("0s");
        setWasLoading(false);
      }, 1000);

      return () => clearTimeout(resetAnimation);
    }
  }, [loading, wasLoading, width, transition, duration]);

  if (!isClient) return null;

  return (
    <div
      style={{
        position: "absolute",
        pointerEvents: "none",
        userSelect: "none",
        opacity: opacity,
        zIndex: "10",
        top: "0px",
        left: "0px",
        height: `${height}px`,
        width: `${width}%`,
        transition: transition,
        background: `linear-gradient(to right, ${color2}, ${color})`,
      }}
    />
  );
};

export default TopLoader;
