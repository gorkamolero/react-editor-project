import twitter from "twitter-text";

export default function parseTweet(text: string) {
	return twitter.parseTweet(text);
}
