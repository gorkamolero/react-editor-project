/* cSpell:disable */
const defaultConfig = {};

defaultConfig.baseUnit = 0.25; // rem
defaultConfig.baseUnitType = "rem"; // rem

defaultConfig.colors = {
  c1: "var(--c1)",
  c2: "var(--c2)",
  c3: "var(--c3)",
  c4: "var(--c4)",
  c5: "var(--c5)",
  c6: "var(--c6)",
  c7: "var(--c7)",
  buttonWhite: "var(--buttonWhite)",
  buttonWhiteText: "var(--buttonWhiteText)",
  bg0: "var(--bg0)",
  bg1: "var(--bg1)",
  bg2: "var(--bg2)",
  bg3: "var(--bg3)",
  bg4: "var(--bg4)",
  tooltip: "var(--tooltip)",
  accent1: "var(--accent1)",
  accent2: "var(--accent2)",
  error: "var(--error)",
  success: "var(--success)",
  shadowColor: "var(--shadowColor)",
  modalBackground: "var(--modalBackground)",
  selection: "var(--selection)",
};

defaultConfig.globals = {
  customCss: ``, // any scss
};

defaultConfig.Container = {
  background: "transparent",
};

defaultConfig.inlineLinks = {
  color: (c) => c.colors.accent1,
  textDecoration: "none",
  fontWeight: "inherit",
  border: {
    show: false,
    size: "1px",
    color: (c) => c.colors.accent1,
    alpha: 0.25,
  },
};

defaultConfig.fonts = {
  faces: {
    normal:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    // You can add h1, h2, p1, p2 etc.
  },
  weights: {
    normal: 400,
    H1: 700,
    H2: 700,
    H3: 600,
    H4: 600,
    H5: 500,
    Label: 400,
    Button: 500,
    Input: 400,
    smallHeading: 600,
  },
  sizes: {
    normal: "15px",
    P2: "15px",
    P3: "14px",
    H1: "3em",
    H2: "2em",
    H3: "1.6em",
    H4: "1.5em",
    H5: "1.3em",
    Button: "15.5px",
    Input: "17px",
    smallHeading: "17px",
    Badge: "0.9em",
    Label: "14px",
  },
  letterSpacings: {
    normal: "0px",
  },
  lineHeights: {
    normal: 1.5,
    H1: 1.3,
    H2: 1.2,
    H3: 1.2,
    H4: 1.2,
    H5: 1.2,
    Badge: 1.3,
    Button: 1.3,
  },
  colors: {
    normal: (c) => c.colors.c2,
    H1: (c) => c.colors.c1,
    H2: (c) => c.colors.c1,
    H3: (c) => c.colors.c2,
    H4: (c) => c.colors.c3,
    H5: (c) => c.colors.c3,
    P1: (c) => c.colors.c2,
    P2: (c) => c.colors.c3,
    Label: (c) => c.colors.c4,
    P3: (c) => c.colors.c4,
    smallHeading: (c) => c.colors.c3,
  },
  headingsEmphasis: {
    emFontStyle: "normal",
    emColor: (c) => c.colors.accent1,
  },
  headingsAlign: "left",
  smallHeading: {
    uppercase: true,
  },
};

defaultConfig.responsive = {
  breakPoint: 768,
};

defaultConfig.sizes = {
  xxxl: "3em",
  xxl: "1.8em",
  xl: "1.6em",
  l: "1.4em",
  m: "1em",
  s: ".9em",
  xs: ".8em",
  xxs: ".4em",
  xxxs: ".1em",
};

defaultConfig.layout = {
  gridGap: 3,
  width: "68rem",
  padding: "18px",
};

defaultConfig.Section = {
  padding: "20px",
  skew: null, // Example: 5deg
  border: "none",
  width: (c) => c.layout.width,
};

defaultConfig.appearance = {
  bigRadius: "18px",
  smallRadius: "10px",
  badgeRadius: "1em",
};

defaultConfig.divider = {
  color: (c) => c.colors.c6,
};

