import React from 'react'
import { css, SerializedStyles } from '@emotion/core'
import { forwardRef } from 'react'
import tinycolor from 'tinycolor2'
import Text, { SharedTextProps } from './base/Text'
import { useConfig } from './hooks/configHooks'
import { CssSize } from './types'
import { getFontSize, getFontWeight, getLetterSpacing } from './utils.js'
import { getColorFromCssVariable } from './utils/colorUtils'
import { mergeProps } from './utils/deepMerge'

interface SharedHeaderProps {
  small?: boolean
  style?: React.CSSProperties
  emFontStyle?: string
}

interface SharedTypographyProps {
  CSS?: SerializedStyles
  centerAt?: CssSize
}

type HeaderProps = SharedTextProps & SharedHeaderProps & SharedTypographyProps
type ParagraphProps = SharedTextProps & SharedTypographyProps

type Ref = HTMLElement

const H1 = forwardRef<Ref, HeaderProps>((props: HeaderProps, ref) => {
  const config = useConfig()
  const {
    children,
    small,
    CSS: externalCSS,
    ...otherProps
  } = mergeProps(config.H1, props)

  const style = { ...config.H1.style, ...props.style }

  const mainCSS = css`
    ${getTypographyCss('H1', config, props)}
    a {
      ${createInlineLinksCss(config.inlineLinks)}
    }
    ${small ? makeSmallHeading(config) : ''}
  `

  return (
    <Text
      as='h1'
      ref={ref}
      style={style}
      css={[mainCSS, externalCSS]}
      {...otherProps}
    >
      {children}
    </Text>
  )
})

H1.displayName = 'H1'

const H2 = forwardRef<Ref, HeaderProps>((props: HeaderProps, ref) => {
  const config = useConfig()
  const {
    children,
    small,
    CSS: externalCSS,
    ...otherProps
  } = mergeProps(config.H2, props)

  const style = { ...config.H2.style, ...props.style }

  const mainCSS = css`
    ${getTypographyCss('H2', config, props)}
    a {
      ${createInlineLinksCss(config.inlineLinks)}
    }
    ${small ? makeSmallHeading(config) : ''}
  `

  return (
    <Text
      as='h2'
      ref={ref}
      style={style}
      css={[mainCSS, externalCSS]}
      {...otherProps}
    >
      {children}
    </Text>
  )
})

H2.displayName = 'H2'

const H3 = forwardRef<Ref, HeaderProps>((props: HeaderProps, ref) => {
  const config = useConfig()
  const {
    children,
    small,
    CSS: externalCSS,
    ...otherProps
  } = mergeProps(config.H3, props)

  const style = { ...config.H3.style, ...props.style }

  const mainCSS = css`
    ${getTypographyCss('H3', config, props)}
    a {
      ${createInlineLinksCss(config.inlineLinks)}
    }
    ${small ? makeSmallHeading(config) : ''}
  `
  return (
    <Text
      as='h3'
      ref={ref}
      style={style}
      css={[mainCSS, externalCSS]}
      {...otherProps}
    >
      {children}
    </Text>
  )
})

H3.displayName = 'H3'

const H4 = forwardRef<Ref, HeaderProps>((props: HeaderProps, ref) => {
  const config = useConfig()
  const {
    children,
    small,
    CSS: externalCSS,
    ...otherProps
  } = mergeProps(config.H4, props)

  const style = { ...config.H4.style, ...props.style }

  const mainCSS = css`
    ${getTypographyCss('H4', config, props)}
    a {
      ${createInlineLinksCss(config.inlineLinks)}
    }
    ${small ? makeSmallHeading(config) : ''}
  `

  return (
    <Text
      as='h4'
      ref={ref}
      style={style}
      css={[mainCSS, externalCSS]}
      {...otherProps}
    >
      {' '}
      {children}{' '}
    </Text>
  )
})

H4.displayName = 'H4'

