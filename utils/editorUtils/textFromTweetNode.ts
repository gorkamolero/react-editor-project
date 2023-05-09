import { IRichTextTweet } from "../../types/IRichTextTweet";

function textFromTweetNode(tweet: IRichTextTweet) {
	const paragraphsText = (tweet.content ?? []).map((p) => {
		if (p.content?.content) {
			return p.content.content.map((el) => el.text).join("");
		} else if (p.content) {
			return p.content.map((el) => el.text).join("");
		}
	});
	const text = paragraphsText.join("\n");
	return text;
}

export default textFromTweetNode;