defaultConfig.breadcrumbs = {
  spacing: "1px",
  separator: {
    icon: "chevronRight",
    color: (c) => c.colors.c5,
    size: "1.4em",
    strokeWidth: "1.6px",
  },
  crumbStyle: {
    color: (c) => c.colors.c3,
    cursor: "pointer",
  },
  lastCrumbStyle: {},
  emphasizedCrumbStyle: {
    fontWeight: 600,
    color: (c) => c.colors.c1,
  },
};

defaultConfig.accordion = {
  toggleSpacing: "0.6em",
};

defaultConfig.ProgressBar = {
  height: 2,
  borderRadius: 2,
  innerBorderRadius: 0,
  width: 60,
  maxWidth: "100%",
  background: (c) => c.colors.c6,
  color: (c) => c.colors.accent1,
  transition: (c) => c.springs.fast,
};

defaultConfig.effects = {
  smallShadow: (c) => `0px 2px 5px ${c.colors.shadowColor}, 0px 5px 12px ${c.colors.shadowColor}`,
  bigShadow: (c) => `0px 6px 13px ${c.colors.shadowColor}, 0px 8px 28px ${c.colors.shadowColor}`,
};

defaultConfig.motionEffects = {
  press: {
    // whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: (c) => ({ type: "spring", ...c.springs.faster }),
  },
};

defaultConfig.animations = {
  animationCurveIn: "cubic-bezier(0.4, 0, 0.2, 1)",
  animationCurveOut: "cubic-bezier(0.6, 0, .7, 1)",
};

defaultConfig.springs = {
  slow: { duration: 1.2, bounce: 0.04 },
  medium: { duration: 0.8, bounce: 0.06 },
  fast: { duration: 0.45, bounce: 0.1 },
  faster: { duration: 0.28, bounce: 0.15 },
  instant: { duration: 0.15, bounce: 0.18 },
  bouncy: { duration: 0.35, bounce: 0.35 },
  bouncier: { duration: 0.6, bounce: 0.5 },
  bottomSheet: { duration: 0.54, bounce: 0.05 },
};

defaultConfig.Tooltip = {
  arrow: false,
  arrowSize: "regular",
  position: "bottom",
  sticky: false,
  stickyDuration: 200,
  interactive: false,
  interactiveBorder: 2,
  animation: "shift",
  touchHold: false,
  duration: 100,
  animateFill: false,
  delay: 0,
  trigger: "mouseenter",
  inertia: false,
  hideOnClick: true,
  offset: 0,
  multiple: false,
  maxWidth: 180,
  gap: 10,
  noMobile: true,
  titleStyle: (c) => ({
    color: c.colors.c1,
    fontSize: "14px",
  }),
  hotkeyStyle: (c) => ({
    color: c.colors.c2,
    fontSize: "12.5px",
    background: c.colors.c7,
    padding: "3px 5px",
    borderRadius: "4px",
    fontWeight: 600,
    textAlign: "center",
    whiteSpace: "nowrap",
  }),
  descriptionStyle: (c) => ({
    color: c.colors.c3,
    fontSize: "13px",
  }),
  contentStyle: {
    padding: "4px",
    display: "flex",
    flexFlow: "column nowrap",
  },
  popperOptions: {
    modifiers: {
      preventOverflow: {
        boundariesElement: "window",
        enabled: true,
        padding: 20,
      },
    },
  },
  onRequestClose: () => {},
};

defaultConfig.TopLoader = {
  color: (c) => c.colors.accent1,
  height: 2,
  duration: "30s",
};

defaultConfig.FullLoader = {
  color: (c) => c.colors.c1,
  alpha: 0.3,
  duration: "30s",
};

defaultConfig.Spinner = {
  color: (c) => c.colors.c3,
  size: 22,
  stroke: 2,
  rotation: "2s",
};

defaultConfig.tables = {};

