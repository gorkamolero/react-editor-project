import * as linkify from "linkifyjs";

function extractURLsFromText(tweetText: string) {
	return linkify
		.find(tweetText)
		.filter((el) => el.type === "url" && el.isLink === true)
		.map((el) => el.href);
}

export default extractURLsFromText;
