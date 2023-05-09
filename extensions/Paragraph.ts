import { Editor, Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import Paragraph from "../components/blocks/Paragraph";
import {
	convertEmptyParagraphsToNewTweets,
	getSelectedTweetIndex,
	sanitizeContent,
	tweetEditorPosition,
} from "../components/editorUtils";
import parseTweet from "../utils/parseTweet";
import { TweetAttrs } from "../components/TweetAttrs";
import { addTweetCommandEnter } from "../hooks/useAddTweet";

function shouldPreventOnUpdate({
	transaction,
}: {
	editor: Editor;
	transaction: any;
}) {
	// Fix writing accents and diacritics in Safari.
	const ignoredChars = new Set(["`", "´", "¨", "ˆ", "˜"]);

	const insertedChar =
		transaction?.steps?.[0]?.slice?.content?.content?.[0]?.text;
	if (ignoredChars.has(insertedChar)) {
		return true;
	}

	return false;
}

const Tweet = Node.create({
	name: "tweet",
	group: "block",
	content: "paragraph*",
	inline: false,
	draggable: true,
	addAttributes() {
		return TweetAttrs.getDefaultAttrs();
	},

	// I DO NOT UNDERSTAND THIS ONE
	onUpdate({ editor, transaction }) {
		if (shouldPreventOnUpdate({ editor, transaction })) {
			return;
		}

		const {
			content: sanitizedContent,
			selection: sanitizedSelection,
			sanitized,
		} = sanitizeContent(editor);
		if (sanitized) {
			editor
				.chain()
				.setMeta("preventUpdate", true)
				.setContent(sanitizedContent)
				.setTextSelection(sanitizedSelection)
				.run();
		}

		const initialTweetsNumber = editor.getJSON().content.length;
		let { content, selection, affectedIndex } =
			convertEmptyParagraphsToNewTweets(editor);

		// Set Thread Finisher to false in case it happened to arrive at index 0 of the thread
		// It can happen by deleting all preceding tweets or by drag and dropping
		if (content[0].attrs.isThreadFinisher === true) {
			content[0].attrs = { ...content[0].attrs, isThreadFinisher: false };
			notif.error("Thread finisher removed from first tweet.");
		}

		// sanitize in case of tweet merge
		editor
			.chain()
			.setMeta("preventUpdate", true)
			.setContent(content)
			.setTextSelection(selection)
			.run();

		// * In case a tweet was split, cursor position should be at the stat of the new tweet.
		// needed to fix glitches caused by some needed logic in convertEmptyParagraphsToNewTweets.
		if (initialTweetsNumber + 1 === content.length) {
			const { start } = tweetEditorPosition(editor, affectedIndex + 1);
			editor.commands.setTextSelection(start + 2);
			selection = start + 2;
		}

		const chain = editor.chain();

		// Highlight text over char count:
		// for (let tIndex = Math.max(affectedIndex - 1, 0); tIndex < Math.min(content.length, affectedIndex + 2); tIndex++) {
		for (let tIndex = 0; tIndex < content.length; tIndex++) {
			const { start, end } = tweetEditorPosition(editor, tIndex);
			chain
				.setMeta("preventUpdate", true)
				.setTextSelection({ from: start, to: end })
				.unsetHighlight();

			const headNumbering =
				(editor.storage.kvStorage.headNumbering ?? [])[tIndex] ?? "";
			const tailNumbering =
				(editor.storage.kvStorage.tailNumbering ?? [])[tIndex] ?? "";
			const currNumbering = headNumbering + tailNumbering;
			const parsedTweet = parseTweet(
				currNumbering + content[tIndex].attrs.text
			);

			if (!parsedTweet.valid) {
				const validRangeEnd = parsedTweet.validRangeEnd + 1;
				const pCount =
					content[tIndex].attrs.text
						.substring(0, parsedTweet.validRangeEnd)
						.split("\n").length + 1;
				const outOfBoundsStart = start + validRangeEnd + pCount;
				chain
					.setTextSelection({
						from: outOfBoundsStart - currNumbering.length,
						to: end,
					})
					.setHighlight({ color: "hsla(360, 100%, 65%, 0.25)" });
			}
		}
		chain.setTextSelection(selection).run();

		const finalTweetsNumber = content.length;
		if (initialTweetsNumber !== finalTweetsNumber) {
			// simpleScrollToTweet()
		}

		editor.chain().focus(1);

		// Add to History
		if (editor.extensionStorage.customHistory.shouldIgnoreAddToHistory) {
			editor.extensionStorage.customHistory.shouldIgnoreAddToHistory = false;
		} else {
			editor.commands.addToHistory();
		}
	},

	parseHTML: () => {
		return [{ tag: 'div[data-type="draggable-item"]' }];
	},

	renderHTML: ({ HTMLAttributes }) => {
		return [
			"div",
			mergeAttributes(HTMLAttributes, { "data-type": "draggable-item" }),
			0,
		];
	},

	addNodeView: () => {
		return ReactNodeViewRenderer(Paragraph);
	},

	// onUpdate: ({ editor, getPos, node }) => {
	//   const txt = editor.getText()
	//   console.log(editor.getText())
	//   if (txt.includes('\n\n')) {
	//     console.log('Break', editor)
	//   }
	// },

	// onUpdate({ editor, state }) {
	//   editor.chain().focus(1)
	//   console.log(editor)
	// },

	// onTransaction({ editor }) {
	//   console.log(editor.view.state.selection)
	// },

	addCommands() {
		return {
			moveTweet:
				(index, direction) =>
				({ editor }) => {
					const destIndex = index + direction;
					const tweets = editor.getJSON().content;
					if (destIndex < 0 || destIndex > tweets.length - 1) return;

					const srcTweet = tweets[index];
					const destTweet = tweets[destIndex];

					// check if we're moving a thread finisher tweet at an invalid index
					if (destIndex === 0 || index === 0) {
						// notif.error('Thread finisher is not allowed as first tweet')
						return;
					}

					// move tweet
					tweets[destIndex] = srcTweet;
					tweets[index] = destTweet;

					// setTimeout: ensures we can reason on selection after editor content is updated
					setTimeout(() => {
						editor.commands.setContent(tweets, true);
						editor.commands.setSelectionToTweetAtIndex(
							destIndex,
							destIndex > 0 ? 4 : -4
						);
						editor.commands.addToHistory(true);
						// simpleScrollToTweet(0, true)
					});
				},
			setSelectionToTweetAtIndex:
				(index, offset) =>
				({ editor, commands }) => {
					const { start } = tweetEditorPosition(editor, index);
					commands.setTextSelection(start + offset);
				},
			moveTweetUp:
				() =>
				({ editor, commands }) => {
					commands.moveTweet(getSelectedTweetIndex(editor), -1);
				},
			moveTweetDown:
				() =>
				({ editor, commands }) => {
					commands.moveTweet(getSelectedTweetIndex(editor), +1);
				},
			setParagraph:
				() =>
				({ commands }) => {
					return commands.insertContent({ type: this.name });
				},
		};
	},

	// TODO: Fix this
	addKeyboardShortcuts() {
		return {
			"Mod-Enter": () => {
				addTweetCommandEnter(this.editor);
			},
			// 'alt-ArrowUp': () => this.editor.commands.moveTweetUp(),
			// 'alt-ArrowDown': () => this.editor.commands.moveTweetDown()
		};
	},
});

export default Tweet;
