/** @jsxImportSource @emotion/react */
import { css } from "@emotion/core";
import { UIKitCSSProperties } from "..";
import Box, { SharedBoxProps } from "../base/Box";
import { useConfig } from "../hooks/configHooks";
import { CssSize } from "../types";
import { mergeProps } from "../utils/deepMerge";

type ThumbProps = {
  color?: string;
  size?: CssSize;
  shadow?: string;
};
type TrackProps = {
  background?: string;
  height?: CssSize;
  border?: string;
  style?: UIKitCSSProperties;
};

export type SliderProps = SharedBoxProps & {
  min: number;
  max: number;
  value: number;
  step?: number;
  onChange: (number) => void;
  thumb?: ThumbProps;
  track?: TrackProps;
  style?: UIKitCSSProperties;
};

const Slider = (props: SliderProps) => {
  const config = useConfig();

  const { thumb, track, min, max, value, step, onChange, style, ...otherProps }: SliderProps = mergeProps(
    config.Slider,
    props
  );

  const sliderCSS = css`
    -webkit-appearance: none;
    appearance: none;
    outline: none;
    width: 100%;
    border: ${track?.border};
    border-radius: ${track?.height};
    background: ${track?.background};
    height: ${track?.height};
    max-height: ${track?.height};
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: ${thumb?.size};
      height: ${thumb?.size};
      background: ${thumb?.color};
      border-radius: ${thumb?.size};
      box-shadow: ${thumb?.shadow};
      cursor: pointer;
    }
    &::-moz-range-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: ${thumb?.size};
      height: ${thumb?.size};
      background: ${thumb?.color};
      border-radius: ${thumb?.size};
      box-shadow: ${thumb?.shadow};
      cursor: pointer;
    }
  `;

  const handleChange = (event) => {
    onChange(parseInt(event.target.value));
  };

  return (
    <Box
      as="input"
      css={sliderCSS}
      style={style}
      type="range"
      // @ts-ignore
      min={min}
      max={max}
      value={value}
      step={step ?? 1}
      onChange={handleChange}
      {...otherProps}
    />
  );
};

export default Slider;
