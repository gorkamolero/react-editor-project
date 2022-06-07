import React, { forwardRef } from "react";
import Button, { ButtonProps, Ref } from "./Button";
import { SelectOption } from "./UnstyledSelect";

type ButtonSelectProps = ButtonProps & {
  options: Array<SelectOption>;
  selectedOption?: SelectOption;
  formatOption?: (option: SelectOption, index: number) => string;
  onChange?: (value: SelectOption) => void;
};

const ButtonSelect = forwardRef<Ref, ButtonSelectProps>((props, ref) => {
  const { options, selectedOption, formatOption, onChange, children, ...otherProps } = props;

  return (
    <Button position="relative" ref={ref} {...otherProps}>
      {children}
      <select
        value={selectedOption}
        onChange={(e) => onChange && onChange(e.target.value)}
        style={{
          position: "absolute",
          top: "0px",
          left: "0px",
          width: "100%",
          height: "100%",
          opacity: 0,
          cursor: "pointer",
          fontSize: "100%",
        }}
      >
        {options.map((option, index) => (
          <option style={{ fontSize: "100%" }} key={index} value={typeof selectedOption === "number" ? index : option}>
            {formatOption ? formatOption(option, index) : option.toString()}
          </option>
        ))}
      </select>
    </Button>
  );
});

ButtonSelect.displayName = "ButtonSelect";

export default ButtonSelect;