defaultConfig.Table = {
  ...defaultConfig.tables,
  style: {
    border: (c) => `1px solid ${c.colors.c7}`,
    borderRadius: (c) => c.appearance.smallRadius,
    background: (c) => c.colors.bg0,
  },
  cellStyle: (c) => ({
    verticalAlign: "middle",
    textAlign: "center",
    fontFamily: c.fonts.faces.normal,
    fontSize: c.fonts.sizes.P1,
    fontWeight: c.fonts.weights.P1,
    color: c.fonts.colors.P1,
    lineHeight: 1,
    padding: "4px 6px",
    borderBottom: `1px solid ${c.colors.c6}`,
  }),
  lastCellStyle: (c) => ({
    borderBottom: "none",
  }),
};

defaultConfig.Tr = {
  style: {
    height: "38px",
  },
  hoverStyle: {
    background: (c) => c.colors.bg3,
  },
};

defaultConfig.Th = {
  style: {
    background: (c) => c.colors.bg4,
    fontWeight: 600,
    color: (c) => c.colors.c1,
  },
  hoverStyle: {},
};

defaultConfig.Td = {
  style: {},
  hoverStyle: {},
};

defaultConfig.Notifications = {
  position: "top-center",
  toastOptions: (c) => ({
    className: "notif",
    duration: 6000,
    style: {
      fontSize: "14.5px",
      color: c.colors.c2,
      background: c.colors.tooltip,
      boxShadow: `0px 2px 5px ${c.colors.shadowColor}, 0px 5px 12px ${c.colors.shadowColor}`,
      borderRadius: c.appearance.smallRadius,
      border: `1px solid ${c.colors.c7}`,
      padding: "4px 6px",
    },
  }),
};

defaultConfig.NotifWithButton = {
  gap: 3,
  style: {
    margin: "-2px -6px -2px -4px",
  },
  actionProps: {
    color: defaultConfig.colors.accent1,
    variant: "link",
    noStretch: true,
  },
  closeProps: {
    name: "close",
    size: "18px",
    color: defaultConfig.colors.c4,
  },
  variantProps: {
    primary: {
      buttonProps: {
        variant: ["pill"],
      },
    },
    subtle: {
      buttonProps: {
        variant: ["pill", "white"],
      },
    },
  },
};

defaultConfig.Switch = {
  colorOn: (c) => c.colors.accent1,
  colorOff: (c) => c.colors.c5,
  colorForeground: "white",
  spring: {
    duration: 0.4,
    bounce: 0.1,
  },
  width: 44,
  height: 30,
  padding: 3,
  variantProps: {
    small: {
      width: 40,
      height: 26,
      padding: 2,
    },
  },
};

defaultConfig.Badge = {
  align: "left",
  type: "primary",
  color: (c) => c.colors.accent1,
  secondaryBackgroundAlpha: 0.15,
  badgeRadius: (c) => c.appearance.badgeRadius,
};

defaultConfig.Input = {
  width: "100%",
  height: (c) => c.Button.height,
  padding: ".5em",
  radius: (c) => c.Button.radius,
  background: (c) => c.colors.bg0,
  borderWidth: "1px",
  color: (c) => c.colors.c7,
  colorFocus: (c) => c.colors.accent2,
  colorError: (c) => c.colors.error,
  colorSuccess: (c) => c.colors.success,
  outlineWidth: 2,
  outlineAlpha: 0.3,
  textColor: (c) => c.colors.c1,
  placeholderColor: (c) => c.colors.c4,
  labelColor: (c) => c.colors.c3,
  iconColor: (c) => c.colors.c4,
  iconSide: "left",
  iconSize: (c) => c.Icon.sizeInButtons,
  iconTextPadding: 30,
  iconStrokeWidth: (c) => c.Icon.strokeInButtons,
  spinnerSize: 18,
  spinnerStroke: defaultConfig.Spinner.stroke,
};

defaultConfig.Select = {
  icon: "select",
  iconSide: "right",
  iconSize: 16,
  iconTextPadding: 30,
};

defaultConfig.Radio = {
  gap: 1,
  borderColor: (c) => c.colors.c5,
  shadowSize: `0 0.15em 0.2em .05em`,
  shadowAlpha: 0.15,
  colorNormal: (c) => c.colors.bg0,
  colorChecked: (c) => c.colors.accent1,
  colorDot: (c) => "white",
  size: 16,
  dotSize: 6,
};

