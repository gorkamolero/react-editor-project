import { css } from "@emotion/core";
import { getFontSize, getFontWeight, getLetterSpacing } from "../utils";

const messageCSS = (messageOnTopAt = null) => css`
  line-height: 1.3;
`;

function inputWrapperGeneralStyle(config) {
  return {
    position: "relative",
    boxSizing: "border-box",
    display: "block",
    width: "100%",
    paddingRight: "0",
    borderRadius: config.Input.radius,
    height: config.Input.height,
    background: config.Input.background,
    transition: "0.2s box-shadow",
  };
}

function inputComponentGeneralCss(config) {
  return css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    font-family: ${config.fonts.faces["Input"] || config.fonts.faces.normal || "inherit"};
    ${getFontSize("Input", config)}
    ${getFontWeight("Input", config)}
    ${getLetterSpacing("Input", config)}
    display: block;
    padding: 0 ${config.Input.padding};
    color: ${config.Input.textColor};
    outline: none;
    border-radius: ${config.Input.radius};
    border: none;
    text-align: left;
    background: transparent;
  `;
}

function iconWrapperStyle(config, iconSide) {
  return `
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    ${
      iconSide === "left"
        ? `
      justify-content: flex-start;
      left: 0;
      margin-left: ${config.Input.padding};
    `
        : ""
    }
    ${
      iconSide === "right"
        ? `
      justify-content: flex-end;
      right: 0;
      margin-right: ${config.Input.padding};
    `
        : ""
    }
    pointer-events: none;
  `;
}
export { messageCSS, inputWrapperGeneralStyle, inputComponentGeneralCss, iconWrapperStyle };
