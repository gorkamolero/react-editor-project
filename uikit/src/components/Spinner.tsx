/** @jsxImportSource @emotion/react */
import { css, keyframes } from "@emotion/core";
import Box, { SharedBoxProps } from "../base/Box";
import { useConfig } from "../hooks/configHooks";
import useIsClient from "../hooks/useIsClient";
import { CssSize } from "../types";
import { transparent } from "../utils/colorUtils";
import parseSize from "../utils/parseSize";

type SpinnerProps = SharedBoxProps & {
  size?: CssSize;
  center?: boolean;
  color?: string;
  stroke?: string;
  rotation?: string;
  style?: React.CSSProperties;
};

const Spinner = (props: SpinnerProps) => {
  const config = useConfig();

  const isClient = useIsClient();

  const { size: configSize, color: configColor, stroke: configStroke, rotation } = config.Spinner;

  const { center = false, size = configSize, color = configColor, stroke = configStroke, style, ...otherProps } = props;

  const strokeSize = parseSize(stroke);

  const color2 = transparent(color, 0.2);

  const rotate = keyframes`
    100% {
      transform: rotateZ(360deg);
    }
  `;

  const mainCSS = css`
    ${center
      ? css`
          position: absolute;
          top: calc(50% - ${parseInt(size) / 2}px);
          left: calc(50% - ${parseInt(size) / 2}px);
          margin: 0;
          padding: 0;
        `
      : ""}
    width: ${parseInt(size)}px;
    height: ${parseInt(size)}px;
    border-radius: ${parseInt(size)}px;
    border: ${strokeSize} solid ${color};
    border-color: ${color} ${color} ${color2} ${color2};
    animation: ${rotate} ${rotation} infinite linear;
    box-sizing: border-box;
  `;

  return (
    <Box
      style={{
        ...(isClient ? {} : { visibility: "hidden" }),
        ...style,
      }}
      key={isClient ? "client" : "server"}
      w={parseInt(size) + "px"}
      h={parseInt(size) + "px"}
      {...otherProps}
    >
      <div css={mainCSS} />
    </Box>
  );
};

export default Spinner;
