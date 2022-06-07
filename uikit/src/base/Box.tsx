import React, { HTMLInputTypeAttribute } from 'react'
import { isDevBuild } from '../env'
import { useConfig } from '../hooks/configHooks'
import { CssSize } from '../types'
import cleanedProps from '../utils/cleanedProps'
const flatten = require('lodash.flatten')

export interface UIKitCSSProperties extends React.CSSProperties {}

/**
 * Props provided by Box that are available to all components implemented with Box.
 */
export interface SharedBoxProps {
  as?: string | React.ComponentType
  children?: any
  style?: UIKitCSSProperties
  contentEditable?: boolean | 'true' | 'false' | 'inherit'
  role?: string
  id?: string
  type?: HTMLInputTypeAttribute
  className?: string
  onClick?: (event: any) => void

  target?: '_blank' | '_self' | '_parent' | '_top'
  rel?: 'noopener noreferrer' | 'noopener' | 'noreferrer'
  href?: string
  tabIndex?: string | number

  // sizing
  w?: CssSize
  width?: CssSize
  minW?: CssSize
  minWidth?: CssSize
  maxW?: CssSize
  maxWidth?: CssSize
  h?: CssSize
  height?: CssSize
  minH?: CssSize
  minHeight?: CssSize
  maxH?: CssSize
  maxHeight?: CssSize
  // margins
  m?: CssSize
  margin?: CssSize
  mt?: CssSize
  marginTop?: CssSize
  mr?: CssSize
  marginRight?: CssSize
  mb?: CssSize
  marginBottom?: CssSize
  ml?: CssSize
  marginLeft?: CssSize
  mx?: CssSize
  my?: CssSize
  // paddings
  p?: CssSize
  padding?: CssSize
  pt?: CssSize
  paddingTop?: CssSize
  pr?: CssSize
  paddingRight?: CssSize
  pb?: CssSize
  paddingBottom?: CssSize
  pl?: CssSize
  paddingLeft?: CssSize
  px?: CssSize
  py?: CssSize
  // display
  display?: string
  radius?: CssSize
  borderRadius?: CssSize
  b?: string
  border?: string
  bt?: string
  borderTop?: string
  br?: string
  borderRight?: string
  bl?: string
  borderLeft?: string
  bb?: string
  borderBottom?: string
  float?: string
  overflow?: string
  position?: string
  top?: string | number
  right?: string | number
  bottom?: string | number
  left?: string | number
  visibility?: string
  zIndex?: string | number
  // flex
  jc?: string
  justifyContent?: string
  ai?: string
  alignItems?: string
  fw?: string
  flexWrap?: string
  fd?: string
  flexDirection?: string
  // background
  bg?: string
  background?: string
  // shadow
  shadow?: string
  boxShadow?: string
  // color
  color?: string
  // boolean shortcuts
  noWrap?: boolean
  flex?: boolean
  fixed?: boolean
  sticky?: boolean
  absolute?: boolean
  flexCenter?: boolean
  stackIgnore?: boolean
}

type Props = SharedBoxProps & {}

type Ref = HTMLElement

const Box = React.forwardRef<Ref, Props>((props, ref) => {
  const { as: Component = 'div', style: externalStyle, ...rest } = props

  const externalProps = cleanedProps(rest, reservedPropNames)

  const config = useConfig()

  const style = {
    boxSizing: 'border-box',
    ...createStyles(props, config),
    ...externalStyle
  }

  return <Component ref={ref} style={style} {...externalProps} />
})

Box.displayName = 'Box'

