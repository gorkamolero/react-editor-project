import { ITweetAttrs } from "./ITweetAttrs";
import { IParagraph } from "./IParagraph";

export interface IRichTextTweet<T = "tweet"> {
	type: T;
	content: IParagraph[];
	attrs: ITweetAttrs;
}
