import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import Component from '../components/Component'

export default Node.create({
  name: 'reactComponent',
  priority: 1000,
  draggable: true,
  group: 'block',
  content: 'inline*',
  addKeyboardShortcuts() {
    return {
      'Mod-Backspace': () => {
        return this.editor.commands.deleteNode(this.name)
      },
      Enter: () => {
        return this.editor
          .chain()
          .focus()
          .insertContent(`<react-component></react-component>`)
          .run()
      },
      Backspace: () => {
        if (this.editor.getText().length === 0) {
          return this.editor.commands.clearContent(true)
        }
        return false
      }
    }
  },
  parseHTML: () => {
    return [{ tag: 'react-component' }]
  },

  renderHTML: ({ HTMLAttributes }) => {
    return ['react-component', mergeAttributes(HTMLAttributes), 0]
  },

  addNodeView: () => {
    return ReactNodeViewRenderer(Component)
  }
})
