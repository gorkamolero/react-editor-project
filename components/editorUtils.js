import * as linkify from 'linkifyjs'
import cloneDeep from 'lodash.clonedeep'
import parseTweet from '../utils/parseTweet'
import { TweetAttrs } from './TweetAttrs'

export function sanitizeContent(editor) {
  let content = editor.getJSON().content
  let selection = editor.view.state.selection.head
  let sanitized = false

  // content should not be empty
  if (!content || content.length === 0) {
    content = {
      type: 'paragraph',
      attrs: TweetAttrs.getDefaultAttrs(),
      content: [{ type: 'paragraph' }]
    }
    sanitized = true
    return { content, selection, sanitized }
  }

  // content should have at least one paragraph
  content = content.map((tweet) => {
    let newTweet = tweet
    if (!tweet.content || tweet.content.length === 0) {
      sanitized = true
      newTweet.content = [{ type: 'paragraph' }]
    }
    return newTweet
  })

  return { content, selection, sanitized }
}

const NUM_NEWLINES_FOR_TWEET_SPLIT = 2

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

export function updatedTextAndCharCountAttrs(tweet) {
  const newTweet = cloneDeep(tweet)
  if (!newTweet.content) {
    return { ...newTweet.attrs, text: '', charCount: 0 }
  }

  const text = textFromTweetNode(newTweet)
  return { ...newTweet.attrs, text, charCount: parseTweet(text).weightedLength }
}

export function textFromTweetNode(tweet) {
  let paragraphsText = (tweet.content ?? []).map((p) => {
    if (p.content?.content) {
      return p.content.content.map((el) => el.text).join('')
    } else if (p.content) {
      return p.content.map((el) => el.text).join('')
    }
  })
  let text = paragraphsText.join('\n')
  return text
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

export function extractURLsFromText(tweetText) {
  return linkify
    .find(tweetText)
    .filter((el) => el.type === 'url' && el.isLink === true)
    .map((el) => el.href)
}

export function createEmptyTweetEditorModel() {
  return {
    type: 'tweet',
    attrs: TweetAttrs.getDefaultAttrs(),
    content: [{ type: 'paragraph' }]
  }
}

export function shouldSmartSplitContent(content) {
  return content.find((tweet) => shouldSmartSplitTweet(tweet))
}

export function smartSplitContent(content) {
  const maxChars = 280

  /// returns a spaced string from the joined text nodes inside a paragraph
  function pToString(p) {
    if (!p.content) return ''
    return p.content.map((el) => el.text).join('')
  }

  /// trims empty paragraphs from the beginning and end of a list of paragraphs
  function trimEmptyParagraphs(paragraphs) {
    let newParagraphs = [...paragraphs]

    let didFindFilledParagraph = false
    let emptyPCount = 0

    for (let pIndex = 0; pIndex < paragraphs.length; pIndex++) {
      if (paragraphs[pIndex] && !paragraphs[pIndex].content) {
        emptyPCount += 1

        if (!didFindFilledParagraph || pIndex === paragraphs.length - 1) {
          newParagraphs.splice(pIndex, emptyPCount)
          emptyPCount = 0
        }
      } else {
        didFindFilledParagraph = true
      }
    }
    return newParagraphs
  }

  // merge multiple empty paragraphs into one at most
  function compressEmptyParagraphs(paragraphs) {
    let newParagraphs = []
    for (let pIndex = 0; pIndex < paragraphs.length; pIndex++) {
      if (
        paragraphs[pIndex].content !== undefined ||
        (newParagraphs.length > 0 &&
          newParagraphs[newParagraphs.length - 1].content !== undefined)
      ) {
        newParagraphs.push(paragraphs[pIndex])
      }
    }
    newParagraphs = trimEmptyParagraphs(newParagraphs)
    return newParagraphs
  }

  content = content.map((tweet) => {
    return { ...tweet, content: compressEmptyParagraphs(tweet.content) }
  })

  // until there is at least one tweet that needs and can to be split
  while (shouldSmartSplitContent(content)) {
    for (let tIndex = 0; tIndex < content.length; tIndex++) {
      const tweet = content[tIndex]

      // if the tweet exceeds max chars, and has more than one sentence or paragraph
      if (shouldSmartSplitTweet(tweet)) {
        let pForOldTweet = [] // will replace the content of the current tweet
        let pForNewTweet = [] // the exceeding content for the new tweet, to be added after the current one

        let charCount = 0
        if (tweet.content.length > 1) {
          // split at the paragraph that makes the tweet length exceed
          for (let pIndex = 0; pIndex < tweet.content.length; pIndex++) {
            const paragraph = tweet.content[pIndex]

            // need to parse the paragraph text into a twitter-style text,
            // in order to get the correct length (as it would be counted by Twitter)
            charCount += parseTweet(pToString(paragraph)).weightedLength

            if (charCount <= maxChars || pForOldTweet.length === 0) {
              pForOldTweet.push(paragraph)
            } else {
              pForNewTweet.push(paragraph)
            }
          }
        } else {
          // if tweet has only one paragraph, split at the sentence that makes the tweet length exceed
          const sentences = splitTweetTextInSentences(tweet)
          let oldText = ''
          let newText = ''
          for (let sIndex = 0; sIndex < sentences.length; sIndex++) {
            const sentence = sentences[sIndex]
            // need to parse the sentence text into a twitter-style text,
            // in order to get the correct length (as it would be counted by Twitter)
            charCount += parseTweet(sentence).weightedLength
            if (charCount <= maxChars || oldText.length === 0) {
              oldText += sentence
            } else {
              newText += sentence
            }
          }
          pForOldTweet = [
            {
              type: 'paragraph',
              content: [{ type: 'paragraph', text: oldText }]
            }
          ]
          pForNewTweet = [
            {
              type: 'paragraph',
              content: [{ type: 'paragraph', text: newText }]
            }
          ]
        }

        pForOldTweet = trimEmptyParagraphs(pForOldTweet)
        pForNewTweet = trimEmptyParagraphs(pForNewTweet)

        // replace the content of the current tweet to avoid exceeding content
        let oldTweet = { ...tweet, content: pForOldTweet }
        oldTweet.attrs = { ...updatedTextAndCharCountAttrs(oldTweet) }

        // add the exceeding content to the new tweet
        let newTweet = {
          type: 'paragraph',
          content: pForNewTweet,
          attrs: TweetAttrs.getDefaultAttrs()
        }
        newTweet.attrs = { ...updatedTextAndCharCountAttrs(newTweet) }

        if (pForOldTweet.length === 0 || pForNewTweet.length === 0) {
          // any change would be inconsequential, and would lead to an infinite loop
          // so return current content
          return content
        }

        content[tIndex] = oldTweet
        content.splice(tIndex + 1, 0, newTweet)
      }
    }
  }
  return content
}

function shouldSmartSplitTweet(tweet) {
  const maxChars = 280

  return (
    tweet.attrs.charCount > maxChars &&
    (tweet.content.length > 1 || splitTweetTextInSentences(tweet).length > 1)
  )
}

function splitTweetTextInSentences(tweet) {
  return tweet.attrs.text
    .replace(/([.?!]\s)(?=[\w])/g, '$1|') // modified from original here: https://stackoverflow.com/a/18914855/2922642
    .split('|')
    .filter((s) => s.length > 0)
}
