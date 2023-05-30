import { Editor } from "@tiptap/react";

import { IRichTextTweet } from "../../types/IRichTextTweet";
import { TweetAttrs } from "../../components/TweetAttrs";
import { IParagraph } from "../../types/IParagraph";

// Type of content is not consistent in this function, do no want to mess things up by changing it
function sanitizeContent(editor: Editor) {
	let content = editor.getJSON().content as any;
	const selection = editor.view.state.selection.head;
	let sanitized = false;

	// content should not be empty
	if (!content || content.length === 0) {
		content = {
			type: "paragraph",
			attrs: TweetAttrs.getDefaultAttrs(),
			content: [{ type: "paragraph" }],
		};
		sanitized = true;
		return { content, selection, sanitized };
	}

	// content should have at least one paragraph
	content = content.map((tweet: IRichTextTweet) => {
		const newTweet = tweet;
		if (!tweet.content || tweet.content.length === 0) {
			sanitized = true;
			newTweet.content = [{ type: "paragraph" }];
		}
		return newTweet;
	});

	return { content, selection, sanitized };
}

export default sanitizeContent;