defaultConfig.Checkbox = {
  gap: 1,
  colorNormal: (c) => c.colors.bg0,
  activeColor: (c) => c.colors.accent1,
  borderColor: (c) => c.colors.c5,
  borderSize: "1px solid",
  radius: ".3em",
  shadowSize: `0 0.15em 0.2em .05em`,
  shadowAlpha: 0.15,
  glyphSize: "82%",
  size: 18,
  strokeWidth: 3,
};

defaultConfig.Slider = {
  min: 0,
  max: 10,
  value: 5,
  thumb: (c) => ({
    color: c.colors.accent1,
    size: "14px",
    shadow: "0 3px 5px rgba(0, 0, 0, 0.1)",
  }),
  track: (c) => ({
    background: c.colors.c6,
    height: "14px",
  }),
};

defaultConfig.DropDown = {
  sideOffset: 5,
  isModal: true,
  contentWrapperStyle: (c) => ({
    background: c.colors.tooltip,
    border: `1px solid ${c.colors.c7}`,
    boxShadow: c.effects.smallShadow,
    borderRadius: c.appearance.smallRadius,
    padding: "4px",
    boxSizing: "border-box",
  }),
  item: (c) => ({
    fontSize: "14.5px",
    iconSide: "left",
    iconSize: 15,
    color: c.colors.c2,
    gap: 2.5,
    style: {
      padding: "6px 10px",
    },
  }),
  wrapper: (c) => ({
    gap: 1,
  }),
};

defaultConfig.DropDownMenu = {
  spring: (c) => c.springs.bouncy,
  textColor: (c) => c.colors.c2,
  activeColor: (c) => c.colors.c1,
  scrollable: false,
  fullWidth: false,
  motionProps: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 0.9999, opacity: 1 },
    transition: { type: "spring", duration: 0.22, bounce: 0.25 },
  },
  reactLaagOptions: {
    placement: "bottom-center",
    auto: true,
    triggerOffset: 6,
  },
  optionProps: {
    iconSize: "16px",
    iconPadding: "0.5em",
    iconsColor: (c) => c.colors.c3,
    imageSize: "1.4rem",
    imageCornerRadius: "0.2em",
    actionSize: "14px",
    actionColor: (c) => c.colors.c3,
  },
  headerStyle: {
    padding: "6px 6px 0",
  },
  dropDownStyle: {
    background: (c) => c.colors.bg0,
    border: (c) => `1px solid ${c.colors.c7}`,
    boxShadow: (c) => c.effects.smallShadow,
    borderRadius: (c) => c.appearance.smallRadius,
    padding: "1px 5px",
    boxSizing: "border-box",
    zIndex: 999,
  },
  listStyle: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    boxSizing: "border-box",
  },
  optionStyle: {
    color: (c) => c.colors.c2,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    overflow: "hidden",
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 6,
    padding: "4px 6px",
    boxSizing: "border-box",
  },
  activeOptionStyle: {
    color: (c) => c.colors.c1,
    background: (c) => c.colors.bg4,
  },
  textStyle: {
    fontSize: "14.5px",
    color: "inherit",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    position: "relative",
  },
  detailStyle: {
    fontSize: "13.5px",
    color: (c) => c.colors.c4,
  },
  scrollableStyle: {
    overflow: "scroll",
    scrollBehavior: "smooth",
    maxHeight: "180px",
  },
};

defaultConfig.DropDownMenuButton = {
  buttonProps: {
    white: true,
  },
  iconColor: (c) => c.colors.c3,
  iconSize: (c) => c.Icon.size,
  iconStrokeWidth: (c) => c.Icon.strokeWidth,
  spring: (c) => c.DropDown.spring,
};

defaultConfig.Icon = {
  size: "1em",
  strokeWidth: "2px",
  sizeInButtons: "16px",
  strokeInButtons: "3px",
  color: (c) => c.colors.accent1,
  end: "round", // butt, round, square
  join: "round", // bevel, round, arcs
};

