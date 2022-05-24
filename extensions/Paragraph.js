import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import Paragraph from '../components/blocks/Paragraph'

export default Node.create({
  name: 'paragraph',
  priority: 1000,
  draggable: true,
  addOptions: {
    HTMLAttributes: {
      draggable: true
    }
  },
  group: 'block',
  content: 'inline*',
  selectable: true,

  parseHTML: () => {
    return [{ tag: 'div[data-type="draggable-item"]' }]
  },

  renderHTML: ({ HTMLAttributes }) => {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-type': 'draggable-item' }),
      0
    ]
  },

  addNodeView: () => {
    return ReactNodeViewRenderer(Paragraph)
  },

  // onUpdate: ({ editor, getPos, node }) => {
  //   const txt = editor.getText()
  //   console.log(editor.getText())
  //   if (txt.includes('\n\n')) {
  //     console.log('Break', editor)
  //   }
  // },

  addCommands() {
    return {
      setParagraph:
        () =>
        ({ commands }) => {
          return commands.first([
            () => commands.insertContent({ type: this.name })
          ])
        }
    }
  },

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => editor.commands.splitBlock()
    }
  }
})
