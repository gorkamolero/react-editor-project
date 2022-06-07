import { forwardRef } from 'react'
import Stack, { StackProps } from './Stack'

type Props = StackProps
type Ref = HTMLElement

const HStack = forwardRef<Ref, Props>((props, ref) => {
  return <Stack vAlign='center' ref={ref} {...props} />
})

HStack.displayName = 'HStack'

export default HStack
