import { motion } from "framer-motion";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { mergeRefs, useLayer } from "react-laag";
import { Icon } from "../components/Icon";
import { useConfig, useTimeout, useWindow } from "../hooks";
import HStack from "../layout/HStack";
import VStack from "../layout/VStack";
import { P2 } from "../typography";
import { mergeProps } from "../utils/deepMerge";

const DropDownMenu = (props) => {
  const config = useConfig();

  const mergedProps = mergeProps(config.DropDownMenu, props);

  const {
    children,
    customContent,
    textColor,
    activeColor,
    show: providedShow,
    setShow,
    width,
    fullWidth,
    reactLaagOptions,
    scrollable,
    headerComponent,
    onActionClick,
    selectedOption,
    setSelectedOption,
    motionProps,
    optionProps,
    headerStyle,
    dropDownStyle: providedDropDownStyle,
    listStyle,
    optionStyle,
    activeOptionStyle,
    textStyle,
    detailStyle,
    scrollableStyle,
    style: providedStyle,
    triggerStyle,
  } = mergedProps;

  const { options, optionsDetails, optionsNames, optionsIcons, optionsImages, actionsIcons } = getOptions(mergedProps);

  const { initial, animate, transition } = motionProps ?? {};

  const [keyboardOnlySelectionEnabled, setKeyboardOnlySelectionEnabled] = useState(false);
  const [highlightedOption, setHighlightedOption] = useState(selectedOption || null);

  const [mountAnimation, setMountAnimation] = useState(providedShow);
  const [delayedShow, setDelayedShow] = useState(providedShow);

  useTimeout(
    () => {
      if (providedShow) {
        setDelayedShow(providedShow);
      }
    },
    10,
    [providedShow]
  );

  useEffect(() => {
    if (!providedShow) {
      setDelayedShow(providedShow);
    } else {
      setMountAnimation(true);
    }
  }, [providedShow]);

  useEffect(() => {
    setHighlightedOption(selectedOption || 0);
  }, [selectedOption]);

  const hasContent = useMemo(() => (options && options.length > 0) || customContent, [options, customContent]);

  const show = useMemo(() => {
    return (providedShow || mountAnimation) && hasContent;
  }, [providedShow, mountAnimation, hasContent]);

  const handleKeyDown = useCallback(
    (event) => {
      if (!show) return;

      const keyDown = event.key;

      if (keyDown === "Escape") {
        setShow?.(false);
        event.preventDefault();
      }

      if (keyDown === "ArrowUp") {
        setHighlightedOption(Math.max(0, highlightedOption - 1));
        event.preventDefault();
      }

      if (keyDown === "ArrowDown") {
        setHighlightedOption(Math.min(highlightedOption + 1, options.length - 1));
        event.preventDefault();
      }

      if (keyDown === "Enter") {
        setSelectedOption(highlightedOption);
        event.preventDefault();
      }

      if (keyDown === "ArrowUp" || keyDown === "ArrowDown") {
        setKeyboardOnlySelectionEnabled(true);
        scrollDOMOption();
        event.preventDefault();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [show, options, highlightedOption]
  );

  const childRef = useRef(null);

  function scrollDOMOption() {
    const ul = childRef.current?.querySelector("ul");
    if (typeof ul !== "undefined" && scrollable && ul?.children[highlightedOption || 0]) {
      ul.children[highlightedOption || 0].scrollIntoView({
        block: "center",
      });
    }
  }

  const hasOptions = options && options.length > 0;
  const window = useWindow();

  useEffect(() => {
    if (!hasOptions) return;
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleKeyDown, hasOptions, show]);

  const { triggerProps, triggerBounds, layerProps, layerSide, renderLayer } = useLayer({
    isOpen: show,
    onOutsideClick: () => setShow(false),
    ...reactLaagOptions,
  });

  const animationOrigin = getAnimationOrigin(layerSide);

  const { width: triggerWidth } = triggerBounds || {};

  const computedWidth = useMemo(() => {
    if (width) return width;
    if (fullWidth) return `${triggerWidth}px`;
    return "auto";
  }, [width, fullWidth, triggerWidth]);

  const dropDownStyle = useMemo(
    () => ({
      ...layerProps.style,
      ...animationOrigin,
      width: computedWidth,
      ...providedDropDownStyle,
    }),
    [providedDropDownStyle, layerProps, animationOrigin, computedWidth]
  );

  const ulStyle = useMemo(
    () => ({
      ...(scrollable ? scrollableStyle : {}),
      ...listStyle,
    }),
    [scrollable, listStyle, scrollableStyle]
  );

  return (
    <>
      <div style={{ cursor: "pointer", ...providedStyle, ...triggerStyle }} {...triggerProps}>
        {children}
      </div>
      {show &&
        renderLayer(
          <motion.div
            initial={initial}
            animate={delayedShow ? animate : initial}
            transition={transition}
            ref={mergeRefs(layerProps.ref, childRef)}
            onAnimationComplete={() => {
              if (!providedShow) {
                setMountAnimation(false);
              }
            }}
            {...layerProps}
            style={dropDownStyle}
            onMouseLeave={() => setHighlightedOption(null)}
            onMouseMove={() => setKeyboardOnlySelectionEnabled(false)}
          >
            {customContent && (
              <ul style={ulStyle}>
                <li style={optionStyle}>{customContent}</li>
              </ul>
            )}
            {options && options.length > 0 && (
              <ul style={ulStyle}>
                {headerComponent && <div style={headerStyle}>{headerComponent}</div>}
                {options.map((s, i) => {
                  const isHighlighted = highlightedOption === i;
                  return (
                    <li
                      key={i}
                      onClick={() => {
                        setHighlightedOption(i);
                        setSelectedOption(i);
                      }}
                      onMouseEnter={() => !keyboardOnlySelectionEnabled && setHighlightedOption(i)}
                      style={{ ...optionStyle, ...(isHighlighted ? activeOptionStyle : {}) }}
                    >
                      <div
                        style={{
                          maxWidth: "100%",
                          display: "flex",
                          alignItems: "center",
                          display: "flex",
                          overflow: "hidden",
                        }}
                      >
                        {optionsImages?.[i] && (
                          <img
                            width={optionProps.imageSize}
                            height={optionProps.imageSize}
                            src={optionsImages[i]}
                            alt=""
                            style={{
                              flex: `0 0 ${optionProps.imageSize}`,
                              width: optionProps.imageSize,
                              height: optionProps.imageSize,
                              borderRadius: optionProps.imageCornerRadius,
                              marginRight: optionProps.iconPadding,
                              objectFit: "contain",
                            }}
                          />
                        )}
                        {optionsIcons?.[i] && (
                          <Icon
                            size={optionProps.iconSize}
                            name={optionsIcons[i]}
                            color={isHighlighted ? activeColor : optionProps.iconColor || textColor}
                            style={{
                              flex: `0 0 ${optionProps.iconSize}`,
                              marginRight: optionProps.iconPadding,
                            }}
                          />
                        )}
                        <VStack gap={0} style={{ minWidth: width || fullWidth ? 0 : "auto" }}>
                          <HStack gap={0} noWrap style={{ width: "100%" }}>
                            <P2 noMargin key={i} fontSize="inherit" style={textStyle}>
                              {optionsNames ? optionsNames[i] : s}
                            </P2>
                          </HStack>
                          {optionsDetails?.[i] && (
                            <HStack gap={0} noWrap style={{ width: "100%" }}>
                              <P2
                                style={{
                                  ...textStyle,
                                  ...detailStyle,
                                }}
                              >
                                {optionsDetails[i]}
                              </P2>
                            </HStack>
                          )}
                        </VStack>
                      </div>
                      {actionsIcons?.[i] && (
                        <Icon
                          size={optionProps.actionSize}
                          name={actionsIcons[i]}
                          color={optionProps.actionColor}
                          hoverColor={activeColor}
                          style={{
                            flex: `0 0 ${optionProps.actionSize}`,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onActionClick && onActionClick(i);
                          }}
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </motion.div>
        )}
    </>
  );
};

export function getAnimationOrigin(layerSide) {
  if (layerSide) {
    if (layerSide === "top") {
      return { originX: 0.5, originY: 1 };
    }
    if (layerSide === "right") {
      return { originX: 0, originY: 0.5 };
    }
    if (layerSide === "bottom") {
      return { originX: 0.5, originY: 0 };
    }
    if (layerSide === "left") {
      return { originX: 1, originY: 0.5 };
    }
  }
  return { originX: 0.5, originY: 0.5 };
}

export function getOptions(props) {
  const options = props?.options ?? props?.optionsObjects?.map((o) => o.value);
  const optionsDetails = props?.optionsDetails ?? props?.optionsObjects?.map((o) => o.detail);
  const optionsNames = props?.optionsNames ?? props?.optionsObjects?.map((o) => o.name);
  const optionsIcons = props?.optionsIcons ?? props?.optionsObjects?.map((o) => o.icon);
  const optionsImages = props?.optionsImages ?? props?.optionsObjects?.map((o) => o.image);
  const actionsIcons = props?.actionsIcons ?? props?.optionsObjects?.map((o) => o.icon);
  return { options, optionsDetails, optionsNames, optionsIcons, optionsImages, actionsIcons };
}

export default DropDownMenu;
