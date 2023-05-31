import cloneDeep from "lodash.clonedeep";

import textFromTweetNode from "./textFromTweetNode";
import parseTweet from "../parseTweet";
import { IRichTextTweet } from "../../types/IRichTextTweet";
import { ITweetAttrs } from "../../types/ITweetAttrs";
import linkFromText from "./linkFromText";

function updatedAttrs(tweet: IRichTextTweet, content?: any, selectedTweetIndex?: number): ITweetAttrs {
	const newTweet = cloneDeep(tweet);
	if (!newTweet.content) {
		return { ...newTweet.attrs, text: "", charCount: 0 };
	}

	const text = textFromTweetNode(newTweet);
  const link = linkFromText(text);
  
	const lastTweet = content[content.length - 1];
	const isLastTweet = lastTweet?.attrs?.id === newTweet?.attrs?.id || false;
  const isSelected = content[selectedTweetIndex]?.attrs?.id === newTweet?.attrs?.id || false;
	
	return {
		...newTweet.attrs,
		text,
		charCount: parseTweet(text).weightedLength,
		link,
    isThreadFinisher: isLastTweet,
    isSelected,
	};
}

export default updatedAttrs;
