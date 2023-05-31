import { IRichTextTweet } from "../../types/IRichTextTweet";

function splitTweetTextInSentences(tweet: IRichTextTweet) {
	return tweet.attrs.text
		.replace(/([.?!]\s)(?=[\w])/g, "$1|") // modified from original here: https://stackoverflow.com/a/18914855/2922642
		.split("|")
		.filter((s) => s.length > 0);
}

export default splitTweetTextInSentences;
