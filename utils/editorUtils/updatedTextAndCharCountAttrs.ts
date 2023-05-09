import cloneDeep from "lodash.clonedeep";

import textFromTweetNode from "./textFromTweetNode";
import parseTweet from "../parseTweet";
import { IRichTextTweet } from "../../types/IRichTextTweet";
import { ITweetAttrs } from "../../types/ITweetAttrs";

function updatedTextAndCharCountAttrs(tweet: IRichTextTweet): ITweetAttrs {
	const newTweet: IRichTextTweet = cloneDeep(tweet);
	if (!newTweet.content) {
		return { ...newTweet.attrs, text: "", charCount: 0 };
	}

	const text = textFromTweetNode(newTweet);
	return {
		...newTweet.attrs,
		text,
		charCount: parseTweet(text).weightedLength,
	};
}

export default updatedTextAndCharCountAttrs;
