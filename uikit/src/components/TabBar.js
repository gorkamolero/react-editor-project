/** @jsxImportSource @emotion/react */
import { css } from "@emotion/core";
import { Fragment, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import Box from "../base/Box";
import { useConfig, useWindow } from "../hooks";
import Grid from "../layout/Grid";
import SafeAreaInsetBottom from "../layout/SafeAreaInsetBottom";
import { P3 } from "../typography";
import { mergeProps } from "../utils/deepMerge";
import { Icon } from "./Icon";

const TabBar = (props) => {
  const config = useConfig();

  const { children, height, fullHeight, background, border, placeholder, ...otherProps } = mergeProps(
    config.TabBar,
    props
  );

  const ref = useRef(null);

  const [tabsNumber, setTabsNumber] = useState(1);

  useEffect(() => {
    if (ref.current) {
      setTabsNumber(ref.current.childElementCount);
    }
  }, [ref]);

  const columns = new Array(tabsNumber).fill("1fr").join(" ");

  const window = useWindow();

  const wrapperCSS = css`
    z-index: 8;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: ${fullHeight};
    min-height: ${fullHeight};
    background: ${background};
    border-top: ${border};
  `;

  const tabBarPlaceholderCSS = css`
    width: 100%;
    height: ${fullHeight};
    min-height: ${height};
  `;

  const tabBarPlaceholder = <div css={tabBarPlaceholderCSS} />;

  const TabBarInner = (
    <Box css={wrapperCSS} {...otherProps}>
      <Grid ref={ref} h={height} columns={columns} style={{ alignItems: "center", justifyItems: "center" }}>
        {children}
      </Grid>
      <SafeAreaInsetBottom />
    </Box>
  );

  return (
    <Fragment>
      {placeholder && tabBarPlaceholder}
      {window && ReactDOM.createPortal(TabBarInner, document.querySelector("body"))}
    </Fragment>
  );
};

export const TabBarTab = (props) => {
  const config = useConfig();

  const { height } = config.TabBar;
  const {
    children,
    active,
    icon,
    label,
    gap,
    color,
    activeColor,
    iconSize,
    iconStrokeWidth,
    fontSize,
    fontWeight,
    style,
    onClick,
    ...otherProps
  } = mergeProps(config.TabBar.tab, props);

  return (
    <Box
      h={height}
      flex
      fd="column"
      ai="center"
      jc="center"
      onClick={onClick}
      style={{ cursor: "pointer", ...style }}
      {...otherProps}
    >
      {icon && (
        <Icon
          name={icon}
          strokeWidth={iconStrokeWidth}
          color={active ? activeColor : color}
          size={iconSize}
          style={{ flex: `0 0 ${iconSize}`, marginBottom: gap }}
        />
      )}
      {children && (
        <Box h={iconSize} color={active ? activeColor : color}>
          {children}
        </Box>
      )}
      <P3 size={fontSize} weight={fontWeight} color={active ? activeColor : color} lineHeight="1" align="center">
        {label}
      </P3>
    </Box>
  );
};

export default TabBar;
