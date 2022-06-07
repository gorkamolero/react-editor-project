import React from "react";
import toast from "react-hot-toast";
import { UIKitCSSProperties } from "../base/Box";
import Button, { ButtonProps, getVariantProps } from "../buttons/Button";
import { useConfig } from "../hooks/configHooks";
import Stack from "../layout/Stack";
import { mergeProps } from "../utils/deepMerge";
import { Icon, IconName } from "./Icon";

export function NotifWithButton({
  title,
  withClose = false,
  buttons,
  variant: providedVariant = "primary",
  style: providedStyle,
}: {
  title: string;
  withClose?: boolean;
  buttons?: ({
    label: string;
    icon?: IconName;
  } & ButtonProps)[];
  variant?: string | string[];
  style?: UIKitCSSProperties;
}) {
  const config = useConfig();

  // Take variant prop and return array
  const variants =
    typeof providedVariant === "string" ? [providedVariant] : Array.isArray(providedVariant) ? providedVariant : null;

  const variantProps = getVariantProps(variants, config, "NotifWithButton");
  const mergedProps = mergeProps(config.NotifWithButton, variantProps);

  const { style, buttonProps, closeProps, gap } = mergedProps;

  return (
    // @ts-ignore
    <Stack
      gap={gap}
      noWrap
      style={{
        ...style,
        ...providedStyle,
      }}
    >
      <span>{title}</span>
      <Stack gap={2}>
        {buttons?.map((button, i) => {
          const { label, icon, ...rest } = button;
          return (
            <Button key={i} icon={icon} {...buttonProps} {...rest}>
              {label}
            </Button>
          );
        })}
      </Stack>
      {withClose && <Icon {...closeProps} onClick={() => toast.dismiss()} />}
    </Stack>
  );
}
