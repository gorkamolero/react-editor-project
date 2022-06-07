import { AnimateSharedLayout, motion, Transition } from "framer-motion";
import React, { forwardRef } from "react";
import { SharedBoxProps, UIKitCSSProperties } from "../base/Box";
import { useBreakpoint, useConfig } from "../hooks";
import Stack from "../layout/Stack";
import { HorizontalAlign } from "../types";
import { mergeProps } from "../utils/deepMerge";
import { Icon, IconName } from "./Icon";
import Tooltip from "./Tooltip";

type Tab = string | number;

type TabsProps = {
  tabs: Tab[];
  tabsNames?: (string | undefined)[];
  tabsIcons?: (IconName | undefined)[];
  tabsTooltips?: (string | undefined)[];
  onTabChange?: (tab: Tab, index: number) => void;
  onTabClick?: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  tabStyle?: UIKitCSSProperties;
  tabSpanStyle?: UIKitCSSProperties;
  activeTabStyle?: UIKitCSSProperties;
  underlineStyle?: UIKitCSSProperties;
  underlineSpring?: Partial<Transition>;
  arrows?: {
    color?: string;
    icons?: [IconName, IconName];
    padding?: number | string;
  };
  breakPoint?: string | number;
  activeTab?: Tab;
  iconProps?: Partial<typeof Icon>;
  align?: HorizontalAlign;
  animationDelay?: number;
  getTabStyle?: (tab: string) => UIKitCSSProperties;
  style?: UIKitCSSProperties;
} & SharedBoxProps;

type Ref = HTMLElement;

const Tabs = forwardRef<Ref, TabsProps>((props: TabsProps, ref) => {
  const config = useConfig();

  const {
    tabStyle,
    tabSpanStyle,
    activeTabStyle,
    underlineStyle,
    underlineSpring,
    arrows,
    breakPoint,
    tabs,
    tabsNames,
    tabsIcons,
    tabsTooltips,
    activeTab = tabs[0],
    iconProps,
    onTabChange,
    onTabClick,
    align = "center",
    animationDelay,
    getTabStyle,
    style,
    ...otherProps
  }: TabsProps = mergeProps(config.Tabs, props);

  const hit = useBreakpoint(typeof breakPoint === "string" ? parseInt(breakPoint) : breakPoint);

  const { icons: arrowIcons, color: arrowColor, padding: arrowPadding } = arrows ?? {};

  const lastTabIndex = tabs.length - 1;

  const currentTabIndex = tabs.findIndex((t) => t === activeTab);

  const tabsStyle = {
    flex: "1 0 auto",
    listStyle: "none",
    padding: "0",
    margin: "0",
    display: "flex",
    alignItems: hit ? "center" : "stretch",
    justifyContent: align,
    maxWidth: "100%",
  } as UIKitCSSProperties;

  const extraActiveTabStyle = (
    hit
      ? {
          flex: "1 1 100% !important",
          textAlign: "center !important",
          justifyContent: "center !important",
        }
      : {}
  ) as UIKitCSSProperties;

  const arrowStyle = {
    flex: "0 0 auto",
    padding: arrowPadding,
    paddingTop: "0",
    paddingBottom: "0",
    position: "relative",
  } as UIKitCSSProperties;

  const TabContent = ({ tab, index }) => (
    <span
      style={{
        maxWidth: "100%",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        textAlign: "center",
        lineHeight: 1.3,
        ...tabSpanStyle,
        ...(getTabStyle ? getTabStyle(tab) : {}),
      }}
    >
      {/* @ts-ignore */}
      {tabsIcons?.[index] && <Icon {...iconProps} name={tabsIcons[index]} />}
      {typeof tabsNames?.[index] === "string" ? tabsNames?.[index] : tab}
    </span>
  );

  return (
    <Stack vAlign="center" gap={0} noWrap ref={ref} style={style} {...otherProps}>
      {hit && arrowIcons?.[0] && (
        <div style={arrowStyle}>
          <Icon
            name={arrowIcons[0]}
            size="1.3em"
            color={arrowColor}
            onClick={() => {
              onTabChange && onTabChange(tabs[currentTabIndex - 1], currentTabIndex - 1);
            }}
            style={{
              opacity: currentTabIndex > 0 ? 1 : 0,
              pointerEvents: currentTabIndex > 0 ? "auto" : "none",
            }}
          />
        </div>
      )}
      <AnimateSharedLayout>
        <ul style={tabsStyle}>
          {tabs.map((tab, i) => {
            const active = currentTabIndex === i;
            if (hit && !active) return null;
            return (
              <li
                key={i}
                style={{
                  cursor: "pointer",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                  ...tabStyle,
                  ...(active
                    ? {
                        ...activeTabStyle,
                        ...extraActiveTabStyle,
                      }
                    : {}),
                }}
                onClick={(e) => {
                  onTabClick && onTabClick(e);
                  onTabChange && onTabChange(tabs[i], i);
                }}
              >
                {tabsTooltips?.[i] ? (
                  <Tooltip title={tabsTooltips?.[i]}>
                    <TabContent tab={tab} index={i} />
                  </Tooltip>
                ) : (
                  <TabContent tab={tab} index={i} />
                )}
                {active && (
                  <motion.div
                    layoutId="tab-underline"
                    transition={{
                      layoutX: { type: "spring", ...underlineSpring, delay: animationDelay },
                      layoutY: { duration: 0 },
                    }}
                    style={{
                      position: "absolute",
                      left: 0,
                      bottom: 0,
                      width: "100%",
                      ...underlineStyle,
                    }}
                  />
                )}
              </li>
            );
          })}
        </ul>
      </AnimateSharedLayout>
      {hit && arrowIcons?.[1] && (
        <div style={arrowStyle}>
          <Icon
            name={arrowIcons[1]}
            size="1.3em"
            color={arrowColor}
            onClick={() => {
              onTabChange && onTabChange(tabs[currentTabIndex + 1], currentTabIndex + 1);
            }}
            style={{
              opacity: currentTabIndex < lastTabIndex ? 1 : 0,
              pointerEvents: currentTabIndex < lastTabIndex ? "auto" : "none",
            }}
          />
        </div>
      )}
    </Stack>
  );
});

Tabs.displayName = "Tabs";

export default Tabs;
