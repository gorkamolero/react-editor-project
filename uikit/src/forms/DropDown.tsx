/** @jsxImportSource @emotion/react */
import { css, keyframes } from "@emotion/core";
import { Content, Item as RadixItem, Root, Trigger } from "@radix-ui/react-dropdown-menu";
import React from "react";
import { UIKitCSSProperties } from "../base/Box";
import { Icon, IconName } from "../components/Icon";
import { useConfig } from "../hooks/configHooks";
import Stack from "../layout/Stack";
import { P1 } from "../typography";
import { typedMergeProps } from "../utils/deepMerge";

export type DropDownProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  content: React.ReactNode;
  trigger: React.ReactNode;
  sideOffset?: number;
  contentWrapperStyle?: React.CSSProperties;
  isModal?: boolean;
};

const DropDown = (props: DropDownProps) => {
  const config = useConfig();

  const contentWrapperStyle = {
    ...config.DropDown.contentWrapperStyle,
    ...props.contentWrapperStyle,
  };

  const {
    open,
    onOpenChange,
    content: ProvidedContent,
    trigger: ProvidedTrigger,
    sideOffset,
    isModal,
  } = typedMergeProps(config.DropDown, props);

  return (
    <Root open={open} onOpenChange={onOpenChange} modal={isModal}>
      <Trigger style={{ cursor: "pointer", outline: "none" }} asChild>
        {ProvidedTrigger}
      </Trigger>
      <Content
        css={css`
          transform-origin: var(--radix-dropdown-menu-content-transform-origin);
          animation: ${scaleIn} 0.15s cubic-bezier(0.2, 0, 0.3, 1);
        `}
        style={contentWrapperStyle}
        sideOffset={sideOffset}
        avoidCollisions
        collisionTolerance={14}
      >
        {onOpenChange ? ProvidedContent : <RadixItem style={{ outline: "none" }}>{ProvidedContent}</RadixItem>}
      </Content>
    </Root>
  );
};

const scaleIn = keyframes`
    0% {
      opacity: 0;
      transform: scale(0.97);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  `;

const Item = ({
  label,
  icon,
  onClick,
  href,
  children,
  ...otherProps
}: {
  color?: string;
  fontSize?: string;
  iconSize?: string | number;
  gap?: string | number;
  label?: string;
  icon?: IconName;
  iconSide?: "left" | "right";
  loading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  href?: string;
  children?: React.ReactNode;
  style?: UIKitCSSProperties;
}) => {
  const config = useConfig();

  const { color, fontSize, iconSize, iconSide, gap, style } = typedMergeProps(config.DropDown.item, otherProps) ?? {};

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (onClick) {
      e.preventDefault();
      onClick(e);
    }
    if (href) {
      window.open(href, "_blank");
    }
  }

  return (
    <Stack
      align={!icon || iconSide === "left" ? "left" : "spaced"}
      onClick={handleClick}
      style={{
        zIndex: 1,
        width: "100%",
        cursor: "pointer",
        position: "relative",
        ...style,
      }}
      className="dropdown-item"
      // py={1.5}
      // pl={2}
      // pr={iconSide === "left" ? 4 : 2.5}
      gap={gap}
      noWrap
    >
      {icon && iconSide === "left" && <Icon size={iconSize} name={icon} color={color} />}
      {label && (
        <P1 fontSize={fontSize} color={color} style={{ userSelect: "none", flex: "1 1 auto" }}>
          {label}
        </P1>
      )}
      {children}
      {icon && iconSide === "right" ? (
        <Icon size={iconSize} name={icon} color={color} />
      ) : (
        label && <div style={{ flex: "0 0 0" }} />
      )}
    </Stack>
  );
};

const ItemsWrapper = ({
  children,
  ...otherProps
}: {
  children: React.ReactNode;
  gap?: number | string;
  style?: UIKitCSSProperties;
}) => {
  const config = useConfig();

  const { gap, style } = typedMergeProps(config.DropDown.wrapper, otherProps) ?? {};

  return (
    <Stack vertical gap={gap} align="stretch" w="100%" style={style}>
      {children}
    </Stack>
  );
};

DropDown.Item = Item;
DropDown.ItemsWrapper = ItemsWrapper;

export default DropDown;