const propertyMappings = [
  // sizing
  ['w', 'width'],
  ['minW', 'minWidth'],
  ['maxW', 'maxWidth'],
  ['h', 'height'],
  ['minH', 'minHeight'],
  ['maxH', 'maxHeight'],
  // margins
  ['m', 'margin'],
  ['mt', 'marginTop'],
  ['mr', 'marginRight'],
  ['mb', 'marginBottom'],
  ['ml', 'marginLeft'],
  ['mx', ['marginLeft', 'marginRight']],
  ['my', ['marginTop', 'marginBottom']],
  // paddings
  ['p', 'padding'],
  ['pt', 'paddingTop'],
  ['pr', 'paddingRight'],
  ['pb', 'paddingBottom'],
  ['pl', 'paddingLeft'],
  ['px', ['paddingLeft', 'paddingRight']],
  ['py', ['paddingTop', 'paddingBottom']],
  // display
  'display',
  ['radius', 'borderRadius'],
  ['b', 'border'],
  ['bt', 'borderTop'],
  ['br', 'borderRight'],
  ['bl', 'borderLeft'],
  ['bb', 'borderBottom'],
  'float',
  'overflow',
  'position',
  'top',
  'right',
  'bottom',
  'left',
  'visibility',
  'zIndex',
  // flex
  ['jc', 'justifyContent'],
  ['ai', 'alignItems'],
  ['fw', 'flexWrap'],
  ['fd', 'flexDirection'],
  // background
  ['bg', 'background'],
  // shadow
  ['shadow', 'boxShadow'],
  // color
  'color',
  // other
  'stackIgnore'
]

// prettier-ignore
const reservedPropNames = [
  "as",
  "noMargin",
  "noWrap",
  "centerAt",
  "breakAt",
  "showBelow",
  "showAbove",
  "hideBelow",
  "hideAbove",
  "flex",
  "flexCenter",
  "fixed",
  "sticky",
  "absolute",
  "center",
  "smallShadow",
  "bigShadow"
].concat(
  flatten(
    propertyMappings.map(p => {
      if (typeof p === "string") return p;
      if (Array.isArray(p) && Array.isArray(p[1])) return p[0];
      if (Array.isArray(p) && !Array.isArray(p[1])) return p;
      return null;
    })
  )
);

function createStyles(props, config) {
  return {
    ...mapProperties(propertyMappings, props, config),
    ...booleanShortcuts(
      // prettier-ignore
      [
        ["noWrap", { whiteSpace: "nowrap", textOverflow: "ellipsis", flexWrap: "nowrap" }],
        ["flex", { display: "flex" }],
        ["fixed", { position: "fixed" }],
        ["sticky", { position: "sticky" }],
        ["absolute", { position: "absolute" }],
        ["flexCenter", { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }],
      ],
      props
    )
  }
}

export function mapProperties(mappings, props, config) {
  const res = {}

  for (const mapping of mappings) {
    let shorthand, propertyName

    if (Array.isArray(mapping)) {
      ;[shorthand, propertyName] = mapping
    } else {
      shorthand = mapping
      propertyName = mapping
    }

    let value
    if (!Array.isArray(propertyName)) {
      value = props[shorthand]
      if (value === null || typeof value === 'undefined') {
        value = props[propertyName]
      }
    } else {
      value = props[shorthand]
    }

    if (typeof value !== 'undefined') {
      // handle this case: ["my", ["marginTop", "marginBottom"]]
      if (Array.isArray(propertyName)) {
        for (const propName of propertyName) {
          res[propName] = v(value, config)
        }
      } else {
        res[propertyName] = v(value, config)
      }
    }
  }

  return res
}

export function booleanShortcuts(definitions, props) {
  let res = {}
  for (const def of definitions) {
    const [name, styles] = def
    if (props[name] && typeof props[name] === 'boolean') {
      res = { ...res, ...styles }
    }
  }
  return res
}

export function v(provided, config) {
  if (typeof provided === 'string') return provided
  if (typeof provided === 'boolean') return provided
  if (typeof provided === 'function') return v(provided(config), config)
  if (typeof provided === 'number')
    return `${provided * config.baseUnit}${config.baseUnitType}`
  // TODO: remove when all projects updated to newest uikit
  if (isDevBuild) {
    if (Array.isArray(provided)) {
      throw Error(
        `Using an old responsive array as value for v(...): ${provided}`
      )
    }
    if (typeof provided === 'object') {
      throw Error(
        `Using an old responsive object as value for v(...): ${provided}`
      )
    }
  }
}

export default Box
