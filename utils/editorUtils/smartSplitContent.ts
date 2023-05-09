import { TweetAttrs } from "../../components/TweetAttrs";
import updatedTextAndCharCountAttrs from "./updatedTextAndCharCountAttrs";
import shouldSmartSplitContent from "./shouldSmartSplitContent";
import shouldSmartSplitTweet from "./shouldSmartSplitTweet";
import parseTweet from "../parseTweet";
import { splitTweetTextInSentences } from "./splitTweetTextInSentences";
import pToString from "./pToString";
import trimEmptyParagraphs from "./trimEmptyParagraphs";
import compressEmptyParagraphs from "./compressEmptyParagraphs";

// TYPE IMPORTS
import { IRichTextTweet } from "../../types/IRichTextTweet";
import { IParagraph } from "../../types/IParagraph";

function smartSplitContent(content: IRichTextTweet[]) {
	const maxChars = 280;

	content = content.map((tweet) => {
		return { ...tweet, content: compressEmptyParagraphs(tweet.content) };
	});

	// until there is at least one tweet that needs and can to be split
	while (shouldSmartSplitContent(content)) {
		for (let tIndex = 0; tIndex < content.length; tIndex++) {
			const tweet = content[tIndex];

			// if the tweet exceeds max chars, and has more than one sentence or paragraph
			if (shouldSmartSplitTweet(tweet)) {
				let pForOldTweet: IParagraph[] = []; // will replace the content of the current tweet
				let pForNewTweet: IParagraph[] = []; // the exceeding content for the new tweet, to be added after the current one

				let charCount = 0;
				if (tweet.content.length > 1) {
					// split at the paragraph that makes the tweet length exceed
					for (let pIndex = 0; pIndex < tweet.content.length; pIndex++) {
						const paragraph = tweet.content[pIndex];

						// need to parse the paragraph text into a twitter-style text,
						// in order to get the correct length (as it would be counted by Twitter)
						charCount += parseTweet(pToString(paragraph)).weightedLength;

						if (charCount <= maxChars || pForOldTweet.length === 0) {
							pForOldTweet.push(paragraph);
						} else {
							pForNewTweet.push(paragraph);
						}
					}
				} else {
					// if tweet has only one paragraph, split at the sentence that makes the tweet length exceed
					const sentences = splitTweetTextInSentences(tweet);
					let oldText = "";
					let newText = "";
					for (let sIndex = 0; sIndex < sentences.length; sIndex++) {
						const sentence = sentences[sIndex];
						// need to parse the sentence text into a twitter-style text,
						// in order to get the correct length (as it would be counted by Twitter)
						charCount += parseTweet(sentence).weightedLength;
						if (charCount <= maxChars || oldText.length === 0) {
							oldText += sentence;
						} else {
							newText += sentence;
						}
					}
					pForOldTweet = [
						{
							type: "paragraph",
							content: [{ type: "paragraph", text: oldText }],
						},
					];
					pForNewTweet = [
						{
							type: "paragraph",
							content: [{ type: "paragraph", text: newText }],
						},
					];
				}

				pForOldTweet = trimEmptyParagraphs(pForOldTweet);
				pForNewTweet = trimEmptyParagraphs(pForNewTweet);

				// replace the content of the current tweet to avoid exceeding content
				const oldTweet = { ...tweet, content: pForOldTweet };
				oldTweet.attrs = { ...updatedTextAndCharCountAttrs(oldTweet) };

				// add the exceeding content to the new tweet
				// TODO: ask if the type should be "paragraph" or "tweet"
				const newTweet = {
					type: "paragraph",
					content: pForNewTweet,
					attrs: TweetAttrs.getDefaultAttrs(),
				};
				newTweet.attrs = { ...updatedTextAndCharCountAttrs(newTweet) };

				if (pForOldTweet.length === 0 || pForNewTweet.length === 0) {
					// any change would be inconsequential, and would lead to an infinite loop
					// so return current content
					return content;
				}

				content[tIndex] = oldTweet;
				content.splice(tIndex + 1, 0, newTweet);
			}
		}
	}
	return content;
}

export default smartSplitContent;
