import { TweetAttrs } from "../../components/TweetAttrs";

function createEmptyTweetEditorModel() {
	return {
		type: "tweet",
		attrs: TweetAttrs.getDefaultAttrs(),
		content: [{ type: "paragraph" }],
	};
}

export default createEmptyTweetEditorModel;
