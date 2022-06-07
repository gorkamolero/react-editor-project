import flatten from "lodash.flatten";
import React, { forwardRef } from "react";
import { useConfig } from "../hooks/configHooks";
import cleanedProps from "../utils/cleanedProps";
import Box, { booleanShortcuts, mapProperties, SharedBoxProps } from "./Box";

/**
 * Shared by all components that have Text as their base component.
 */
export type SharedTextProps = SharedBoxProps & {
  color?: string;
  font?: string;
  fontFamily?: string;
  fontSmoothing?: string;
  fontStyle?: string;
  letterSpacing?: string;
  lineHeight?: string;
  textDecoration?: string;
  textTransform?: string;
  verticalAlign?: string;
  whitespace?: string;
  wordBreak?: string;
  size?: string;
  fontSize?: string;
  align?: string;
  textAlign?: string;
  weight?: string;
  fontWeight?: string;
  noWrap?: boolean;
};

type Props = SharedTextProps & {};

type Ref = HTMLElement;

const Text = forwardRef<Ref, Props>((props: Props, ref) => {
  const { style: externalStyle, ...rest } = props;
  const externalProps = cleanedProps(rest, reservedPropNames);
  const config = useConfig();

  const wrapStyle = props.noWrap ? { overflow: "hidden", maxWidth: "100%" } : {};

  return (
    <Box
      as="p"
      ref={ref}
      style={{
        ...createStyles(props, config),
        ...wrapStyle,
        ...externalStyle,
      }}
      {...externalProps}
    />
  );
});

Text.displayName = "Tex";

const propertyMappings = [
  // font
  "font",
  "fontFamily",
  "fontSmoothing",
  "fontStyle",
  "letterSpacing",
  "lineHeight",
  "textAlign",
  "textDecoration",
  "textTransform",
  "verticalAlign",
  "whitespace",
  "wordBreak",
  // shortcuts
  ["size", "fontSize"],
  ["align", "textAlign"],
  ["weight", "fontWeight"],
];

// prettier-ignore
const reservedPropNames = [
  "bold", "italic",
].concat(
  flatten(propertyMappings.map(p => {
    if (typeof p === "string") return p;
    if (Array.isArray(p) && Array.isArray(p[1])) return p[0];
    if (Array.isArray(p) && !Array.isArray(p[1])) return p;
    return null;
  }))
);

function createStyles(props, config) {
  return {
    ...mapProperties(propertyMappings, props, config),
    ...booleanShortcuts(
      [
        ["bold", { fontWeight: "bold" }],
        ["italic", { fontStyle: "italic" }],
      ],
      props
    ),
  };
}

export default Text;
