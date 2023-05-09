import { ITweetAttrs } from "./ITweetAttrs";
import { IParagraph } from "./IParagraph";

export interface IRichTextTweet {
	type: "tweet";
	content: IParagraph[];
	attrs: ITweetAttrs;
}
