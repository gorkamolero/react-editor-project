export function tweetEditorPosition(editor, index) {
  let start = 0
  let end = 0

  for (let tIndex = 0; tIndex <= index; tIndex++) {
    start = end
    end += editor.state.doc.content.content[tIndex].nodeSize
  }

  return { start, end }
}

export function getSelectedTweetIndex(editor) {
  let counter = editor.view.state.selection.head
  let tNodes = editor.view.state.doc.content.content
  let selectedTweetIndex = 0

  for (let index = 0; index < tNodes.length; index++) {
    const element = tNodes[index]
    const contentSize = element.content.size + 2

    selectedTweetIndex = index

    counter -= contentSize
    if (counter <= 0) {
      break
    }
  }

  return selectedTweetIndex
}
