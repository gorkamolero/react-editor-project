import React, { useEffect, useRef, useState } from "react";
import Box from "../base/Box";
import Button from "../buttons/Button";
import { Icon } from "../components/Icon";
import { useConfig } from "../hooks/configHooks";
import cleanedProps from "../utils/cleanedProps";
import { mergeProps } from "../utils/deepMerge";
import DropDownMenu, { getOptions } from "./DropDownMenu";

const DropDownMenuButton = (props) => {
  const config = useConfig();

  const mergedProps = mergeProps(config.DropDownMenuButton, props);

  const {
    children,
    show: providedShow,
    customContent,
    width,
    fullWidth,
    headerComponent,
    label,
    scrollable = false,
    icon,
    preferX, // to remove warning
    innerIcon,
    iconColor,
    iconSize,
    iconStrokeWidth,
    iconSide,
    selectedOption,
    onSelect,
    onActionClick,
    selectStyle,
    buttonWidth,
    buttonStyle,
    inline,
    buttonProps: providedButtonProps,
    transition,
    dropDownStyle,
    selectFirstByDefault,
    style,
    ...otherProps
  } = mergedProps;

  const { options, optionsDetails, optionsNames, optionsIcons, optionsImages, actionsIcons } = getOptions(mergedProps);

  const cleanOtherProps = cleanedProps(otherProps, excludedPropsNames);

  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);

  const [_show, setShow] = useState(false);
  const show = providedShow ?? _show;

  const showMenuElementRef = useRef(null);

  useEffect(() => {
    const index = options && options.indexOf(selectedOption);
    setSelectedOptionIndex(index);
  }, [show, options, selectedOption, setSelectedOptionIndex]);

  useEffect(() => {
    if (selectFirstByDefault && options?.length > 0) {
      setSelectedOptionIndex(0);
    }
  }, [selectFirstByDefault, options]);

  const handleClick = () => {
    setShow(!show);
  };

  const buttonProps = selectStyle
    ? {
        ...providedButtonProps,
        iconSide: "right",
        variant: "white",
        style: {
          ...buttonStyle,
          justifyContent: "space-between",
        },
      }
    : { ...providedButtonProps, style: buttonStyle };

  return (
    <DropDownMenu
      headerComponent={headerComponent}
      width={width}
      fullWidth={fullWidth}
      show={show}
      setShow={setShow}
      scrollable={scrollable}
      customContent={customContent}
      options={options}
      optionsDetails={optionsDetails}
      optionsNames={optionsNames}
      optionsIcons={optionsIcons}
      actionsIcons={actionsIcons}
      optionsImages={optionsImages}
      selectedOption={selectedOptionIndex}
      setSelectedOption={(index) => {
        setSelectedOptionIndex(index);
        onSelect(options[index], index);
        setShow(false);
      }}
      onActionClick={(index) => onActionClick && onActionClick(options[index])}
      dropDownStyle={dropDownStyle}
      transition={transition}
      inline={inline}
      style={style}
    >
      {(() => {
        if (children)
          return (
            <Box
              style={
                inline ? { display: "inline" } : { display: "flex", alignItems: "center", justifyContent: "center" }
              }
              onClick={handleClick}
              ref={showMenuElementRef}
              {...cleanOtherProps}
            >
              {children}
            </Box>
          );
        if (label)
          return (
            <Button
              width={buttonWidth}
              icon={selectStyle ? "select" : innerIcon}
              iconSide={iconSide}
              onClick={handleClick}
              ref={showMenuElementRef}
              {...buttonProps}
            >
              {label}
            </Button>
          );
        if (icon)
          return (
            <Box ref={showMenuElementRef}>
              <Icon name={icon} color={iconColor} size={iconSize} strokeWidth={iconStrokeWidth} onClick={handleClick} />
            </Box>
          );
      })()}
    </DropDownMenu>
  );
};

const excludedPropsNames = [
  "options",
  "optionsDetails",
  "optionsNames",
  "optionsIcons",
  "optionsImages",
  "actionsIcons",
  "scrollableStyle",
  "detailStyle",
  "textStyle",
  "activeOptionStyle",
  "optionStyle",
  "listStyle",
  "headerStyle",
  "optionProps",
  "reactLaagOptions",
  "motionProps",
  "activeColor",
  "textColor",
];

export default DropDownMenuButton;
