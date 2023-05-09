import { ISentence } from "./ISentence";

export interface IParagraph {
	type: string;
	content: (IParagraph | ISentence)[] | undefined;
	text?: string;
}
