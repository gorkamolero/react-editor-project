import { extensions as CoreExtensions } from '@tiptap/core'
import { Node as ProseMirrorNode } from 'prosemirror-model'
import { Plugin, PluginKey } from 'prosemirror-state'

export const CustomClipboardTextSerializer =
  CoreExtensions.ClipboardTextSerializer.extend({
    name: 'custom_clipboardTextSerializer',
    addProseMirrorPlugins() {
      return [
        new Plugin({
          key: new PluginKey('custom_clipboardTextSerializer'),
          props: {
            clipboardTextSerializer: () => {
              const { editor } = this
              const { state, schema } = editor
              const { doc, selection } = state
              const { ranges } = selection
              const from = Math.min(...ranges.map((range) => range.$from.pos))
              const to = Math.max(...ranges.map((range) => range.$to.pos))
              const range = { from, to }
              return getTextBetween(doc, range)
            }
          }
        })
      ]
    }
  })

function getTextBetween(
  startNode: ProseMirrorNode,
  range: { from: number; to: number }
): string {
  const { from, to } = range
  let text = ''

  startNode.nodesBetween(from, to, (node, pos, parent, index) => {
    if (node.type.name === 'paragraph') {
      text += '\n'
    } else if (node.type.name === 'tweet') {
      text += '\n\n\n\n'
    } else if (node.isText) {
      text += node?.text?.slice(Math.max(from, pos) - pos, to - pos)
    }
  })

  return text.trim()
}
