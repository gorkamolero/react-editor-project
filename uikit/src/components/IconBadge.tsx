import React from 'react'
import { css } from '@emotion/core'
import Box, { v } from '../base/Box'
import { useConfig } from '../hooks/configHooks'
import { CssSize } from '../types'
import { transparent } from '../utils/colorUtils'
import { mergeProps } from '../utils/deepMerge'
import { Icon, IconName } from './Icon'

type IconBadgeProps = {
  name: IconName
  color?: string
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
  backgroundAlpha?: number
  size?: CssSize
  iconSize?: number
  iconOffset?: number
  CSS?: any
}

const IconBadge = (props: IconBadgeProps) => {
  const config = useConfig()

  const {
    name,
    color,
    onClick,
    backgroundAlpha,
    size: providedSize,
    iconSize: providedIconSize,
    iconOffset,
    CSS: externalCSS,
    ...otherProps
  } = mergeProps(config.iconBadge, props)

  const size = v(providedSize, config)
  const iconSize = v(providedIconSize, config)

  const bgColor = transparent(color, backgroundAlpha)

  const wrapperCSS = css`
    background: ${bgColor};
    width: ${size};
    height: ${size};
    border-radius: ${size};
    display: flex;
    ${onClick ? 'cursor: pointer;' : ''}
    svg {
      margin: auto;
      width: ${iconSize};
      height: ${iconSize};
    }
  `

  return (
    <Box css={[wrapperCSS, externalCSS]} onClick={onClick} {...otherProps}>
      <Icon color={color} name={name} size={iconSize} offset={iconOffset} />
    </Box>
  )
}

export default IconBadge