defaultConfig.iconBadge = {
  backgroundAlpha: 0.12,
  size: "1.6em",
  iconSize: "60%",
  color: (c) => c.colors.accent1,
};

defaultConfig.sidebar = {
  width: "420px",
  padding: {
    lateral: (c) => c.layout.padding,
    vertical: (c) => c.sizes.xl,
    header: (c) => c.sizes.l,
  },
  floatingAt: "1100px",
  fullScreenAt: "640px",
  background: (c) => c.colors.bg4,
  headerFooterBackground: (c) => c.colors.bg2,
  backgroundOverlayColor: "rgba(0, 0, 0, .4)",
  border: (c) => `1px solid ${c.colors.c6}`,
  innerBorders: (c) => `1px solid ${c.colors.c7}`,
  headerSticky: true,
  footerSticky: true,
  footerPlaceholderHeight: "0",
  handle: {
    show: true,
    hideAt: "0px",
    color: (c) => c.colors.c5,
    colorFixed: "rgba(255,255,255,.85)",
    height: "3em",
    width: "15px",
    innerWidth: "8px",
  },
  section: {
    hoverColor: (c) => c.colors.bg0,
    chevron: {
      width: "3em",
      size: "2em",
      icon: "chevronRight",
      strokeWidth: "1.5px",
      color: (c) => c.colors.c4,
    },
  },
};

defaultConfig.Header = {
  background: (c) => c.colors.bg0,
  openMenuBackground: (c) => c.colors.bg1,
  border: (c) => `1px solid ${c.colors.c7}`,
  linksGap: "8px",
  verticalGap: "10px",
  linksAlign: "right",
  shadow: "",
  height: "3.5em",
  breakPoint: 640,
  hamburgerMenuColor: (c) => c.colors.accent1,
  hamburgerMenuStrokeWidth: 2,
  hamburgerMenuHeight: 12,
  hamburgerMenuWidth: 22,
  centerLinksOnFullscreen: false,
  centeredElementsZoom: 1.1,
  animation: true,
  animationStart: { y: -20, opacity: 0 },
  animationEnd: { y: 0, opacity: 1 },
  spring: (c) => c.springs.fast,
  fixed: false,
};

defaultConfig.floatingFooter = {
  background: (c) => c.colors.bg0,
  border: (c) => `1px solid ${c.colors.c7}`,
  shadow: "",
  height: "3.5em",
};

defaultConfig.Modal = {
  persistent: false,
  unmountChildren: true,
  hasBackdrop: true,
  width: "28rem",
  bottomSheetWidth: "100%",
  padding: (c) => c.layout.padding,
  bottomSheetCardPadding: (c) => c.layout.padding,
  inlineCard: false,
  background: (c) => c.colors.modalBackground,
  spring: (c) => c.springs.faster,
  bottomSheetSpring: (c) => c.springs.bottomSheet,
  closeOnEscapeOnlyIfForemost: true,
  closeOnEscape: false,
  lockScrolling: true,
  ssr: false,
  cardStyle: {
    border: "none",
  },
  closeButton: {
    offset: -14,
    bottomSheetOffset: -6,
    color: (c) => c.colors.c3,
    background: (c) => c.colors.c6,
    size: "29px",
    iconSize: "19px",
    iconStrokeWidth: (c) => c.Icon.strokeInButtons,
  },
  backButton: {
    offset: -12,
    color: (c) => c.colors.c4,
    iconSize: "30px",
    iconStrokeWidth: (c) => c.Icon.strokeWidth,
  },
};

defaultConfig.Expandable = {
  animateWidth: false,
  animateHeight: true,
  animateOpacity: true,
  animateInitially: false,
  overflow: "visible",
  duration: 0.35,
  bounce: 0.05,
};

defaultConfig.AnimatedContainer = {
  spring: (c) => c.springs.fast,
  delay: 0,
};

