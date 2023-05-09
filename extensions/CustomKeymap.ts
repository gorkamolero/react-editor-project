import { extensions as CoreExtensions, Editor } from "@tiptap/core";
import {
	getSelectedTweetIndex,
	tweetEditorPosition,
} from "../components/editorUtils";

const Keymap = CoreExtensions.Keymap;

/** 
  Overrides the Enter/Return behavior from @tiptap/core's own Keymap extension.
  We need this to avoid splitting into multiple tweets when pressing return
  while on an empty paragraph:

  ------
  Line 1
  <empty paragraph> <- pressing Enter here splits in two tweets (without this extension) and does not trigger our custom splitting logic
  Line 2
  ------
*/
export const CustomKeymap = Keymap.extend({
	name: "custom_keymap",
	addKeyboardShortcuts() {
		const handleSelectAll = ({ editor }: { editor: Editor }) => {
			const editorSelection = {} as { start: number; end: number };
			const { start, end } = tweetEditorPosition(
				editor,
				getSelectedTweetIndex(editor)
			);

			editorSelection.start = editor.view.state.selection.anchor;
			editorSelection.end = editor.view.state.selection.head;

			if (
				editorSelection.start - 1 === start &&
				editorSelection.end + 1 === end
			) {
				// The whole tweet is already selected, so don't change the default selection behavior
				return;
			} else {
				// Select the whole tweet
				return editor.commands.setTextSelection({
					from: start + 1,
					to: end - 1,
				});
			}
		};

		return {
			// "Mod-Enter": () => {
			//   // Execute commands until one returns true (returning true stops the search for a command handler,
			//   // and prevents other lower-priority extensions from getting called)
			//   return this.editor.commands.first(({ commands }) => [
			//     () => commands.splitBlock()
			//   ])
			// },
			"Mod-a": handleSelectAll,
		};
	},
});
