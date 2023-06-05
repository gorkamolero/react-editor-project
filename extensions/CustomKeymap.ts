import { extensions as CoreExtensions } from "@tiptap/core";
import { Editor } from "@tiptap/react";
import getSelectedTweetIndex from "../utils/editorUtils/getSelectedTweetIndex";
import tweetEditorPosition from "../utils/editorUtils/tweetEditorPosition";

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
		
    const handleSelectAll = ({ editor }) => {
      const editorSelection = {};
      const { start, end } = tweetEditorPosition(
        editor,
        getSelectedTweetIndex(editor),
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

    const handleSelectBefore = ({ editor }) => {
      const editorSelection = {};
      const { start, end } = tweetEditorPosition(
        editor,
        getSelectedTweetIndex(editor),
      );

      editorSelection.start = editor.view.state.selection.anchor;
      editorSelection.end = editor.view.state.selection.head;

      if (editorSelection.start - 2 === start) {
        const previousTweet = tweetEditorPosition(
          editor,
          getSelectedTweetIndex(editor) - 1,
        );

        if (previousTweet && previousTweet?.end) {
          editor
            .chain()
            .setTextSelection(previousTweet.start + 1)
            .run();

          return editor.commands.setTextSelection({
            from: previousTweet.start + 2,
            to: previousTweet.end - 1,
          });
        }
      } else {
        return editor.commands.setTextSelection({
          from: start,
          to: editorSelection.end,
        });
      }
    };

    const handleSelectAfter = ({ editor }) => {
      const editorSelection = {};
      const { start, end } = tweetEditorPosition(
        editor,
        getSelectedTweetIndex(editor),
      );

      editorSelection.start = editor.view.state.selection.anchor;
      editorSelection.end = editor.view.state.selection.head;

      const atEnd = editorSelection.end === end - 1;

      if (
        (editorSelection.start + 2 === end &&
          editorSelection.end + 2 === end) ||
        atEnd
      ) {
        const nextTweet = tweetEditorPosition(
          editor,
          getSelectedTweetIndex(editor) + 1,
        );

        if (nextTweet && nextTweet?.start && nextTweet?.end) {
          editor
            .chain()
            .setTextSelection(nextTweet.start + 1)
            .run();

          if (atEnd) return;

          return editor.commands.setTextSelection({
            from: start + 2,
            to: nextTweet.end - 2,
          });
        }
      } else {
        return editor.commands.setTextSelection({
          from: editorSelection.start,
          to: end - 1,
        });
      }
    };

    const handleGoToBeginningOfTweet = ({ editor }) => {
      const tweetIndex = getSelectedTweetIndex(editor);

      const { start } = tweetEditorPosition(editor, tweetIndex);

      const anchor = editor.view.state.selection.anchor;

      const isAtStartOfTweet = anchor === start + 1;

      if (isAtStartOfTweet) {
        return editor.commands.setSelectionToTweetAtIndex(tweetIndex - 1, 0);
      }

      return editor.commands.setTextSelection(start + 1);
    };

    const handleGoToEndOfTweet = ({ editor }) => {
      const tweetIndex = getSelectedTweetIndex(editor);
      const { start, end } = tweetEditorPosition(editor, tweetIndex);

      const anchor = editor.view.state.selection.anchor;

      const isAtStartOfTweet = anchor === start + 2 || anchor + 2 === end;
      const isAtEndOfTweet = anchor === end - 2;

      if (isAtEndOfTweet) {
        const nextTweet = tweetEditorPosition(
          editor,
          getSelectedTweetIndex(editor) + 1,
        );

        if (nextTweet && nextTweet?.start && nextTweet?.end) {
          editor
            .chain()
            .setTextSelection(nextTweet.start + 1)
            .run();

          return editor.commands.setTextSelection({
            from: start + 2,
            to: nextTweet.end - 2,
          });
        }
      }

      if (isAtStartOfTweet) return editor.commands.setTextSelection(end - 2);

      return editor.commands.setTextSelection(end - 1);
    };

		const handleBackspace = ({ editor }) => {
			const currentTweetIndex = getSelectedTweetIndex(editor);
			const { start } = tweetEditorPosition(editor, currentTweetIndex);

			const anchor = editor.view.state.selection.anchor;

			const isAtStartOfTweet = anchor === start + 2;

			const isFirstTweet = currentTweetIndex === 0;

			if (!isAtStartOfTweet || isFirstTweet) return;

			let currentContent = editor.getJSON().content[currentTweetIndex].content;
			
			const previousContent = editor.getJSON().content[currentTweetIndex - 1].content;

			const mixedContent = [...previousContent, ...currentContent];

			const content = editor.getJSON().content;
			// delete current tweet
			content.splice(currentTweetIndex, 1);

			// set previous tweet to mixed content
			content[currentTweetIndex - 1].content = mixedContent;

			// prevent backspace
			setContentHacky(content, currentTweetIndex)
			
			editor.commands.setContent(content);

			return false;
		}

    return {
      'Mod-a': handleSelectAll,
      'Shift-Mod-ArrowUp': handleSelectBefore,
      'Shift-Mod-ArrowDown': handleSelectAfter,
      'Mod-ArrowUp': handleGoToBeginningOfTweet,
      'Mod-ArrowDown': handleGoToEndOfTweet,
			'Backspace': handleBackspace,
    };
	},
});

const setContentHacky = (content, currentTweetIndex) => {
	// find circular last text element and add a space
	const lastContentElement = content[currentTweetIndex - 1].content[
		content[currentTweetIndex - 1].content.length - 1
	]

	const lastTextElement = lastContentElement.content[lastContentElement.content.length - 1];

	if (lastTextElement.type === 'text') {
		lastTextElement.text = lastTextElement.text + ' ';
	}

	// put that back into the content
	content[currentTweetIndex - 1].content[
		content[currentTweetIndex - 1].content.length - 1
	].content[
		content[currentTweetIndex - 1].content[
			content[currentTweetIndex - 1].content.length - 1
		].content.length - 1
	] = lastTextElement;
}