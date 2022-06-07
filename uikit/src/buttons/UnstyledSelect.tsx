import React, { forwardRef } from "react";
import { UIKitCSSProperties } from "../base/Box";

type UnstyledSelectProps = {
  options: Array<SelectOption>;
  selectedOption?: string | number;
  formatOption?: (option: SelectOption, index: number) => string;
  onChange?: (value: SelectOption) => void;
  style?: UIKitCSSProperties;
  children?: React.ReactNode;
};

export type SelectOption = string | number;

export type Ref = HTMLDivElement;

const UnstyledSelect = forwardRef<Ref, UnstyledSelectProps>((props, ref) => {
  const { options, selectedOption, formatOption, onChange, style, children, ...otherProps } = props;

  return (
    <div style={{ ...style, position: "relative" }} ref={ref} {...otherProps}>
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {children}
      </div>
      <select
        value={selectedOption}
        onChange={(e) => {
          onChange && onChange(e.target.value);
        }}
        style={{
          position: "absolute",
          top: "0px",
          left: "0px",
          width: "100%",
          height: "100%",
          opacity: 0,
          cursor: "pointer",
          fontSize: "100%",
          zIndex: 2,
        }}
      >
        {options.map((option, index) => (
          <option style={{ fontSize: "100%" }} key={index} value={typeof selectedOption === "number" ? index : option}>
            {formatOption ? formatOption(option, index) : option.toString()}
          </option>
        ))}
      </select>
    </div>
  );
});

UnstyledSelect.displayName = "UnstyledSelect";

export default UnstyledSelect;
