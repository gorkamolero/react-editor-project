import { ISentence } from "./ISentence";

export interface IParagraph {
	type: string;
	content?: ISentence[];
	text?: string;
}
