import { motion } from "framer-motion";
import React, { CSSProperties, forwardRef, useState } from "react";
import tinycolor from "tinycolor2";
import Box, { SharedBoxProps, UIKitCSSProperties, v } from "../base/Box";
import FullLoader from "../components/FullLoader";
import GlowingEffect from "../components/GlowingEffect";
import { Icon, IconName } from "../components/Icon";
import Spinner from "../components/Spinner";
import { useConfig } from '../hooks/configHooks'
import useIsClient from "../hooks/useIsClient";
import { CssSize } from "../types";
import { getColorFromCssVariable, getColorLuminance } from "../utils/colorUtils";
import { mergeProps } from "../utils/deepMerge";

export type ButtonVariant = "white" | "secondary" | "line" | "link" | "small" | "pill" | string[];

export type ButtonProps = SharedBoxProps & {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: IconName | undefined;
  iconSize?: CssSize;
  zIndex?: number;
  fontSize?: CssSize;
  width?: CssSize;
  height?: CssSize;
  padding?: CssSize;
  border?: string;
  borderLuminanceThreshold?: number;
  shadow?: boolean;
  shadowSize?: string;
  shadowAlpha?: number;
  radius?: CssSize;
  iconSide?: "left" | "right";
  iconStroke?: CssSize;
  spinnerSize?: CssSize;
  spinnerStroke?: CssSize;
  iconGap?: CssSize;
  color?: string;
  hoverColor?: string;
  textColor?: string;
  backgroundColor?: string;
  backgroundAlpha?: number;
  backgroundChildren?: React.ReactNode;
  motionEffects?: object;
  baseStyle?: React.CSSProperties;
  iconStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  // boolean props
  glow?: boolean;
  loading?: boolean;
  softLoading?: boolean;
  stopPropagation?: boolean;
  autoFocus?: boolean;
  noStretch?: boolean;
  stretch?: boolean;
  submit?: boolean;
  disabled?: boolean;
  foregroundAccentColor?: boolean;
};

export type Ref = HTMLElement;

