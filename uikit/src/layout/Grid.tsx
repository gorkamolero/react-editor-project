import { css, SerializedStyles } from '@emotion/core'
import { forwardRef } from 'react'
import Box, { SharedBoxProps, v } from '../base/Box'
import { useConfig } from '../hooks/configHooks'
import { CssSize, HorizontalAlign, VerticalAlign } from '../types'
import { translateAlignToFlex } from '../utils'

export type GridProps = SharedBoxProps & {
  columns?: string
  rows?: string
  gap?: CssSize
  align?: HorizontalAlign
  vAlign?: VerticalAlign
  breakAt?: CssSize
  id?: string
  CSS?: SerializedStyles
  expand?: boolean
}

const Grid = forwardRef<HTMLElement, GridProps>((props: GridProps, ref) => {
  const config = useConfig()

  const { gridGap } = config.layout

  const {
    children,
    columns = '1fr 1fr',
    gap: providedGap = gridGap,
    rows = '1fr',
    align,
    vAlign = 'stretch',
    breakAt,
    id,
    CSS: externalCSS,
    expand,
    width,
    ...otherProps
  } = props

  const gap = v(providedGap, config)

  const alignItems = translateAlignToFlex(vAlign)
  const justifyItems = translateAlignToFlex(align)

  const mainCSS = css`
    box-sizing: border-box;
    display: grid;
    grid-template-columns: ${columns};
    grid-template-rows: ${rows};
    grid-gap: ${gap};
    grid-column-gap: ${gap};
    grid-row-gap: ${gap};
    align-items: ${alignItems};
    ${align ? `justify-items: ${justifyItems};` : ''}
    ${width ? `width: ${width};` : ''}
    ${expand
      ? `
      flex: 1 1 auto;
      width: 100%;`
      : ''}
    ${breakAt
      ? css`
          @media (max-width: ${(typeof breakAt === 'string'
              ? parseFloat(breakAt)
              : breakAt) + 'px'}) {
            grid-template-columns: 1fr;
          }
        `
      : ''}
  `

  return (
    <Box css={[mainCSS, externalCSS]} ref={ref} {...otherProps}>
      {children}
    </Box>
  )
})

Grid.displayName = 'Grid'

export default Grid
