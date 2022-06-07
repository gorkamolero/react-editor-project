/** @jsxImportSource @emotion/react */
import { jsx } from "@emotion/core";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { Fragment, useState } from "react";
import ReactDOM from "react-dom";
import tinycolor from "tinycolor2";
import Box from "../base/Box";
import { useBreakpoint, useConfig, useTimeout, useWindow } from "../hooks";
import HStack from "../layout/HStack";
import Section from "../layout/Section";
import VStack from "../layout/VStack";
import { unitMultiply } from "../utils";
import { getColorFromCssVariable } from "../utils/colorUtils";
import { mergeProps } from "../utils/deepMerge";
import DelayUnmount from "./DelayUnmount";

const Header = (props) => {
  const config = useConfig();
  const {
    background: configBackground,
    openMenuBackground,
    shadow,
    border,
    height,
    linksGap,
    verticalGap,
    linksAlign,
    breakPoint,
    centerLinksOnFullscreen,
    centeredElementsZoom,
    hamburgerMenuWidth,
    hamburgerMenuHeight,
    hamburgerMenuStrokeWidth,
    hamburgerMenuColor,
    width,
    style: providedStyle,
    fixed,
    zIndex = fixed ? 3 : 1,
    CSS: externalCSS,
    children,
    background = configBackground,
    leftComponents,
    permanentComponents,
    animation,
    animationStart,
    animationEnd,
    spring,
    ...otherProps
  } = mergeProps(config.Header, props);

  const window = useWindow();
  const showHamburgerMenu = useBreakpoint(breakPoint);
  const [menuOpen, setMenuOpen] = useState(false);
  const [delayedMenuOpen, setDelayedMenuOpen] = useState(menuOpen);

  // Delay animation of items in full screen header right after mount
  useTimeout(
    () => {
      setDelayedMenuOpen(menuOpen);
    },
    1,
    [menuOpen]
  );

  const fixedStyle = fixed
    ? {
        position: "fixed",
        top: "0",
        left: "0",
      }
    : {};

  const headerStyle = {
    width: "100%",
    height: height,
    zIndex: zIndex,
    ...fixedStyle,
    ...providedStyle,
  };

  const headerPlaceholderStyle = {
    width: "100%",
    height: height,
    minHeight: height,
  };

  const floatingDivStyle = {
    position: "fixed",
    background: openMenuBackground,
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    boxSizing: "border-box",
    zIndex: "8",
    opacity: delayedMenuOpen ? 1 : 0,
    pointerEvents: delayedMenuOpen ? "auto" : "none",
    transition: "0.2s",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };

  const leftLinksProps = {
    align: "left",
    gap: linksGap,
    noWrap: true,
    style: {
      flex: "0 1 auto",
    },
  };
  const childrenProps = {
    align: linksAlign,
    gap: linksGap,
    noWrap: true,
    style: {
      flex: "1 1 auto",
    },
  };

  const permanentComponentProps = {
    align: "right",
    gap: linksGap,
    noWrap: true,
    style: {
      marginLeft: linksGap,
      paddingLeft: linksGap,
      flex: "0 1 auto",
    },
  };

  const HeaderPlaceholder = <div style={headerPlaceholderStyle} />;

  const animationProps = animation
    ? {
        as: motion.div,
        initial: false,
        animate: delayedMenuOpen
          ? { y: 0, opacity: 1 }
          : { y: -30, opacity: 0 },
        transition: { type: "spring", ...spring },
      }
    : {};

  const HeaderInner = (
    <Box css={externalCSS} {...otherProps} style={headerStyle}>
      <Section
        zIndex={zIndex}
        width={width}
        noPadding
        noBorder
        height={height}
        style={{
          boxShadow: "none",
          borderBottom: border,
        }}
        background={background}
        flex
        flexDirection="row"
        align="stretch"
        vAlign="center"
      >
        <HStack
          w="100%"
          align="stretch"
          vAlign="center"
          noWrap={true}
          gap={0}
          style={{ overflow: "visible" }}
        >
          {leftComponents && (
            <HStack {...leftLinksProps}>{leftComponents}</HStack>
          )}
          {!showHamburgerMenu && children && (
            <HStack id="inline-links" {...childrenProps}>
              {children}
            </HStack>
          )}
          {(showHamburgerMenu || !children) && (
            <div style={{ flex: "9999 1 auto" }} />
          )}
          {permanentComponents && (
            <HStack {...permanentComponentProps}>{permanentComponents}</HStack>
          )}
          {children && showHamburgerMenu && (
            <HamburgerMenu
              id="hamburger-menu-icon"
              config={config}
              setMenuOpen={setMenuOpen}
              menuOpen={menuOpen}
            />
          )}
        </HStack>
      </Section>
      {window &&
        ReactDOM.createPortal(
          <DelayUnmount show={menuOpen}>
            {(props) => (
              <div style={floatingDivStyle}>
                <Section
                  center
                  zIndex={zIndex}
                  noBorder
                  noPadding
                  style={{
                    zIndex: zIndex,
                    height: height,
                    boxShadow: shadow,
                    borderBottom: `${border} !important`,
                    flex: `0 0 ${height}`,
                  }}
                  height={height}
                  background="transparent"
                  vAlign="center"
                >
                  <HStack
                    w="100%"
                    align="right"
                    vAlign="center"
                    noWrap={true}
                    gap={0}
                  >
                    <HamburgerMenu
                      config={config}
                      setMenuOpen={setMenuOpen}
                      menuOpen={menuOpen}
                    />
                  </HStack>
                </Section>
                <Section
                  noBorder
                  noPadding
                  background="transparent"
                  center={centerLinksOnFullscreen}
                  style={{
                    zoom: centerLinksOnFullscreen ? centeredElementsZoom : 1,
                    flex: 1,
                    paddingBottom: height,
                  }}
                >
                  <VStack
                    {...animationProps}
                    onAnimationComplete={() => {
                      if (!menuOpen) {
                        props.performUnmount && props.performUnmount();
                      }
                    }}
                    gap={verticalGap}
                    id="floating-links"
                    align={centerLinksOnFullscreen ? "center" : "right"}
                    center={centerLinksOnFullscreen}
                  >
                    {showHamburgerMenu && children}
                  </VStack>
                </Section>
              </div>
            )}
          </DelayUnmount>,
          document.querySelector("body")
        )}
    </Box>
  );

  if (!fixed) {
    return HeaderInner;
  } else {
    return (
      <Fragment>
        {HeaderPlaceholder}
        {window &&
          ReactDOM.createPortal(HeaderInner, document.querySelector("body"))}
      </Fragment>
    );
  }
};

