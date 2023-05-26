import { Editor } from "@tiptap/core";
import cloneDeep from "lodash.clonedeep";

import getSelectedTweetIndex from "./getSelectedTweetIndex";
import { TweetAttrs } from "../../components/TweetAttrs";
import updatedAttrs from "./updatedAttrs";
import { IRichTextTweet } from "../../types/IRichTextTweet";

function convertEmptyParagraphsToNewTweets(editor: Editor) {
	const content = cloneDeep(editor.getJSON().content);
	if (!content) return;

	let cursorPosition = editor.view.state.selection.head;
	const selectedTweetIndex = getSelectedTweetIndex(editor);
	let affectedIndex = selectedTweetIndex;

	// iterate over all tweets (in reverse order to split on )
	for (let tweetIndex = 0; tweetIndex < content.length; tweetIndex++) {
		let emptyParagraphsCount = 0;
		const tweetNode = content[tweetIndex];
    const tweetNodeContent = tweetNode.content;
		
		if (!tweetNodeContent) continue;

		// iterate over the tweet content, until we find enough empty paragraphs to split tweets
		for (let pIndex = 0; pIndex < tweetNode.content.length; pIndex++) {
			const pNode = tweetNode.content[pIndex];

			// hitting a written paragraph. reset count
			const hasContent = !!pNode.content;
      const doesntHaveContent = !hasContent;

      const hasFirstChild = hasContent && !!pNode.content[0];
      const firstChildIsNotParagraph =
        hasContent && pNode.content[0].type !== 'paragraph';
      const firstChildTextIsEmpty = hasContent && pNode.content[0].text === '';

      const isEmptyText =
        hasFirstChild && firstChildIsNotParagraph && firstChildTextIsEmpty;

      const contentHasNoContent = hasContent && !pNode.content[0].content;

      const isEmptyParagraph =
        hasFirstChild && !firstChildIsNotParagraph && contentHasNoContent;

      const isEmpty = doesntHaveContent || isEmptyText || isEmptyParagraph;

      const isImage = pNode.type === 'image';

      if (!isEmpty || isImage) {
        emptyParagraphsCount = 0;
        continue;
      }
      // avoid considering the current paragraph if it is the last one
      else if (pIndex === tweetNodeContent.length - 1) {
        continue;
      }

      // hitting an empty paragraph. increment counter
      else {
        emptyParagraphsCount++;
      }

			// added one last empty paragraph on top of two already empty paragraphs
			const splitAtTweetEnd =
				tweetNode.content.length >= 3 &&
				!tweetNode.content[tweetNode.content.length - 1].content &&
				!tweetNode.content[tweetNode.content.length - 2].content &&
				!tweetNode.content[tweetNode.content.length - 3].content;

			const atEndOfTweet = pIndex === tweetNodeContent.length - 2;

			if (
        // split with 2 empty paragraphs only if typing at end of tweet
        (splitAtTweetEnd && atEndOfTweet) ||
        // split anywhere with 2 empty paragraphs (just in case)
        emptyParagraphsCount === 2
      ) {
        // remove the empty paragraph
        const splitAtParagraphIndex = pIndex + 1;
        // take paragraphs from breakAtIndex to end
        let pForNewTweet = tweetNodeContent.slice(splitAtParagraphIndex);

        let attrsForNewTweet = TweetAttrs.getDefaultAttrs();

        if (pForNewTweet.length === 0) {
          pForNewTweet = [{ type: 'paragraph' }];
          cursorPosition += 2;
        }

        // remove empty paragraphs from end (tweet above the split)
        content[tweetIndex].content.splice(
          splitAtParagraphIndex - emptyParagraphsCount,
        );

        // if we are splitting from the middle of the tweet we should "move" all media from the current tweet (tweetIndex) to the new tweet
        if (!splitAtTweetEnd) {
          attrsForNewTweet.images = tweetNode.attrs.images;
          attrsForNewTweet.link = tweetNode.attrs.link;
          content[tweetIndex].attrs = {
            ...content[tweetIndex].attrs,
            images: [],
            link: null,
            selected: null,
          };
        }

        // insert tweet with excess new paragraphs from previous tweet (tweet after the split)
        content = content.splice(tweetIndex + 1, 0, {
					type: 'tweet',
					attrs: attrsForNewTweet,
					content: pForNewTweet,
				});;

        // * Remove cursor positions (each paragraph accounts for 2 positions)
        // and account for the new tweet amount of positions
        // This will put the cursor 2 positions ahead after the split
        // if the split was triggered from an empty line.
        cursorPosition -= emptyParagraphsCount * 2 - 4;

        if ((content[affectedIndex].content?.length ?? 0) === 0) {
          content[affectedIndex].content = [{ type: 'paragraph' }];
          cursorPosition += emptyParagraphsCount;
          cursorPosition += 2;
        }

        affectedIndex = tweetIndex;
        break;
      }
		}
		content[tweetIndex].attrs = updatedAttrs(
			content[tweetIndex] as IRichTextTweet,
			content,
			tweetIndex
		);
	}

	return { content, selection: cursorPosition, affectedIndex };
}

export default convertEmptyParagraphsToNewTweets;
