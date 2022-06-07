import { responsiveBreakpoint } from "./globals";

/**
 * Translates a vertical or horizontal align into a Flex align-items / justify content.
 */
export function translateAlignToFlex(align) {
  const alignments = {
    center: "center",
    top: "flex-start",
    bottom: "flex-end",
    left: "flex-start",
    right: "flex-end",
    spaced: "space-between",
    even: "space-evenly",
    around: "space-around",
    stretch: "stretch",
    baseline: "baseline",
  };

  return alignments[align];
}

/**
 * Example:
 *
 * responsiveCss("margin-right", lateralPadding, true, " - 1px")
 *
 * This takes the "lateralPadding" responsive values, reverses them (the "true") and subtracts 1 px (" - 1px").
 */
export function responsiveCss(property, value, options) {
  const { negative, operation, breakPoint: providedBreakPoint } = options || {};

  const negSign = negative ? "-" : "";

  const breakPoint = providedBreakPoint || responsiveBreakpoint;
  const parsedBreakpoint = !isNaN(breakPoint) ? breakPoint + "px" : breakPoint;

  if (typeof value === "string" || typeof value === "number") {
    if (operation) {
      return `
        ${property}: calc( ${negSign}${value} ${operation});
      `;
    } else {
      return `
        ${property}: ${negSign}${value};
      `;
    }
  } else {
    if (operation) {
      return `
        ${property}: calc( ${negSign}${value[0]} ${operation});
        @media only screen and (max-width: ${parsedBreakpoint}) {
          ${property}: calc( ${negSign}${value[1]} ${operation});
        }
      `;
    } else {
      return `
        ${property}: ${negSign}${value[0]};
        @media only screen and (max-width: ${parsedBreakpoint}) {
          ${property}: ${negSign}${value[1]};
        }
      `;
    }
  }
}

export function getFontSize(elem, config) {
  const id = elem.toString();
  return responsiveCss("font-size", config.fonts.sizes[id] || config.fonts.sizes.normal || "");
}

export function getLetterSpacing(elem, config) {
  const id = elem.toString();
  return responsiveCss(
    "letter-spacing",
    config.fonts.letterSpacings[id] || config.fonts.letterSpacings.normal || ""
  );
}

export function getFontWeight(elem, config) {
  const id = elem.toString();
  return responsiveCss(
    "font-weight",
    config.fonts.weights[id] || config.fonts.weights.normal || ""
  );
}

export function unitMultiply(size, value) {
  if (typeof size === "string") {
    return `${parseFloat(size) * value}${size.slice(size.length - 2, size.length)}`;
  } else {
    return parseFloat(size) * value;
  }
}

export function unitAdd(size, value) {
  return `${parseFloat(size) + value}${size.slice(size.length - 2, size.length)}`;
}

export function getSidebarValue({ openCloseValues, sidebarState, sidebarOpen }) {
  /**
   * @example
   *
   * {
   *   openCloseValues: [
   *     [openValue, closeValue, "default"],
   *     [openValue, closeValue, "floating"],
   *     [openValue, closeValue, "fullscreen"]
   *   ],
   *   sidebarState: sidebarState,
   *   sidebarOpen: open
   * }
   */

  const st = sidebarState;
  const vs = openCloseValues;

  if (sidebarOpen) {
    if (vs.find((value) => value[2] === st)) {
      return vs.find((value) => value[2] === st)[0];
    } else {
      return vs.find((value) => value[2] === "default")[0];
    }
  } else {
    if (vs.find((value) => value[2] === st)) {
      return vs.find((value) => value[2] === st)[1];
    } else {
      return vs.find((value) => value[2] === "default")[1];
    }
  }
}
