import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import Paragraph from '../components/blocks/Paragraph'
import {
  getSelectedTweetIndex,
  tweetEditorPosition
} from '../components/editorUtils'

export default Node.create({
  name: 'paragraph',
  draggable: true,
  addOptions: {
    HTMLAttributes: {
      draggable: true
    }
  },
  group: 'block',
  content: 'inline*',
  selectable: false,

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

  onUpdate({ editor, state }) {
    editor.chain().focus(1)
    // console.log(editor.state.selection.anchor)
    console.log(editor)
  },

  onTransaction({ editor }) {
    console.log(editor.view.state.selection)
  },

  addCommands() {
    return {
      setParagraph:
        () =>
        ({ commands, editor }) => {
          return commands.first([
            () => commands.insertContent({ type: this.name }),
            () => commands.focus(1)
          ])
        }
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Enter': ({ editor }) => editor.commands.setParagraph(),
      'alt-ArrowUp': ({ editor }) => editor.commands.setTextSelection(1),
      'Mod-a': ({ editor }) =>
        editor.commands.setTextSelection({
          from: 0,
          to: editor.state.selection.anchor
        })
    }
  }
})
