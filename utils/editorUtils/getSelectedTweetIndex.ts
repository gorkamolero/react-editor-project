function getSelectedTweetIndex(editor: any) {
	let counter = editor.view.state.selection.head;
	const tNodes = editor.view.state.doc.content.content;
	let selectedTweetIndex = 0;

	for (let index = 0; index < tNodes.length; index++) {
		const element = tNodes[index];
		// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
		const contentSize = element.content.size + 2;

		selectedTweetIndex = index;

		counter -= contentSize;
		if (counter <= 0) {
			break;
		}
	}

	return selectedTweetIndex;
}

export default getSelectedTweetIndex;
