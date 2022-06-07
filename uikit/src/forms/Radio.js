/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/core";
import { useConfig } from "../hooks/configHooks";
import useIsClient from "../hooks/useIsClient";
import { transparent } from "../utils/colorUtils";

const Radio = (props) => {
  const { checked, name, value } = props;

  const config = useConfig();
  const isClient = useIsClient();

  const {
    borderColor,
    colorNormal,
    colorChecked,
    shadowSize,
    shadowAlpha,
    colorDot,
    size,
    dotSize,
  } = config.Radio;

  const shadowColor = checked
    ? transparent(colorChecked, shadowAlpha)
    : transparent(borderColor, shadowAlpha);

  const radioWrapper = css`
    position: relative;
    width: ${size}px;
    height: ${size}px;
    border-radius: ${size}px;
    background: ${checked ? colorChecked : colorNormal};
    border: 1px solid ${checked ? colorChecked : borderColor};
    display: flex;
    box-shadow: ${shadowSize} ${shadowColor};
    flex: 0 0 ${size}px;
    ${checked
      ? css`
          span {
            margin: auto;
            width: ${dotSize}px;
            height: ${dotSize}px;
            border-radius: ${dotSize}px;
            background: ${colorDot};
          }
        `
      : ""}
    input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }
  `;

  return (
    <div
      style={{
        ...(isClient ? {} : { visibility: "hidden" }),
      }}
      key={isClient ? "client" : "server"}
      css={radioWrapper}
    >
      <input
        type="radio"
        value={value}
        name={name}
        checked={checked}
        onChange={() => {}}
      />
      <span />
    </div>
  );
};

export default Radio;
