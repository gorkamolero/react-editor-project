import { Editor } from "@tiptap/core";

function tweetEditorPosition(editor: Editor, index: number) {
	let start = 0;
	let end = 0;

	for (let tIndex = 0; tIndex <= index; tIndex++) {
		start = end;
		end += editor.state.doc.content.content[tIndex].nodeSize;
	}

	return { start, end };
}

export default tweetEditorPosition;
