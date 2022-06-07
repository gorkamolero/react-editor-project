import { AnimatePresence, motion } from "framer-motion";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { SharedBoxProps, UIKitCSSProperties, v } from "../base/Box";
import { useBreakpoint, useClickOutside, useConfig, useLockBodyScroll } from "../hooks";
import useCloseModalOnEscape from "../hooks/useCloseModalOnEscape";
import Card from "../layout/Card";
import SafeAreaInsetBottom from "../layout/SafeAreaInsetBottom";
import { CssSize } from "../types";
import { mergeProps } from "../utils/deepMerge";
import { Icon } from "./Icon";

type CloseButtonConfig = {
  offset?: number;
  bottomSheetOffset?: number;
  color?: string;
  background?: string;
  size?: CssSize;
  iconSize?: CssSize;
  iconStrokeWidth?: CssSize;
};

export type ModalProps = SharedBoxProps & {
  show?: boolean;
  setShow?: React.Dispatch<React.SetStateAction<any>> | (() => void);
  onShown?: () => void;
  onHidden?: () => void;
  onClose?: () => void;
  onBack?: () => void;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  bottomSheetWidth?: CssSize;
  bottomSheetCardPadding?: CssSize;
  minHeight?: CssSize;
  fullHeight?: boolean;
  inlineCard?: boolean;
  background?: string;
  padding?: CssSize;
  cardStyle?: React.CSSProperties;
  bottomSheet?: boolean;
  spring?: object;
  bottomSheetSpring?: object;
  overflow?: "visible" | "hidden" | "scroll" | "auto" | "initial" | "inherit";
  wrapperStyle?: React.CSSProperties;
  originX?: number;
  originY?: number;
  hasBackdrop?: boolean;
  hideCloseButton?: boolean;
  fullScreenAt?: number;
  loading?: boolean;
  persistent?: boolean;
  lockScrolling?: boolean;
  closeOnClickOutside?: boolean;
  ignoredClickOutsideRefs?: object[];
  unmountChildren?: boolean;
  ssr?: boolean;
  closeOnEscapeOnlyIfForemost?: boolean;
  closeOnEscape?: boolean;
  closeButton?: CloseButtonConfig;
  backButton?: {
    offset?: number;
    color?: string;
    iconSize?: CssSize;
    iconStrokeWidth?: CssSize;
  };
};

type Ref = HTMLElement;

