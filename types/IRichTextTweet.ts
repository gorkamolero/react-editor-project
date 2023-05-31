import { ITweetAttrs } from "./ITweetAttrs";
import { IParagraph } from "./IParagraph";

export interface IRichTextTweet {
	type: 'tweet' | 'paragraph';
	content: IParagraph[];
	attrs: ITweetAttrs;
}
