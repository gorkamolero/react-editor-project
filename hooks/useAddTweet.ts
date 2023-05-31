import { Editor } from "@tiptap/core";

export function addTweetCommandEnter(editor: Editor) {
	const numTweets = editor.getJSON().content.length;
	editor.commands.focus();
	editor.chain().keyboardShortcut("Enter").run();
	let counter = 0;
	while (editor.getJSON().content.length !== numTweets + 1 && counter < 2) {
		counter += 1;
		editor.chain().keyboardShortcut("Enter").run();
	}
}