const Modal = forwardRef<Ref, ModalProps>((props, ref) => {
  const config = useConfig();

  let {
    show,
    setShow,
    onShown,
    onHidden,
    onClose,
    onBack,
    style,
    className,
    children,
    width,
    bottomSheetWidth,
    bottomSheetCardPadding,
    minHeight = "auto",
    fullHeight,
    inlineCard,
    background,
    padding: providedPadding,
    cardStyle: providedCardStyle,
    bottomSheet,
    spring,
    bottomSheetSpring,
    overflow,
    wrapperStyle: providedWrapperStyle,
    originX = 0.5,
    originY = 0.5,
    hasBackdrop,
    hideCloseButton,
    fullScreenAt,
    loading,
    persistent,
    zIndex,
    lockScrolling,
    closeOnEscapeOnlyIfForemost,
    closeOnEscape,
    closeOnClickOutside = true,
    ignoredClickOutsideRefs,
    unmountChildren,
    ssr,
    closeButton: providedCloseButtonConfig,
    backButton: providedBackButtonConfig,
    ...otherProps
  }: ModalProps = mergeProps(config.Modal, props);

  let backButtonConfig = {
    ...config.Modal.backButton,
    ...providedBackButtonConfig,
  };

  const padding = v(providedPadding, config);

  const hitFullScreenBreakpoint = useBreakpoint(fullScreenAt);
  const showFullScreen = fullScreenAt ? hitFullScreenBreakpoint : false;

  const computedPadding = !showFullScreen ? padding : 0;

  const wrapperStyle: UIKitCSSProperties = {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    overflowY: "scroll",
    zIndex: zIndex ?? 10,
    WebkitOverflowScrolling: "touch",
    display: "flex",
    flexDirection: "column",
    alignItems: showFullScreen ? "stretch" : "center",
    justifyContent: showFullScreen ? "stretch" : "flex-start",
    paddingLeft: !bottomSheet && computedPadding,
    paddingRight: !bottomSheet && computedPadding,
    paddingBottom: !bottomSheet && computedPadding,
    paddingTop: computedPadding,
    boxSizing: "border-box",
    pointerEvents: show ? "unset" : "none",
    ...providedWrapperStyle,
  };

  const cardFlexGrow = showFullScreen || fullHeight ? 1 : 0;

  const fullScreenCardStyle: UIKitCSSProperties = showFullScreen
    ? {
        borderRadius: "0",
        border: "none",
        minHeight: "100% !important",
        minWidth: "100% !important",
      }
    : {};

  const bottomSheetStyle: UIKitCSSProperties = bottomSheet
    ? {
        position: "relative",
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      }
    : {};

  const cardStyle: UIKitCSSProperties = {
    width: showFullScreen ? "100%" : bottomSheet ? bottomSheetWidth : width,
    flex: cardFlexGrow + " 1 auto",
    ...fullScreenCardStyle,
    ...providedCardStyle,
    ...style,
    ...bottomSheetStyle,
  };

  const animationOrigin = {
    originX: originX,
    originY: bottomSheet ? 1 : originY,
  };

  /* -------------------------- Handle click outside -------------------------- */

  let modalWrapperRef = useRef<HTMLElement>(null);
  // @ts-ignore
  modalWrapperRef = ref || modalWrapperRef;
  const modalRef = useRef(null);

  useClickOutside(
    modalRef,
    () => {
      if (closeOnClickOutside) {
        onClose && onClose();
        setShow && setShow(false);
      }
    },
    [show, closeOnClickOutside],
    {
      ignoredRefs: ignoredClickOutsideRefs,
      isClickOutside: (e) => {
        // @ts-ignore
        return e.target === modalWrapperRef.current;
      },
    }
  );

  /* ----------------------------- Close on Escape ---------------------------- */

  useCloseModalOnEscape(
    modalWrapperRef,
    () => {
      onClose && onClose();
      setShow && setShow(false);
    },
    {
      onlyIfForemost: closeOnEscapeOnlyIfForemost,
      closeOnEscape,
    }
  );

  /* --------------------------- Lock Body Scrolling -------------------------- */

  useLockBodyScroll(lockScrolling && show);

  /* ------------------------ Dismiss Keyboard on open ------------------------ */

  useEffect(() => {
    if (show) {
      // @ts-ignore
      document?.activeElement?.blur();
    }
  }, [show]);

  /* ------------------- Mount children and trigger onShown ------------------- */

  const initialShow = useRef(show);

  useEffect(() => {
    if (!show) {
      initialShow.current = false;
    }
  }, [show]);

  const [mountChildren, setMountChildren] = useState(show);

  useEffect(() => {
    if (show) {
      setMountChildren(true);
    }
  }, [show]);

  function handleAnimationComplete() {
    if (show) {
      onShown && onShown();
    } else {
      onHidden && onHidden();
      setMountChildren(false);
    }
  }

  const childrenMounted = ssr || !unmountChildren || mountChildren;

  return (
    <Portal active={!ssr}>
      <AnimatedDiv
        className="modal-wrapper"
        show={show}
        persistent={persistent}
        style={wrapperStyle}
        animationOrigin={animationOrigin}
        bottomSheet={bottomSheet}
        spring={spring}
        bottomSheetSpring={bottomSheetSpring}
        onAnimationComplete={handleAnimationComplete}
        ref={modalWrapperRef}
      >
        {bottomSheet && <div style={{ flex: fullHeight ? "0" : "999 1 auto" }} />}
        <Card
          style={cardStyle}
          className={className}
          maxWidth="100%"
          margin="auto"
          overflow={overflow}
          loading={loading}
          ref={modalRef}
          inline={inlineCard}
          // @ts-ignore
          padding={bottomSheet ? bottomSheetCardPadding : undefined}
          {...otherProps}
        >
          {!hideCloseButton && (
            <ModalCloseButton
              onClick={(e) => {
                e.stopPropagation();
                setShow && setShow(false);
                onClose && onClose();
              }}
              config={providedCloseButtonConfig}
              bottomSheet={bottomSheet}
            />
          )}
          {onBack && (
            <BackButton
              onClick={(e) => {
                e.stopPropagation(true);
                onBack?.();
              }}
              config={backButtonConfig}
            />
          )}
          {childrenMounted && children}
          {bottomSheet && <SafeAreaInsetBottom />}
        </Card>
      </AnimatedDiv>
      <AnimatePresence>
        {hasBackdrop && show && (
          <motion.div
            initial={{ opacity: initialShow.current ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", ...spring }}
            style={{
              willChange: "opacity",
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: zIndex ? parseInt(zIndex.toString()) - 1 : 9,
              background: background,
              pointerEvents: show ? "unset" : "none",
            }}
          />
        )}
      </AnimatePresence>
    </Portal>
  );
});

const Portal = ({ active, children }) => {
  if (active) {
    return ReactDOM.createPortal(children, document.body);
  }

  return children;
};

type AnimatedDivProps = {
  children?: React.ReactNode;
  className?: string;
  bottomSheet?: boolean;
  show?: boolean;
  persistent?: boolean;
  animationOrigin?: { originX: number; originY: number };
  spring?: object;
  bottomSheetSpring?: object;
  onAnimationComplete?: () => void;
  style?: React.CSSProperties;
};

const AnimatedDiv = forwardRef<Ref, AnimatedDivProps>((props, ref) => {
  const {
    children,
    className,
    bottomSheet,
    show,
    persistent,
    animationOrigin,
    spring: providedSpring,
    bottomSheetSpring,
    onAnimationComplete,
    style,
  } = props;

  const initialShow = useRef(show);

  useEffect(() => {
    if (!show) {
      initialShow.current = false;
    }
  }, [show]);

  const start = bottomSheet ? { y: "100%", opacity: 0 } : { scale: 0.96, opacity: 0 };
  const end = bottomSheet ? { y: 0, opacity: 5 } : { scale: 1, opacity: 1 };

  const spring = bottomSheet ? bottomSheetSpring : providedSpring;

  if (persistent) {
    return (
      <motion.div
        className={className}
        initial={initialShow.current ? false : start}
        animate={show ? end : start}
        transition={{ type: "spring", ...spring }}
        style={{ ...animationOrigin, ...style }}
        // @ts-ignore
        ref={ref}
        onAnimationComplete={onAnimationComplete}
      >
        {children}
      </motion.div>
    );
  } else {
    return (
      <AnimatePresence>
        {show && (
          <motion.div
            className={className}
            initial={initialShow.current ? false : start}
            animate={end}
            exit={start}
            transition={{ type: "spring", ...spring }}
            style={{ ...animationOrigin, ...style }}
            // @ts-ignore
            ref={ref}
            onAnimationComplete={onAnimationComplete}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
});

AnimatedDiv.displayName = "AnimatedDiv";

export const ModalCloseButton = ({
  onClick,
  config: providedConfig,
  bottomSheet,
}: {
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  config?: CloseButtonConfig;
  bottomSheet?: boolean;
}) => {
  const config = useConfig();

  const closeButtonConfig = {
    ...config.Modal.closeButton,
    ...providedConfig,
  };

  const { offset, bottomSheetOffset, color, background, size, iconSize, iconStrokeWidth }: CloseButtonConfig =
    closeButtonConfig;

  const computedOffset = bottomSheet ? bottomSheetOffset : offset;

  return (
    <div
      style={{
        position: "sticky",
        width: "100%",
        top: 0,
        left: 0,
        flex: "0 0 0",
        zIndex: 3,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: computedOffset,
          right: computedOffset,
          width: size,
          height: size,
          borderRadius: size,
          display: "flex",
          color: color,
          background: background,
          cursor: "pointer",
        }}
        onClick={onClick}
      >
        <Icon
          name="close"
          color="currentColor"
          strokeWidth={iconStrokeWidth}
          size={iconSize}
          style={{ margin: "auto" }}
        />
      </div>
    </div>
  );
};

const BackButton = ({ onClick, config }) => {
  const { offset, color, iconSize, iconStrokeWidth } = config;
  return (
    <div
      style={{
        position: "sticky",
        width: "100%",
        top: 0,
        left: 0,
        flex: "0 0 0",
        zIndex: 3,
      }}
    >
      <div style={{}} onClick={onClick}>
        <Icon
          name="chevronLeft"
          color={color}
          strokeWidth={iconStrokeWidth}
          size={iconSize}
          style={{
            position: "absolute",
            top: offset,
            left: offset,
            cursor: "pointer",
          }}
        />
      </div>
    </div>
  );
};

Modal.displayName = "Modal";

export default Modal;
