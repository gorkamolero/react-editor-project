import { IParagraph } from "../../types/IParagraph";

function trimEmptyParagraphs(paragraphs: IParagraph[]) {
	const newParagraphs = [...paragraphs];

	let didFindFilledParagraph = false;
	let emptyPCount = 0;

	for (let pIndex = 0; pIndex < paragraphs.length; pIndex++) {
		if (paragraphs[pIndex] && !paragraphs[pIndex].content) {
			emptyPCount += 1;

			if (!didFindFilledParagraph || pIndex === paragraphs.length - 1) {
				newParagraphs.splice(pIndex, emptyPCount);
				emptyPCount = 0;
			}
		} else {
			didFindFilledParagraph = true;
		}
	}
	return newParagraphs;
}

export default trimEmptyParagraphs;
