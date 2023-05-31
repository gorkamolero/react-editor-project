export interface ISentence {
	type: string;
	text: string;
	content?: {
		text?: string;
		[key: string]: any;
	}
}
