import React from "react";
import { Icon } from "../components/Icon";
import { useConfig } from "../hooks/configHooks";
import useIsClient from "../hooks/useIsClient";
import { transparent } from "../utils/colorUtils";

const Checkbox = (props) => {
  const config = useConfig();
  const isClient = useIsClient();

  const { id, checked = false, onClick, tabIndex, style } = props;

  const {
    size,
    colorNormal,
    activeColor,
    borderColor,
    borderSize,
    shadowSize,
    shadowAlpha,
    radius,
    glyphSize: configGlyphSize,
    strokeWidth,
  } = config.Checkbox;

  const glyphSize = checked ? parseInt(configGlyphSize) : parseInt(configGlyphSize) - 20;

  const shadowColor = checked
    ? transparent(activeColor, shadowAlpha)
    : transparent(borderColor, shadowAlpha);

  const wrapperStyle = {
    position: "relative",
    width: `${size}px`,
    height: `${size}px`,
    cursor: "pointer",
    zIndex: "1",
    boxSizing: "border-box",
    display: "flex",
    flex: "0 0 auto",
    ...(isClient ? {} : { visibility: "hidden" }),
    ...style,
  };

  const nativeInputStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    cursor: "pointer",
    userSelect: "none",
    appearance: "none",
    border: "none",
    padding: 0,
    margin: 0,
    borderRadius: radius,
  };

  const inputStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: size + "px",
    height: size + "px",
    borderRadius: radius,
    background: checked ? activeColor : colorNormal,
    border: borderSize + " " + (checked ? activeColor : borderColor),
    boxSizing: "border-box",
    boxShadow: `${shadowSize} ${shadowColor}`,
  };

  return (
    <div style={wrapperStyle} key={isClient ? "client" : "server"} onClick={onClick}>
      <input
        type="checkbox"
        id={id}
        style={nativeInputStyle}
        checked={checked}
        tabIndex={tabIndex}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onClick();
          }
        }}
        onChange={() => {}} // We control with an external hook, but without the onChange
      />
      {checked && (
        <Icon
          size={`${glyphSize}%`}
          strokeWidth={strokeWidth}
          name="checkmark"
          color="white"
          style={{ margin: "auto", transition: "0.1s", zIndex: 1 }}
        />
      )}
      <div style={inputStyle} />
    </div>
  );
};

export default Checkbox;
