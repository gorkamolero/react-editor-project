import React, { HTMLAttributes, useState } from "react";
import Box, { SharedBoxProps, UIKitCSSProperties } from "./base/Box";
import { useConfig } from "./hooks/configHooks";

type TableProps = SharedBoxProps & {
  minWidth?: string;
  style?: UIKitCSSProperties;
};

export const Table = ({ children, minWidth, style: providedStyle, ...otherProps }: TableProps) => {
  const config = useConfig();

  const { style } = config.Table;

  const wrapperStyle = {
    display: "block",
    overflowX: "auto",
    whiteSpace: "nowrap",
    maxWidth: "100%",
    ...style,
  };

  const tableStyle = {
    borderSpacing: "0",
    margin: "0",
    padding: "0",
    overflow: "hidden",
    width: "100%",
    maxWidth: "100%",
    minWidth: minWidth,
    ...providedStyle,
  };

  return (
    <Box style={wrapperStyle} {...otherProps}>
      <table style={tableStyle}>
        <tbody>{children}</tbody>
      </table>
    </Box>
  );
};

export const Tr = ({
  children,
  last,
  style: providedStyle,
  ...otherProps
}: {
  children: React.ReactNode;
  last?: boolean;
  style?: UIKitCSSProperties;
} & HTMLAttributes<HTMLTableRowElement>) => {
  const config = useConfig();
  const [isHovering, setIsHovering] = useState(false);

  const { cellStyle, lastCellStyle } = config.Table;
  const { style, hoverStyle } = config.Tr;

  const computedStyle = {
    ...cellStyle,
    ...style,
    ...(last ? lastCellStyle : {}),
    ...(isHovering ? hoverStyle : {}),
    ...providedStyle,
  };

  return (
    <tr
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={computedStyle}
      {...otherProps}
    >
      {children}
    </tr>
  );
};

export const Th = ({
  children,
  last,
  style: providedStyle,
  ...otherProps
}: {
  children: React.ReactNode;
  last?: boolean;
  style?: UIKitCSSProperties;
} & HTMLAttributes<HTMLTableCellElement>) => {
  const config = useConfig();
  const [isHovering, setIsHovering] = useState(false);

  const { cellStyle, lastCellStyle } = config.Table;
  const { style, hoverStyle } = config.Th;

  const computedStyle = {
    ...cellStyle,
    ...style,
    ...(last ? lastCellStyle : {}),
    ...(isHovering ? hoverStyle : {}),
    ...providedStyle,
  };

  return (
    <th
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={computedStyle}
      {...otherProps}
    >
      {children}
    </th>
  );
};

export const Td = ({
  children,
  last,
  style: providedStyle,
  ...otherProps
}: {
  children: React.ReactNode;
  last?: boolean;
  style?: UIKitCSSProperties;
} & HTMLAttributes<HTMLTableCellElement>) => {
  const config = useConfig();
  const [isHovering, setIsHovering] = useState(false);

  const { cellStyle, lastCellStyle } = config.Table;
  const { style, hoverStyle } = config.Td;

  const computedStyle = {
    ...cellStyle,
    ...style,
    ...(last ? lastCellStyle : {}),
    ...(isHovering ? hoverStyle : {}),
    ...providedStyle,
  };

  return (
    <td
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={computedStyle}
      {...otherProps}
    >
      {children}
    </td>
  );
};
