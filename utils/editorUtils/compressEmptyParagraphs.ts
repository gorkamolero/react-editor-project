import trimEmptyParagraphs from "./trimEmptyParagraphs";

import { IParagraph } from "../../types/IParagraph";

function compressEmptyParagraphs(paragraphs: IParagraph[]) {
	let newParagraphs: IParagraph[] = [];
	for (let pIndex = 0; pIndex < paragraphs.length; pIndex++) {
		if (
			paragraphs[pIndex].content !== undefined ||
			(newParagraphs.length > 0 &&
				newParagraphs[newParagraphs.length - 1].content !== undefined)
		) {
			newParagraphs.push(paragraphs[pIndex]);
		}
	}
	newParagraphs = trimEmptyParagraphs(newParagraphs);
	return newParagraphs;
}

export default compressEmptyParagraphs;
