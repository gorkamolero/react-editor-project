import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import { useConfig } from '../hooks/configHooks'
import useIsClient from '../hooks/useIsClient'
import { mergeProps } from '../utils/deepMerge'

type ExpandableProps = {
  show: boolean
  animateWidth?: boolean
  animateHeight?: boolean
  animateOpacity?: boolean
  animateInitially?: boolean
  overflow?: 'visible' | 'hidden'
  duration?: number
  delay?: number
  bounce?: number
  children: React.ReactNode
}

export default function Expandable(props: ExpandableProps) {
  const config = useConfig()
  const isClient = useIsClient()

  const {
    show,
    animateWidth,
    animateHeight,
    animateOpacity,
    animateInitially,
    overflow,
    duration,
    delay,
    bounce,
    children
  }: ExpandableProps = mergeProps(config.Expandable, props)

  const startingOpacity = animateOpacity ? 0 : 1
  const startingWidth = animateWidth ? 0 : 'auto'
  const startingHeight = animateHeight ? 0 : 'auto'

  const initial = {
    opacity: startingOpacity,
    width: startingWidth,
    height: startingHeight
  }
  const final = { opacity: 1, width: 'auto', height: 'auto' }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={isClient || animateInitially ? initial : false}
          animate={final}
          exit={initial}
          transition={{
            type: 'spring',
            duration,
            bounce,
            delay
          }}
          style={{
            overflow
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
