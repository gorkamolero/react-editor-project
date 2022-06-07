import { AnimateSharedLayout, motion, Transition } from "framer-motion";
import React, { useState } from "react";
import { UIKitCSSProperties } from "../base/Box";
import { useConfig, useTimeout } from "../hooks/configHooks";
import Grid, { GridProps } from "../layout/Grid";
import { mergeProps } from "../utils/deepMerge";
import { Icon, IconName } from "./Icon";

type SegmentedControlProps<OptionType> = {
  options: OptionType[];
  optionsNames?: string[];
  optionsIcons?: (IconName | undefined)[];
  active: OptionType | undefined;
  onOptionChange: (option: OptionType) => void;
  background?: string;
  gap?: string | number;
  radius?: string | number;
  padding?: string | number;
  spring?: Partial<Transition>;
  iconProps?: Partial<typeof Icon>;
  animationDelay?: number;
  buttonStyle?: UIKitCSSProperties;
  activeStyle?: UIKitCSSProperties;
  backdropStyle?: UIKitCSSProperties;
  style?: UIKitCSSProperties;
} & GridProps;

const SegmentedControl = <OptionType,>(props: SegmentedControlProps<OptionType>) => {
  const config = useConfig();

  const {
    options,
    optionsNames,
    optionsIcons,
    active,
    onOptionChange,
    background,
    gap,
    radius,
    padding,
    spring,
    iconProps,
    animationDelay = 0,
    buttonStyle: providedButtonStyle,
    activeStyle,
    backdropStyle: providedBackdropStyle,
    style,
    ...otherProps
  }: SegmentedControlProps<OptionType> = mergeProps(config.SegmentedControl, props);

  const [delayedActive, setDelayedActive] = useState(active);

  useTimeout(
    () => {
      setDelayedActive(active);
    },
    animationDelay,
    [active]
  );

  const num = options.length;
  const columns = new Array(num).fill("1fr").join(" ");

  const buttonStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    boxSizing: "border-box",
    outline: "none",
    border: "none",
    WebkitAppearance: "none",
    cursor: "pointer",
    borderRadius: radius,
    flex: 1,
    zIndex: 1,
    ...providedButtonStyle,
  } as UIKitCSSProperties;

  const backdropStyle = {
    ...buttonStyle,
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 0,
    ...providedBackdropStyle,
  } as UIKitCSSProperties;

  return (
    <AnimateSharedLayout>
      <Grid
        background={background}
        borderRadius={radius}
        padding={padding}
        gap={gap}
        align="stretch"
        columns={columns}
        style={style}
        {...otherProps}
      >
        {options.map((thisOption, i) => {
          const selected = thisOption === delayedActive;
          return (
            <div
              key={i}
              style={{
                position: "relative",
                display: "flex",
              }}
            >
              {selected && (
                <motion.div
                  layoutId="active-bg"
                  transition={{
                    layoutX: { type: "spring", ...spring },
                    layoutY: { duration: 0 },
                  }}
                  style={backdropStyle}
                />
              )}
              <button
                style={{ ...buttonStyle, ...(selected ? activeStyle : {}) }}
                onClick={() => {
                  onOptionChange(thisOption);
                }}
              >
                {optionsIcons && optionsIcons[i] && (
                  <Icon
                    // @ts-ignore
                    name={optionsIcons[i]}
                    color={selected ? activeStyle?.color || "white" : buttonStyle?.color || config.colors.c4}
                    {...iconProps}
                  />
                )}
                {optionsNames ? optionsNames[i] : thisOption}
              </button>
            </div>
          );
        })}
      </Grid>
    </AnimateSharedLayout>
  );
};

export const makeSegmentedButtonStyle = ({ i, last, selected, height }) => {
  return {
    borderTopRightRadius: i !== last && `0`,
    borderBottomRightRadius: i !== last && `0`,
    borderTopLeftRadius: i !== 0 && `0`,
    borderBottomLeftRadius: i !== 0 && `0`,
    margin: "0 1px",
    height: height,
    paddingRight: "0.5em",
    paddingLeft: "0.5em",
  };
};

export default SegmentedControl;
