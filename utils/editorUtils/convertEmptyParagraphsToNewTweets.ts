import { Editor } from "@tiptap/core";
import { JSONContent } from "@tiptap/react";

import getSelectedTweetIndex from "./getSelectedTweetIndex";
import { TweetAttrs } from "../../components/TweetAttrs";
import updatedAttrs from "./updatedAttrs";
import { IRichTextTweet } from "../../types/IRichTextTweet";

function splitContent({ content, tweetIndex, pForNewTweet, attrsForNewTweet }) {
	content.splice(tweetIndex + 1, 0, {
    type: 'tweet',
    attrs: attrsForNewTweet,
    content: pForNewTweet,
  });

  return content;
}

/**
 * This function converts empty paragraphs to new tweets.
 * @param editor - The editor object.
 * @param json - The JSON content.
 * @returns The content, selection and affected index.
 */
function convertEmptyParagraphsToNewTweets({editor, json}: {editor: Editor, json: JSONContent}) {
  // Get the content from the JSON object.
  let content = json.content as unknown as IRichTextTweet[];

  // If there is no content, return.
  if (!content || !content.length) return;

  // Get the cursor position and selected tweet index.
  let cursorPosition = editor.view.state.selection.head;
  const selectedTweetIndex = getSelectedTweetIndex(editor);
  let affectedIndex = selectedTweetIndex;

  // Iterate over all tweets (in reverse order to split on).
  for (let tweetIndex = 0; tweetIndex < content.length; tweetIndex++) {
    // Initialize the empty paragraph count and get the tweet node and content.
    let emptyParagraphsCount = 0;
    const tweetNode = content[tweetIndex];
    const tweetNodeContent = tweetNode.content;

    // If there is no tweet node content, continue.
    if (!tweetNodeContent) continue;

    // Iterate over the tweet content, until we find enough empty paragraphs to split tweets.
    for (let pIndex = 0; pIndex < tweetNode.content.length; pIndex++) {
      const pNode = tweetNode.content[pIndex];

      // Check if the paragraph is empty.
      const hasContent = !!pNode.content;
      const doesntHaveContent = !hasContent;
      const hasFirstChild = hasContent && !!pNode.content[0];
      const firstChildIsNotParagraph = hasContent && pNode.content[0].type !== 'paragraph';
      const firstChildTextIsEmpty = hasContent && pNode.content[0].text === '';
      const isEmptyText = hasFirstChild && firstChildIsNotParagraph && firstChildTextIsEmpty;
      const contentHasNoContent = hasContent && !pNode.content[0].content;
      const isEmptyParagraph = hasFirstChild && !firstChildIsNotParagraph && contentHasNoContent;
      const isEmpty = doesntHaveContent || isEmptyText || isEmptyParagraph;

      // If the paragraph is not empty, reset the empty paragraph count and continue.
      if (!isEmpty) {
        emptyParagraphsCount = 0;
        continue;
			} else {
				// If the paragraph is empty, increment the empty paragraph count.
        emptyParagraphsCount++;
      }
      

      // If there are 2 consecutive empty paragraphs, split the tweet.
      if (emptyParagraphsCount === 3) {
        // Remove the empty paragraphs.
        const splitAtParagraphIndex = pIndex + 1;
        // Take paragraphs from breakAtIndex to end.
        let pForNewTweet = tweetNodeContent.slice(splitAtParagraphIndex);

        let attrsForNewTweet = TweetAttrs.getDefaultAttrs();

        // If there are no paragraphs, add a new paragraph and update the cursor position.
        if (pForNewTweet.length === 0) {
          pForNewTweet = [{ type: 'paragraph' }];
          cursorPosition += 2;
        }

        // Remove empty paragraphs from end (tweet above the split).
        content[tweetIndex].content.splice(splitAtParagraphIndex - emptyParagraphsCount);

        // If we are splitting from the middle of the tweet we should "move" all media from the current tweet (tweetIndex) to the new tweet.
        attrsForNewTweet.link = tweetNode.attrs.link;
        content[tweetIndex].attrs = {
          ...content[tweetIndex].attrs,
          link: null,
          isSelected: null,
        };

        // Insert tweet with excess new paragraphs from previous tweet (tweet after the split).
        content = splitContent({
          content,
          tweetIndex,
          pForNewTweet,
          attrsForNewTweet,
        });

        // Remove cursor positions (each paragraph accounts for 2 positions)
        // and account for the new tweet amount of positions.
        // This will put the cursor 2 positions ahead after the split
        // if the split was triggered from an empty line.
        cursorPosition -= emptyParagraphsCount * 2 - 4;

        // If the affected index has no content, add a new paragraph and update the cursor position.
        if ((content[affectedIndex]?.content?.length ?? 0) === 0) {
          content[affectedIndex].content = [{ type: 'paragraph' }];
          cursorPosition += emptyParagraphsCount;
          cursorPosition += 2;
        }

        affectedIndex = tweetIndex;
        break;
      }
    }

    // Update the tweet attributes.
    content[tweetIndex].attrs = updatedAttrs(
      content[tweetIndex] as unknown as IRichTextTweet,
      content,
      selectedTweetIndex
    );
  }

  // Return the content, selection and affected index.
  return { content, selection: cursorPosition, affectedIndex };
}

export default convertEmptyParagraphsToNewTweets;