defaultConfig.SegmentedControl = {
  background: (c) => c.colors.bg4,
  radius: "10px",
  padding: "3px",
  gap: 0,
  spring: (c) => c.springs.faster,
  iconProps: (c) => ({
    mr: c.Button.iconGap,
    size: c.Icon.sizeInButtons,
    offset: "1px",
  }),
  buttonStyle: (c) => ({
    background: "transparent",
    margin: 0,
    color: c.colors.c2,
    height: "32px",
    padding: "0 0.9em",
    fontSize: "14px",
  }),
  activeStyle: (c) => ({
    color: c.colors.c1,
  }),
  backdropStyle: (c) => ({
    borderRadius: "7px",
    background: c.colors.buttonWhite,
    boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
    hoverLighten: 3,
    activeLighten: -3,
    ...c.motionEffects.press,
  }),
};

defaultConfig.MultiSegmentedControl = {
  allowEmptySelection: true,
  singleSelectionMode: false,
  gap: 0,
  radius: (c) => c.Button.radius,
  buttonProps: {
    stretch: true,
    padding: 0,
    marginRight: "-1px",
  },
};

defaultConfig.Tabs = {
  iconProps: (c) => ({
    mr: 1,
    strokeWidth: c.Icon.strokeWidth,
    currentColor: true,
    size: 14,
  }),
  tabStyle: (c) => ({
    padding: ".6em .4em",
    margin: "0 .2em",
    color: c.colors.c3,
    fontWeight: 500,
  }),
  tabSpanStyle: (c) => ({
    display: "flex",
    alignItems: "center",
  }),
  activeTabStyle: (c) => ({
    color: c.colors.accent1,
  }),
  underlineStyle: (c) => ({
    height: "2px",
    background: c.colors.accent1,
  }),
  underlineSpring: (c) => c.springs.fast,
  arrows: (c) => ({
    color: c.colors.c4,
    icons: ["chevronLeft", "chevronRight"],
    padding: c.layout.padding,
  }),
  breakPoint: "600px",
};

defaultConfig.TabBar = {
  height: "49px",
  fullHeight: "calc(49px + env(safe-area-inset-bottom))",
  background: (c) => c.colors.bg0,
  border: (c) => `1px solid ${c.colors.c7}`,
  placeholder: true,
  tab: (c) => ({
    iconSize: "26px",
    iconStrokeWidth: c.Icon.strokeWidth,
    gap: "1px",
    color: c.colors.c3,
    activeColor: c.colors.accent1,
    fontSize: "12px",
    fontWeight: "400",
  }),
};

defaultConfig.H = {
  align: (c) => c.fonts.headingsAlign,
};

defaultConfig.H1 = {
  ...defaultConfig.H,
};
defaultConfig.H2 = {
  ...defaultConfig.H,
};
defaultConfig.H3 = {
  ...defaultConfig.H,
};
defaultConfig.H4 = {
  ...defaultConfig.H,
};
defaultConfig.H5 = {
  ...defaultConfig.H,
};

defaultConfig.P = {};
defaultConfig.P1 = { ...defaultConfig.P };
defaultConfig.P2 = { ...defaultConfig.P };

defaultConfig.P3 = {};
defaultConfig.Block = {};

defaultConfig.Grid = {
  gap: (c) => c.layout.gridGap,
  fill: true,
  vAlign: "stretch",
};

