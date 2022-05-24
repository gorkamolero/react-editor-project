import { Node, mergeAttributes } from '@tiptap/core'

export default Node.create({
  name: 'hardbreak',
  addOptions: {
    HTMLAttributes: {}
  },
  inline: true,
  group: 'inline',
  selectable: false,

  parseHTML() {
    return [{ tag: 'br' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['br', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
  },

  addCommands() {
    return {
      setHardBreak:
        () =>
        ({ commands }) => {
          return commands.first([
            () => commands.exitCode(),
            () => commands.insertContent({ type: this.name })
          ])
        }
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Enter': () => this.editor.commands.setHardBreak()
    }
  }
})
