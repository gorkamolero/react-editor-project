import React from 'react'
import { forwardRef } from 'react'
import Stack, { StackProps } from './Stack'

type Props = StackProps
type Ref = HTMLElement

const VStack = forwardRef<Ref, Props>((props, ref) => {
  return <Stack align='left' vAlign='top' ref={ref} {...props} vertical />
})

VStack.displayName = 'VStack'

export default VStack
