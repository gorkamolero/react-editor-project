export function convertEmptyParagraphsToNewTweets(editor) {
  let content = cloneDeep(editor.getJSON().content)
  if (!content) return

  let cursorPosition = editor.view.state.selection.head
  const selectedTweetIndex = getSelectedTweetIndex(editor)
  let affectedIndex = selectedTweetIndex

  // iterate over all tweets (in reverse order to split on )
  for (let tweetIndex = 0; tweetIndex < content.length; tweetIndex++) {
    let emptyParagraphsCount = 0
    const tweetNode = content[tweetIndex]
    if (!tweetNode.content) continue

    // iterate over the tweet content, until we find enough empty paragraphs to split tweets
    for (let pIndex = 0; pIndex < tweetNode.content.length; pIndex++) {
      const pNode = tweetNode.content[pIndex]

      // hitting a written paragraph. reset count
      if (pNode.content) {
        emptyParagraphsCount = 0
        continue
      }
      // avoid considering the current paragraph if it is the last one
      else if (pIndex === tweetNode.content.length - 1) {
        continue
      }
      // hitting an empty paragraph. increment counter
      else {
        emptyParagraphsCount++
      }

      // added one last empty paragraph on top of two already empty paragraphs
      const splitAtTweetEnd =
        tweetNode.content.length >= 3 &&
        !tweetNode.content[tweetNode.content.length - 1].content &&
        !tweetNode.content[tweetNode.content.length - 2].content &&
        !tweetNode.content[tweetNode.content.length - 3].content

      if (
        // split with 2 empty paragraphs only if typing at end of tweet
        (splitAtTweetEnd && pIndex === tweetNode.content.length - 2) ||
        // spilt anywhere with 4 empty paragraphs
        emptyParagraphsCount === 4
      ) {
        // remove the empty paragraph
        const splitAtParagraphIndex = pIndex + 1
        // take paragraphs from breakAtIndex to end
        let pForNewTweet = tweetNode.content.slice(splitAtParagraphIndex)
        let attrsForNewTweet = TweetAttrs.getDefaultAttrs()

        if (pForNewTweet.length === 0) {
          pForNewTweet = [{ type: 'paragraph' }]
          cursorPosition += 2
        }

        // remove empty paragraphs from end (tweet above the split)
        content[tweetIndex].content.splice(
          splitAtParagraphIndex - emptyParagraphsCount
        )

        // if we are splitting from the middle of the tweet we should "move" all media from the current tweet (tweetIndex) to the new tweet
        if (!splitAtTweetEnd) {
          attrsForNewTweet.images = tweetNode.attrs.images
          attrsForNewTweet.videos = tweetNode.attrs.videos
          attrsForNewTweet.gifs = tweetNode.attrs.gifs
          content[tweetIndex].attrs = {
            ...content[tweetIndex].attrs,
            images: [],
            videos: [],
            gifs: []
          }
        }

        // insert tweet with excess new paragraphs from previous tweet (tweet after the split)
        content.splice(tweetIndex + 1, 0, {
          type: 'tweet',
          attrs: attrsForNewTweet,
          content: pForNewTweet
        })

        // * Remove cursor positions (each paragraph accounts for 2 positions)
        // and account for the new tweet amount of positions
        //
        // NB. This will put the cursor 2 positions ahead after the split
        // if the split was triggered from an empty line.
        // It will be fixed in TiptapTweetExtension.js after this function call.
        cursorPosition -= emptyParagraphsCount * 2 - 4

        if ((content[affectedIndex].content?.length ?? 0) === 0) {
          content[affectedIndex].content = [{ type: 'paragraph' }]
          cursorPosition += emptyParagraphsCount
          cursorPosition += 2
        }

        affectedIndex = tweetIndex
        break
      }
    }
    content[tweetIndex].attrs = updatedTextAndCharCountAttrs(
      content[tweetIndex]
    )
  }

  return { content: content, selection: cursorPosition, affectedIndex }
}

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
