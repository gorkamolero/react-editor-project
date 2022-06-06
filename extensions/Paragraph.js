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
    console.log(editor.view.state.selection)
    // console.log(editor.state.doc.content.size - 2)
  },

  onTransaction({ editor }) {
    console.log(editor.view.state.selection)
  },

  addCommands() {
    return {
      moveTweet:
        (index, direction) =>
        ({ editor }) => {
          const destIndex = index + direction
          const tweets = editor.getJSON().content
          if (destIndex < 0 || destIndex > tweets.length - 1) return

          const srcTweet = tweets[index]
          const destTweet = tweets[destIndex]

          // check if we're moving a thread finisher tweet at an invalid index
          if (destIndex === 0 || index === 0) {
            // notif.error('Thread finisher is not allowed as first tweet')
            return
          }

          // move tweet
          tweets[destIndex] = srcTweet
          tweets[index] = destTweet

          // setTimeout: ensures we can reason on selection after editor content is updated
          setTimeout(() => {
            editor.commands.setContent(tweets, true)
            editor.commands.setSelectionToTweetAtIndex(
              destIndex,
              destIndex > 0 ? 4 : -4
            )
            editor.commands.addToHistory(true)
            // simpleScrollToTweet(0, true)
          })
        },
      setSelectionToTweetAtIndex:
        (index, offset) =>
        ({ editor, commands }) => {
          const { start } = tweetEditorPosition(editor, index)
          commands.setTextSelection(start + offset)
        },
      moveTweetUp:
        () =>
        ({ editor, commands }) => {
          commands.moveTweet(getSelectedTweetIndex(editor), -1)
        },
      moveTweetDown:
        () =>
        ({ editor, commands }) => {
          commands.moveTweet(getSelectedTweetIndex(editor), +1)
        },
      setParagraph:
        () =>
        ({ commands, editor }) => {
          return commands.insertContent({ type: this.name })
        }
    }
  },

  addKeyboardShortcuts() {
    return {
      // 'Mod-Enter': ({ editor }) => editor.commands.setParagraph(),
      'alt-ArrowUp': ({ editor }) => editor.commands.setTextSelection(1),
      // 'alt-ArrowUp': () => this.editor.commands.moveTweetUp(),
      // 'alt-ArrowDown': () => this.editor.commands.moveTweetDown()
    }
  }
})