const H5 = forwardRef<Ref, HeaderProps>((props: HeaderProps, ref) => {
  const config = useConfig()
  const {
    children,
    small,
    CSS: externalCSS,
    ...otherProps
  } = mergeProps(config.H5, props)

  const style = { ...config.H5.style, ...props.style }

  const mainCSS = css`
    ${getTypographyCss('H5', config, props)}
    a {
      ${createInlineLinksCss(config.inlineLinks)}
    }
    ${small ? makeSmallHeading(config) : ''}
  `

  return (
    <Text
      as='h5'
      ref={ref}
      style={style}
      css={[mainCSS, externalCSS]}
      {...otherProps}
    >
      {children}
    </Text>
  )
})

H5.displayName = 'H5'

const P1 = forwardRef<Ref, HeaderProps>((props: ParagraphProps, ref) => {
  const config = useConfig()

  const {
    children,
    CSS: externalCSS,
    ...otherProps
  } = mergeProps(config.P1, props)

  const mainCSS = css`
    ${getTypographyCss('P1', config, props)}
    a {
      ${createInlineLinksCss(config.inlineLinks)}
    }
  `

  return (
    <Text as='p' css={[mainCSS, externalCSS]} ref={ref} {...otherProps}>
      {children}
    </Text>
  )
})

P1.displayName = 'P1'

const P2 = forwardRef<Ref, HeaderProps>((props: ParagraphProps, ref) => {
  const config = useConfig()

  const {
    children,
    CSS: externalCSS,
    ...otherProps
  } = mergeProps(config.P2, props)

  const mainCSS = css`
    ${getTypographyCss('P2', config, props)}
    a {
      ${createInlineLinksCss(config.inlineLinks)}
    }
  `

  return (
    <Text as='p' css={[mainCSS, externalCSS]} ref={ref} {...otherProps}>
      {children}
    </Text>
  )
})

P2.displayName = 'P2'

const P3 = forwardRef<Ref, HeaderProps>((props: ParagraphProps, ref) => {
  const config = useConfig()
  const {
    children,
    CSS: externalCSS,
    ...otherProps
  } = mergeProps(config.P3, props)

  const mainCSS = css`
    ${getTypographyCss('P3', config, props)}
    a {
      ${createInlineLinksCss(config.inlineLinks)}
    }
  `

  return (
    <Text as='p' css={[mainCSS, externalCSS]} {...otherProps}>
      {children}
    </Text>
  )
})

P3.displayName = 'P3'

export function createInlineLinksCss(inlineLinksConfig) {
  const { color, textDecoration, fontWeight } = inlineLinksConfig
  const { show, size, color: borderColor, alpha } = inlineLinksConfig.border
  const parsedBorderColor = getColorFromCssVariable(borderColor)

  const borderColorTransparent = tinycolor(parsedBorderColor)
    .setAlpha(alpha)
    .toString()

  return `
    color: ${color};
    text-decoration: ${textDecoration};
    font-weight: ${fontWeight};
    ${
      show
        ? `
          border-bottom: ${size} solid ${borderColorTransparent};
          :hover {
            border-bottom: ${size} solid ${parsedBorderColor};
          }
        `
        : ''
    }
  `
}

export function getTypographyCss(elem, config, props) {
  const { centerAt } = props

  const parsedCenterAt = parseFloat(centerAt) + 'px'

  const f = config.fonts

  return css`
    margin: 0;
    color: ${f.colors[elem] || f.colors.normal || 'inherit'};
    font-family: ${f.faces[elem] || f.faces.normal || 'inherit'};
    line-height: ${f.lineHeights[elem] || f.lineHeights.normal || 'inherit'};
    ${centerAt
      ? `@media (max-width: ${parsedCenterAt}) {text-align: center !important;}`
      : ''}
    ${getFontSize(elem, config)}
    ${getFontWeight(elem, config)}
    ${getLetterSpacing(elem, config)}
  `
}

function makeSmallHeading(config) {
  const f = config.fonts
  return css`
    color: ${f.colors.smallHeading || f.colors.normal || 'inherit'};
    ${getFontSize('smallHeading', config)}
    ${getFontWeight('smallHeading', config)}
    ${f.smallHeading.uppercase ? 'text-transform: uppercase;' : ''}
  `
}

export { H1, H2, H3, H4, H5, P1, P2, P3 }