const HamburgerMenu = (props) => {
  const { id, config, setMenuOpen, menuOpen } = props;

  const {
    hamburgerMenuColor: hamburgerMenuColorConfig,
    background: configBackground,
    hamburgerMenuStrokeWidth,
    hamburgerMenuHeight,
    hamburgerMenuWidth,
  } = config.Header;

  const parsedConfigBackground = getColorFromCssVariable(configBackground);

  const hamburgerMenuColor = (() => {
    if (parsedConfigBackground === "transparent")
      return hamburgerMenuColorConfig;
    if (tinycolor(parsedConfigBackground).getLuminance() < 0.6) return "white";
    return hamburgerMenuColorConfig;
  })();

  const halfHeight = hamburgerMenuHeight / 2,
    strokeWidth = hamburgerMenuStrokeWidth,
    halfStrokeWidth = "-" + strokeWidth / 2;

  var styles = {
    container: {
      flex: "0 0 auto !important",
      width: hamburgerMenuWidth + "px",
      height: hamburgerMenuHeight + "px",
      marginLeft: unitMultiply(config.Header.linksGap, 2),
      position: "relative",
      cursor: "pointer",
      transform: "rotate(0deg)",
      zIndex: "5",
    },
    lineBase: {
      display: "block",
      height: strokeWidth + "px",
      width: "100%",
      background: hamburgerMenuColor || "#000",
      borderRadius: "1px",
      transformOrigin: "center",
      position: "absolute",
    },
    firstLine: {
      marginTop: halfStrokeWidth + "px",
    },
    secondLine: {
      top: halfHeight + "px",
      marginTop: halfStrokeWidth + "px",
    },
    thirdLine: {
      marginTop: halfStrokeWidth + "px",
    },
  };

  return (
    <div
      style={styles.container}
      onClick={() => {
        setMenuOpen(!menuOpen);
      }}
      id={id}
    >
      <motion.div
        initial={false}
        style={{ ...styles.lineBase, ...styles.firstLine }}
        animate={{ y: menuOpen ? halfHeight : 0, rotate: menuOpen ? 45 : 0 }}
        transition={{ type: "spring", ...config.springs.faster }}
      />
      <motion.div
        initial={false}
        style={{ ...styles.lineBase, ...styles.secondLine }}
        animate={{ opacity: menuOpen ? 0 : 1 }}
        transition={{ type: "spring", ...config.springs.faster }}
      />
      <motion.div
        initial={false}
        style={{ ...styles.lineBase, ...styles.thirdLine }}
        animate={{
          y: menuOpen ? halfHeight : hamburgerMenuHeight,
          rotate: menuOpen ? -45 : 0,
        }}
        transition={{ type: "spring", ...config.springs.faster }}
      />
    </div>
  );
};

Header.propTypes = {
  /** A logo component or image to diplay in the header. */
  logoComponent: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  /** Link components that will float inside the header. **/
  linksComponents: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  /** Height override, elements will stay vertically centered.  */
  height: PropTypes.string,
  /** Background of the header, defaults to transparent. */
  background: PropTypes.string,
};

export default Header;
