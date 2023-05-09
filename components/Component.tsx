import React from 'react'
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'
import { GrDrag } from 'react-icons/gr'

const Component = () => {
  return (
    <NodeViewWrapper className='flex items-center'>
      <GrDrag className='text-gray-400 grab' data-drag-handle size={15} />
      <NodeViewContent
        as={'p'}
        className='w-full border-1 border-gray-400 rounded-sm'
      />
    </NodeViewWrapper>
  )
}

export default Component;