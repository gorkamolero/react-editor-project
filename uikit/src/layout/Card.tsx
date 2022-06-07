import { CSSProperties, forwardRef } from 'react'
import Box, { SharedBoxProps, UIKitCSSProperties } from '../base/Box'
import Spinner from '../components/Spinner'
import { useConfig } from '../hooks/configHooks'
import { CssSize } from '../types'
import { mergeProps } from '../utils/deepMerge'

export type CardProps = SharedBoxProps & {
  inline?: boolean
  spring?: string
  border?: string
  background?: string
  padding?: string
  bigPadding?: string
  smallPadding?: string
  bigRadius?: CssSize
  smallRadius?: CssSize
  bigShadow?: string
  smallShadow?: string
  style?: UIKitCSSProperties
  // Boolean
  noShadow?: boolean
  loading?: boolean
  justChildren?: boolean
  center?: boolean
} & React.HTMLAttributes<HTMLDivElement>

const Card = forwardRef<HTMLElement, CardProps>((props, ref) => {
  const config = useConfig()
  const {
    children,
    inline,
    spring,
    border,
    background,
    padding: providedPadding,
    bigPadding,
    smallPadding,
    bigRadius,
    smallRadius,
    bigShadow,
    smallShadow,
    CSS: externalCSS,
    style,
    // Boolean
    noShadow = false,
    loading = false,
    justChildren,
    ...otherProps
  } = mergeProps(config.Card, props)

  if (justChildren) return children

  const radius = inline ? smallRadius : bigRadius
  const shadow = inline ? smallShadow : bigShadow
  const padding = providedPadding
    ? providedPadding
    : inline
    ? smallPadding
    : bigPadding

  const mainStyle = {
    position: 'relative',
    boxSizing: 'border-box',
    ...style
  }

  const loadingStyle: CSSProperties = {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: background,
    opacity: loading ? 0.8 : 0,
    transition: 'opacity 0.2s',
    borderRadius: bigRadius,
    pointerEvents: loading ? 'auto' : 'none'
  }

  return (
    <Box
      border={border}
      radius={radius}
      padding={padding}
      shadow={!noShadow ? shadow : ''}
      background={background}
      style={mainStyle}
      css={externalCSS}
      ref={ref}
      {...otherProps}
    >
      {children}
      <div style={loadingStyle}></div>
      {loading && <Spinner center />}
    </Box>
  )
})

Card.displayName = 'Card'

export default Card
