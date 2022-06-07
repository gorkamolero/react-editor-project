/** @jsxImportSource @emotion/react */
import { css } from "@emotion/core";
import { useState } from "react";
import { Icon } from "../components/Icon";
import { useConfig } from "../hooks/configHooks";
import { P3 } from "../typography";
import cleanedProps from "../utils/cleanedProps";
import { mergeProps } from "../utils/deepMerge";
import parseSize from "../utils/parseSize";
import { InputLabel } from "./Input";
import { iconWrapperStyle, inputComponentGeneralCss, inputWrapperGeneralStyle, messageCSS } from "./shared";

const Select = (props) => {
  const [focus, setFocus] = useState(false);

  const config = useConfig();

  const {
    width: widthConfig,
    color,
    colorFocus,
    colorError,
    placeholderColor,
    borderWidth,
    iconColor: iconColorConfig,
    iconStrokeWidth,
    labelColor,
  } = config.Input;

  const {
    icon,
    iconSide,
    iconSize,
    iconTextPadding,
    width,
    options,
    optionsNames,
    selectedOption,
    onSelect,
    onChange,
    wrapperStyle: providedWrapperStyle,
    style,
    selectStyle,
    error = false,
    required,
    placeholder,
    label,
  } = mergeProps(config.Select, props);

  const inputColor = (() => {
    if (error && colorError) return colorError;
    if (focus && colorFocus) return colorFocus;
    return color;
  })();

  const iconColor = (() => {
    if (error) return colorError;
    if (focus) return colorFocus;
    return iconColorConfig;
  })();

  const nativeInputProps = cleanedProps(props, [
    "options",
    "optionsNames",
    "placeholder",
    "selectedOption",
    "optionNames",
    "onSelect",
    "selectStyle",
  ]);

  const wrapperStyle = {
    ...(width ? { width } : {}),
    maxWidth: "100%",
    ...providedWrapperStyle,
  };

  const inputWrapperStyle = {
    ...inputWrapperGeneralStyle(config),
    boxShadow: `inset 0 0 0 ${borderWidth} ${inputColor}`,
    ...style,
  };

  const selectCSS = css`
    ${inputComponentGeneralCss(config)}
    ${icon
      ? iconSide === "left"
        ? `padding-left: ${parseSize(iconTextPadding)};`
        : `padding-right: ${parseSize(iconTextPadding)};`
      : ""} 
    appearance: none;
    ::placeholder {
      color: ${placeholderColor};
    }
  `;

  const iconWrapperCSS = css`
    ${iconWrapperStyle(config, iconSide)}
  `;

  const NO_VALUE = "";

  return (
    <div css={wrapperStyle}>
      {label && (
        <InputLabel color={labelColor} required={required}>
          {label}
        </InputLabel>
      )}
      <div style={inputWrapperStyle}>
        <select
          value={placeholder && !selectedOption ? NO_VALUE : selectedOption}
          onFocus={() => setFocus(true)}
          onBlur={() => setTimeout(() => setFocus(false), 200)}
          onChange={(e) => {
            if (onSelect) {
              if (e.target.value === NO_VALUE) {
                onSelect(null);
              } else {
                onSelect(e.target.value);
              }
            }
            onChange && onChange(e);
          }}
          css={selectCSS}
          {...nativeInputProps}
          style={selectStyle}
        >
          {placeholder && (
            <option disabled value={NO_VALUE}>
              {placeholder}
            </option>
          )}
          {options.map((option, index) => {
            return (
              <option key={index} value={option}>
                {optionsNames ? optionsNames[index] : option}
              </option>
            );
          })}
        </select>
        {icon && (
          <div css={iconWrapperCSS}>
            <Icon name={icon} size={iconSize} color={iconColor} strokeWidth={iconStrokeWidth} />
          </div>
        )}
        {error && typeof error === "string" && (
          <P3 css={messageCSS()} color={colorError}>
            {error}
          </P3>
        )}
      </div>
    </div>
  );
};

export default Select;
