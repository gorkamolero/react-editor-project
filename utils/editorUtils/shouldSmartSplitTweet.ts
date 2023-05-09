import { splitTweetTextInSentences } from "./splitTweetTextInSentences";
import { IRichTextTweet } from "../../types/IRichTextTweet";

function shouldSmartSplitTweet(tweet: IRichTextTweet) {
	const maxChars = 280;

	return (
		tweet.attrs.charCount > maxChars &&
		(tweet.content.length > 1 || splitTweetTextInSentences(tweet).length > 1)
	);
}

export default shouldSmartSplitTweet;
