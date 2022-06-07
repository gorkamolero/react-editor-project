import { css, jsx } from '@emotion/core'
import Box, { v } from '../base/Box'
import { useConfig } from '../hooks/configHooks'
import { translateAlignToFlex } from '../utils'
import { mergeProps } from '../utils/deepMerge'

const AutoGrid = (props) => {
  const config = useConfig()

  const {
    children,
    direction = 'horizontal',
    cellWidth = '6em',
    gap: providedGap,
    align,
    fill,
    vAlign = 'stretch',
    breakAt = '0px',
    ...otherProps
  } = mergeProps(config.Grid, props)

  const gap = v(providedGap, config)

  const alignItems = translateAlignToFlex(vAlign)
  const justifyItems = translateAlignToFlex(align)

  const mainCSS = css`
    display: grid;
    width: 100%;
    align-items: ${alignItems};
    ${align ? `justify-items: ${justifyItems};` : ''}
    ${(direction === 'horizontal'
      ? `grid-template-columns: repeat(
      auto-${fill ? 'fill' : 'fit'},
      minmax(${cellWidth}, 1fr)
    )`
      : '') ||
    `grid-template-rows: repeat(
      auto-${fill ? 'fill' : 'fit'},
      minmax(${cellWidth}, 1fr)
    )`};
    grid-gap: ${gap};
    @media (max-width: ${breakAt}) {
      grid-template-columns: 1fr;
    }
  `

  return (
    <Box css={mainCSS} {...otherProps}>
      {children}
    </Box>
  )
}

export default AutoGrid
