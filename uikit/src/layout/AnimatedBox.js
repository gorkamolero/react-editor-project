import { jsx } from '@emotion/core'
import { motion, useAnimation } from 'framer-motion'
import { forwardRef, useEffect, useRef } from 'react'
import Box from '../base/Box'
import { useConfig } from '../hooks/configHooks'
import { mergeProps } from '../utils/deepMerge'
import mergeRefs from '../utils/mergeRefs'

const AnimatedBox = forwardRef((props, ref) => {
  const config = useConfig()
  const {
    spring = config.springs.medium,
    children,
    deps = [children],
    ...otherProps
  } = mergeProps(config.AnimatedBox, props)

  const [controls, motionRef] = useAutoHeightAnimation(deps)

  const animatedProps = {
    as: motion.div,
    animate: controls,
    transition: { type: 'spring', ...spring },
    ref: mergeRefs(ref, motionRef)
  }

  return (
    <Box ref={ref} {...animatedProps} {...otherProps}>
      {children}
    </Box>
  )
})

function useAutoHeightAnimation(deps) {
  const controls = useAnimation()
  const ref = useRef(null)
  const height = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    ref.current.style.height = 'auto'
    const newHeight = ref.current.offsetHeight

    if (height.current !== null) {
      controls.set({ height: height.current })
      controls.start({ height: newHeight })
    }

    height.current = newHeight
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, controls, ...deps])

  return [controls, ref]
}

AnimatedBox.displayName = 'AnimatedBox'

export default AnimatedBox
