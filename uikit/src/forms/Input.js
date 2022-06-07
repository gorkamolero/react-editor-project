/** @jsxImportSource @emotion/react */
import { css } from "@emotion/core";
import React, { useRef, useState } from "react";
import { Icon } from "../components/Icon";
import Spinner from "../components/Spinner";
import { useConfig } from "../hooks/configHooks";
import { P1, P3 } from "../typography";
import { getFontSize, getLetterSpacing } from "../utils";
import { transparent } from "../utils/colorUtils";
import parseSize from "../utils/parseSize";
import DropDownMenu from "./DropDownMenu";
import { iconWrapperStyle, inputComponentGeneralCss, inputWrapperGeneralStyle, messageCSS } from "./shared";

const Input = React.forwardRef((props, ref) => {
  const [focus, setFocus] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  const config = useConfig();

  const {
    width: widthConfig,
    color: configColor,
    colorFocus,
    colorError,
    outlineAlpha,
    outlineWidth,
    colorSuccess,
    placeholderColor,
    borderWidth,
    iconColor: iconColorConfig,
    iconSide: configIconSide,
    iconSize: configIconSize,
    spinnerSize: configSpinnerSize,
    spinnerStroke: configSpinnerStroke,
    iconTextPadding,
    iconStrokeWidth,
  } = config.Input;

  // when adding props, also update the nativeInputProps below
  const {
    color = configColor,
    background,
    component: Component = "input",
    icon,
    iconColor: providedIconColor = iconColorConfig,
    iconSide = configIconSide,
    iconSize = configIconSize,
    spinnerSize = configSpinnerSize,
    spinnerStroke = configSpinnerStroke,
    height,
    loading,
    width = widthConfig,
    maxWidth = "100%",
    suggestions,
    suggestionsNames,
    suggestionsDetails,
    suggestionsIcons,
    suggestionsImages,
    suggestionsIconsSize,
    suggestionsImagesSize,
    onSuggestionClick,
    onSubmit,
    onBlur: providedOnBlur,
    style,
    wrapperStyle,
    fontSize: providedFontSize,
    externalWrapperStyle: providedExternalWrapperStyle,
    error = false,
    success, // success message
    required,
    label,
    fixedSpaceForErrors,
    children,
    ...nativeInputProps
  } = props;

  const colorFocusAlpha = transparent(colorFocus, outlineAlpha);

  const colorErrorAlpha = transparent(colorError, outlineAlpha);

  const focusStyle = (() => {
    if (error && colorError && focus && colorFocus)
      return {
        boxShadow: `inset 0 0 0 ${borderWidth} ${colorError},
        0 0 0 ${outlineWidth}px ${colorErrorAlpha}`,
      };

    if (error && colorError)
      return {
        boxShadow: `inset 0 0 0 ${borderWidth} ${colorError},
        0 0 0 0px ${colorErrorAlpha}`,
      };

    if (focus && colorFocus)
      return {
        boxShadow: `inset 0 0 0 ${borderWidth} ${colorFocus},
          0 0 0 ${outlineWidth}px ${colorFocusAlpha}`,
      };

    if (!colorError && !colorFocus) {
      return {
        boxShadow: `inset 0 0 0 ${borderWidth} ${color}`,
      };
    }

    return {
      boxShadow: `inset 0 0 0 ${borderWidth} ${color},
        0 0 0 0px ${colorFocusAlpha}`,
    };
  })();

  const iconColor = (() => {
    if (error) return colorError;
    if (focus) return colorFocus;
    return providedIconColor;
  })();

  const externalWrapperStyle = {
    ...(width ? { width } : {}),
    ...(maxWidth ? { maxWidth } : {}),
    ...providedExternalWrapperStyle,
  };

  const inputWrapperStyle = {
    ...(background ? { background } : {}),
    ...focusStyle,
    ...inputWrapperGeneralStyle(config),
    ...(height ? { height } : {}),
    ...wrapperStyle,
  };

  const fontSize = `font-size: ${providedFontSize};` || getFontSize("Input", config);

  const inputCSS = css`
    ${inputComponentGeneralCss(config)}
    ${height ? `padding-top: ${config.Input.padding}; padding-bottom: ${config.Input.padding};` : ""}
    width: 100%;
    resize: none;
    ${fontSize}
    ${getLetterSpacing("Input", config)}
    ${icon || loading
      ? iconSide === "left"
        ? `padding-left: ${parseSize(iconTextPadding)};`
        : `padding-right: ${parseSize(iconTextPadding)};`
      : ""} 
    :disabled {
      opacity: 0.5;
    }
    ::placeholder {
      ${fontSize}
      ${getLetterSpacing("Input", config)}
      color: ${placeholderColor};
    }
  `;

  const iconWrapperCSS = css`
    ${iconWrapperStyle(config, iconSide)}
  `;

  // use the internal ref only when an external ref isn't provided
  const internalRef = useRef(null);
  const inputRef = ref || internalRef;

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onSubmit && onSubmit(event);
    }
  };

  return (
    <div style={externalWrapperStyle}>
      {label && <InputLabel required={required}>{label}</InputLabel>}
      <DropDownMenu
        fullWidth={true}
        show={focus}
        scrollable={true}
        options={suggestions}
        optionsNames={suggestionsNames}
        optionsDetails={suggestionsDetails}
        optionsIcons={suggestionsIcons}
        optionsImages={suggestionsImages}
        optionsIconsSize={suggestionsIconsSize}
        optionsImagesSize={suggestionsImagesSize}
        selectedOption={selectedSuggestion}
        setSelectedOption={(suggestionIndex) => {
          setSelectedSuggestion(suggestionIndex);
          if (suggestionsDetails) {
            onSuggestionClick(suggestions[suggestionIndex], suggestionIndex, suggestionsDetails[suggestionIndex]);
          } else {
            onSuggestionClick(suggestions[suggestionIndex], suggestionIndex);
          }
          inputRef.current && inputRef.current.blur();
        }}
      >
        <div style={inputWrapperStyle}>
          <Component
            ref={inputRef}
            onFocus={() => setFocus(true)}
            css={inputCSS}
            style={style}
            onKeyDown={handleKeyDown}
            onBlur={(e) => {
              providedOnBlur && providedOnBlur(e);
              setTimeout(() => setFocus(false), 200);
            }}
            {...nativeInputProps}
          />
          <div css={iconWrapperCSS}>
            {loading && <Spinner size={spinnerSize} stroke={spinnerStroke} />}
            {icon && !loading && <Icon name={icon} size={iconSize} color={iconColor} strokeWidth={iconStrokeWidth} />}
          </div>
          {children}
        </div>
      </DropDownMenu>

      {(() => {
        if (error && typeof error === "string") {
          return (
            <P3 CSS={messageCSS()} color={colorError}>
              {error}
            </P3>
          );
        }

        if (success && typeof success === "string") {
          return (
            <P3 CSS={messageCSS()} color={colorSuccess}>
              {success}
            </P3>
          );
        }

        if (fixedSpaceForErrors) {
          return (
            <P3 CSS={messageCSS()} color={colorError}>
              &#x2063;
            </P3>
          );
        }
      })()}
    </div>
  );
});

export const InputLabel = ({ children, required, style, color: providedColor, ...rest }) => {
  const config = useConfig();
  const color = providedColor || config.Input.labelColor;

  return (
    <P1
      CSS={css`
        ${getFontSize("Label", config)}
        ${getLetterSpacing("Label", config)}
        margin: 0 0 .2em;
      `}
      color={color}
      style={style}
      {...rest}
    >
      {children}
      {required ? <span style={{ color: "red" }}> *</span> : ""}
    </P1>
  );
};

Input.displayName = "Input";

export default Input;
