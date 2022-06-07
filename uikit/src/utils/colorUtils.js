import tinycolor from "tinycolor2";

export function getColorFromCssVariable(color) {
  if (!color) return null;

  if (typeof color === "string" && color.includes("var(")) {
    const varName = color.replace("var(", "").replace(")", "");
    if (typeof window !== "undefined") {
      const computedColor = window.getComputedStyle(document.documentElement).getPropertyValue(varName);
      if (computedColor) {
        return computedColor.trim();
      }
    }
  }

  return color;
}

export function getColorLuminance(color) {
  return tinycolor(getColorFromCssVariable(color)).getLuminance();
}

export function transparent(color, alpha) {
  return tinycolor(getColorFromCssVariable(color)).setAlpha(alpha).toString();
}

export function getShadowColor(color, alpha) {
  const parsedColor = getColorFromCssVariable(color);
  const luminance = tinycolor(parsedColor).getLuminance();
  return tinycolor(parsedColor)
    .darken(100 - (100 - luminance * 25))
    .setAlpha(alpha)
    .toString();
}

export function lighten(color, lighten) {
  return tinycolor(getColorFromCssVariable(color)).lighten(lighten).toString();
}
