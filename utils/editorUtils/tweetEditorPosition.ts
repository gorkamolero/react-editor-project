import { Editor } from "@tiptap/react";

function tweetEditorPosition(editor: Editor, index: number) {
	let start = 0;
	let end = 0;

	for (let tIndex = 0; tIndex <= index; tIndex++) {
		start = end;
		// I do not know if this extra .content is needed because it throws an error
		end += editor.state.doc.content.content[tIndex].content.nodeSize;
		// end += editor.state.doc.content.content[tIndex].nodeSize;
	}

	return { start, end };
}

export default tweetEditorPosition;