const Button = forwardRef<Ref, ButtonProps>((props, ref) => {
  const config = useConfig();

  const providedVariant = props.variant;

  // Take variant prop and return array
  const variants =
    typeof providedVariant === "string" ? [providedVariant] : Array.isArray(providedVariant) ? providedVariant : null;

  const variantProps = getVariantProps(variants, config, "Button");

  const mergedProps = mergeProps(config.Button, variantProps);

  const {
    children,
    onClick,
    as = "button",
    icon,
    iconSize,
    zIndex = 1,
    fontSize,
    width,
    height,
    padding,
    border: providedBorder,
    borderLuminanceThreshold,
    shadow,
    shadowSize,
    shadowAlpha,
    radius,
    iconSide,
    iconStroke,
    spinnerSize,
    spinnerStroke,
    iconGap,
    color: providedColor,
    hoverColor,
    textColor,
    backgroundColor: providedBackgroundColor,
    backgroundAlpha,
    backgroundChildren,
    motionEffects,
    baseStyle,
    iconStyle,
    style: providedStyle,
    // boolean props
    glow,
    loading = false,
    softLoading = false,
    stopPropagation = true,
    autoFocus = false,
    noStretch,
    stretch,
    submit,
    disabled,
    foregroundAccentColor,
    ...otherProps
  } = mergeProps(mergedProps, props);

  const isClient = useIsClient();

  const disabledButton = disabled || loading || softLoading;

  const [isHover, setIsHover] = useState(false);

  const color = hoverColor && isHover ? hoverColor : providedColor;

  // Background Color
  const accentColor = providedBackgroundColor || color;

  const backgroundLuminance = getColorLuminance(accentColor);
  const textColorLuminance = getColorLuminance(textColor);

  const lowContrast = isClient && Math.abs(textColorLuminance - backgroundLuminance) < 0.4;

  const highContrastTextColor = (() => {
    if (!lowContrast) return null;
    const contrast = textColorLuminance - backgroundLuminance;
    const hsl = tinycolor(getColorFromCssVariable(textColor)).toHsl();
    if (contrast > 0) {
      return tinycolor({ h: hsl.h, s: hsl.s, l: backgroundLuminance + (1 - Math.abs(contrast)) }).toHexString();
    } else {
      return tinycolor({ h: hsl.h, s: hsl.s, l: backgroundLuminance - (1 - Math.abs(contrast)) }).toHexString();
    }
  })();

  // Foreground Color
  const foregroundColor = (() => {
    if (loading) {
      return "transparent";
    } else {
      if (foregroundAccentColor) {
        return accentColor;
      }
      if (lowContrast) {
        return highContrastTextColor;
      }
    }
    return textColor;
  })();

  // Spinner Color
  const spinnerColor = (() => {
    if (foregroundAccentColor) {
      return accentColor;
    }
    if (lowContrast) {
      return highContrastTextColor;
    }
    return textColor;
  })();

  // Border
  const border = (() => {
    if (providedBorder === "none") return "none";
    if (borderLuminanceThreshold && isClient) {
      if (backgroundLuminance > borderLuminanceThreshold) {
        return providedBorder;
      } else {
        if (typeof backgroundAlpha === "undefined") {
          return `1px solid ${accentColor}`;
        } else {
          return "none";
        }
      }
    } else {
      return providedBorder;
    }
  })();

  // Handle stretch props
  const flexStyle = {
    ...(noStretch ? { flex: "0 0 auto" } : {}),
    ...(stretch ? { flex: "1 1 auto" } : {}),
  };

  // Typographic Style
  const typographyStyle = getTypographyStyle("Button", config);

  const additionalStyles = {
    ...(width ? { width: width } : {}),
    ...(height ? { height: height } : {}),
    ...(fontSize ? { fontSize: fontSize } : {}),
    ...(foregroundColor ? { color: foregroundColor } : {}),
  };

  const style = {
    ...resetsStyle,
    ...baseStyle,
    position: "relative",
    zIndex: zIndex,
    opacity: disabled ? 0.5 : 1,
    cursor: disabledButton ? "default" : "pointer",
    padding: padding,
    borderRadius: radius,
    ...flexStyle,
    ...typographyStyle,
    ...additionalStyles,
    ...providedStyle,
  };

  const backgroundStyle = {
    ...absolutePositioning,
    zIndex: -1,
    background: accentColor,
    border: border,
    opacity: backgroundAlpha,
    borderRadius: radius,
    overflow: "hidden",
  } as UIKitCSSProperties;

  const shadowStyle = {
    ...absolutePositioning,
    borderRadius: radius,
    zIndex: -2,
    boxShadow: shadowSize + " " + accentColor,
    opacity: shadowAlpha,
  };

  const motionProps = disabledButton ? {} : motionEffects ? { ...motionEffects } : {};

  const ButtonIcon = (props) => (
    <Icon
      name={icon}
      strokeWidth={iconStroke}
      color={foregroundColor}
      size={iconSize}
      style={{ zIndex: 1, position: "relative", ...iconStyle }}
      {...props}
    />
  );

  function handleClick(event) {
    if (onClick) {
      stopPropagation && event.stopPropagation();
      onClick && onClick(event);
    }
  }

  const hoverProps = hoverColor
    ? {
        onMouseEnter: () => setIsHover(true),
        onMouseLeave: () => setIsHover(false),
      }
    : {};

  return (
    <Box
      as={motion[as]}
      onClick={handleClick}
      style={style}
      type={submit ? "submit" : "button"}
      disabled={disabledButton}
      ref={ref}
      autoFocus={autoFocus}
      {...motionProps}
      {...otherProps}
      {...hoverProps}
    >
      {icon && iconSide === "left" && <ButtonIcon mr={children && iconGap ? iconGap : 0} />}
      {children && <div style={{ ...childrenStyle }}>{children}</div>}
      {icon && iconSide === "right" && <ButtonIcon ml={children && iconGap ? iconGap : 0} />}
      {loading && (
        <div style={spinnerWrapperStyle}>
          <Spinner center size={spinnerSize} stroke={spinnerStroke} color={spinnerColor} />
        </div>
      )}
      {/* Background */}
      <div style={backgroundStyle}>{backgroundChildren}</div>
      {/* Soft Loader */}
      <FullLoader style={{ zIndex: 0 }} loading={softLoading} color={spinnerColor} radius={radius} />
      {/* Glow */}
      {glow && <GlowingEffect color={accentColor} radius={radius} />}
      {/* Shadow */}
      {shadow && <div style={shadowStyle} />}
    </Box>
  );
});

Button.displayName = "Button";

export function getVariantProps(variants, config, key) {
  let variantProps = {};
  variants?.forEach((variant) => {
    if (config[key].variantProps[variant]) {
      variantProps = {
        ...variantProps,
        ...config[key].variantProps[variant],
      };
    }
  });
  return variantProps;
}

function getTypographyStyle(elem, config) {
  const f = config.fonts;

  const color = f.colors[elem] || f.colors.normal || "inherit";
  const fontFamily = f.faces[elem] || f.faces.normal || "inherit";
  const lineHeight = f.lineHeights[elem] || f.lineHeights.normal || "inherit";
  const fontSize = v(f.sizes[elem.toString()] || f.sizes.normal || "", config);
  const fontWeight = f.weights[elem.toString()] || f.weights.normal || "";
  const letterSpacing = f.letterSpacings[elem.toString()] || f.letterSpacings.normal || "";

  return {
    color: color,
    fontFamily: fontFamily,
    lineHeight: lineHeight,
    fontSize: fontSize,
    fontWeight: fontWeight,
    letterSpacing: letterSpacing,
  };
}

const absolutePositioning: CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

const childrenStyle: CSSProperties = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  zIndex: 1,
};
export const resetsStyle: CSSProperties = {
  boxSizing: "border-box",
  outline: "none", // TODO: reconsider for accessibility
  userSelect: "none",
  border: "none",
  background: "none",
};
const spinnerWrapperStyle: CSSProperties = {
  ...absolutePositioning,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export default Button;