defaultConfig.Button = {
  textColor: "white",
  color: (c) => c.colors.accent1,
  linkBorderSize: "0",
  height: "38px",
  iconGap: "5px",
  padding: "0 1em",
  radius: "8px",
  shadow: true,
  shadowSize: `0 2px 2px 1px`,
  shadowAlpha: 0.15,
  iconSide: "left",
  border: (c) => `1px solid ${c.colors.c7}`,
  borderLuminanceThreshold: 0.8,
  iconSize: (c) => c.Icon.sizeInButtons,
  iconStroke: (c) => c.Icon.strokeInButtons,
  spinnerSize: 18,
  spinnerStroke: (c) => c.Spinner.stroke,
  motionEffects: (c) => ({
    ...c.motionEffects.press,
  }),
  baseStyle: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  variantProps: {
    white: {
      textColor: (c) => c.colors.buttonWhiteText,
      backgroundColor: (c) => c.colors.buttonWhite,
    },
    secondary: {
      foregroundAccentColor: true,
      backgroundAlpha: 0.15,
      border: "none",
      shadow: false,
    },
    line: {
      border: (c) => `1px solid ${c.colors.accent1}`,
      borderLuminanceThreshold: 0,
      foregroundAccentColor: true,
      backgroundAlpha: 0,
      shadow: false,
    },
    link: {
      foregroundAccentColor: true,
      backgroundAlpha: 0,
      padding: 0,
      radius: 0,
      shadow: false,
      height: "auto",
      borderLuminanceThreshold: 0,
      motionEffects: null,
      spinnerSize: 16,
      border: "none",
      fontSize: "100%",
      lineHeight: "inherit",
      margin: 0,
      // style: (c) => ({
      //   borderBottom: `1px solid ${c.colors.selection}`,
      // }),
    },
    small: {
      height: "30px",
      padding: "0 10px",
      radius: "6px",
      lineHeight: 1.4,
      fontSize: "13px",
      iconSize: "0.8rem",
      spinnerSize: 16,
    },
    pill: {
      height: "26px",
      padding: "0 10px",
      radius: "12px",
      fontSize: "14px",
      iconSize: "12px",
      spinnerSize: 14,
      motionEffects: null,
    },
  },
};

defaultConfig.CircleButton = {
  size: "38px",
  iconSize: "18px",
};

defaultConfig.FloatingButton = {
  zIndex: 3,
  position: (c) => ({
    left: c.layout.padding,
    bottom: c.layout.padding,
  }),
};

defaultConfig.Toolbar = {
  background: (c) => c.colors.bg1,
  padding: "6px",
  gap: "3px",
};

defaultConfig.ToolbarButton = {
  color: (c) => c.colors.c4,
  gap: 1,
  padding: "7px 8px 0px",
  iconSize: "20px",
  radius: "10px",
  hoverBackground: (c) => c.colors.bg2,
  spring: { duration: 0.2, bounce: 0.1 },
};

defaultConfig.Sidebar = {};
defaultConfig.SidebarHeader = {};
defaultConfig.SidebarFooter = {};
defaultConfig.Body = {};
defaultConfig.AutoGrid = {
  vAlign: "stretch",
};
defaultConfig.Stack = {
  gap: 2,
  align: "left",
  vAlign: "center",
};

defaultConfig.sizes = {
  xxxl: "3em",
  xxl: "1.8em",
  xl: "1.6em",
  l: "1.4em",
  m: "1em",
  s: ".9em",
  xs: ".8em",
  xxs: ".4em",
  xxxs: ".1em",
};

defaultConfig.Card = {
  width: "auto",
  spring: (c) => c.springs.fast,
  // minHeight: "0",
  minWidth: "0em",
  background: (c) => c.colors.bg0,
  border: (c) => `1px solid ${c.colors.c7}`,
  bigPadding: `24px`,
  smallPadding: `14px`,
  bigRadius: (c) => c.appearance.bigRadius,
  smallRadius: (c) => c.appearance.smallRadius,
  bigShadow: (c) => c.effects.bigShadow,
  smallShadow: (c) => c.effects.smallShadow,
};
defaultConfig.CardFooter = {
  bigPadding: (c) => c.Card.bigPadding,
  smallPadding: (c) => c.Card.smallPadding,
  bigRadius: (c) => c.Card.bigRadius,
  smallRadius: (c) => c.Card.smallRadius,
  background: (c) => c.colors.bg2,
  border: (c) => `1px solid ${c.colors.c6}`,
};
defaultConfig.SubtleCard = {
  ...defaultConfig.Card,
  inline: true,
  background: (c) => c.colors.c3,
  alpha: 0.08,
  border: "none",
};
defaultConfig.Callout = {
  iconSize: "22px",
  color: (c) => c.colors.c1,
  alpha: 0.05,
  padding: 4,
};

defaultConfig.NavigationController = {
  spring: (c) => c.springs.medium,
  padding: 20,
  fadeOpacity: 0.5,
};

defaultConfig.Divider = {
  color: (c) => c.colors.c6,
};

export default defaultConfig;
