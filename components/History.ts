import { Editor, Extension } from "@tiptap/core";
import deepEqual from "../utils/deepEqual";

export interface HistoryOptions {
	depth: number;
	newGroupDelay: number;
}

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		history: {
			/**
			 * Undo recent changes
			 */
			undo: () => ReturnType;
			/**
			 * Reapply reverted changes
			 */
			redo: () => ReturnType;
		};
	}
}

export const History = Extension.create<HistoryOptions>({
	name: "customHistory",

	addStorage() {
		return {
			historyStack: [],
			currentHistoryIndex: -1,
			shouldIgnoreAddToHistory: false,
			timeoutId: null as null | number,
		};
	},

	addOptions() {
		return {
			depth: 1000,
			newGroupDelay: 100,
		};
	},

	addCommands() {
		return {
			reset:
				() =>
				({}) => {
					this.storage.historyStack = [];
					this.storage.currentHistoryIndex = -1;
					this.storage.shouldIgnoreAddToHistory = false;
					this.storage.timeoutId = null;
				},
			addToHistory:
				(immediate: boolean) =>
				({}) => {
					if (!this.editor.isEditable) return;

					if (immediate) {
						writeHistory(this);
					} else {
						if (this.storage.timeoutId) {
							window.clearTimeout(this.storage.timeoutId);
							this.storage.timeoutId = null;
						}

						this.storage.timeoutId = window.setTimeout(() => {
							writeHistory(this);
						}, this.options.newGroupDelay);
					}
				},
			undo:
				() =>
				({ chain }) => {
					if (!this.editor.isEditable) return false;

					// if we are at the beginning of the stack return
					if (this.storage.currentHistoryIndex <= 0) {
						return chain().run();
					}

					this.storage.shouldIgnoreAddToHistory = true;

					// set current history index to previous snapshot
					this.storage.currentHistoryIndex = Math.max(
						0,
						this.storage.currentHistoryIndex - 1
					);
					const snapshot =
						this.storage.historyStack[this.storage.currentHistoryIndex];
					return chain()
						.setContent(snapshot.content, true)
						.setTextSelection(snapshot.selection)
						.run();
				},
			redo:
				() =>
				({ chain }) => {
					if (!this.editor.isEditable) return false;

					// if we are at the end of the stack return
					if (
						this.storage.currentHistoryIndex === -1 ||
						this.storage.currentHistoryIndex >= this.storage.historyStack.length
					) {
						return chain().run();
					}
					// set current history index to next snapshot
					this.storage.currentHistoryIndex = Math.min(
						this.storage.historyStack.length - 1,
						this.storage.currentHistoryIndex + 1
					);

					this.storage.shouldIgnoreAddToHistory = true;

					const snapshot =
						this.storage.historyStack[this.storage.currentHistoryIndex];
					return chain()
						.setContent(snapshot.content, true)
						.setTextSelection(snapshot.selection)
						.run();
				},
		};
	},

	addKeyboardShortcuts() {
		return {
			"Mod-z": () => this.editor.commands.undo(),
			"Shift-Mod-z": () => this.editor.commands.redo(),

			// Russian keyboard layouts
			"Mod-я": () => this.editor.commands.undo(),
			"Shift-Mod-я": () => this.editor.commands.redo(),
		};
	},
});

function writeHistory(ctx: { editor: Editor; storage: any; options: any }) {
	// check if the new change is the same as the last change
	const lastChange =
		ctx.storage.historyStack[ctx.storage.historyStack.length - 1];
	if (deepEqual(lastChange?.content, ctx.editor.getJSON().content)) {
		return;
	}

	// remove all future history from stack
	if (ctx.storage.currentHistoryIndex < ctx.storage.historyStack.length - 1) {
		// if we are not at the end of the stack we need to remove all future history
		ctx.storage.historyStack = ctx.storage.historyStack.slice(
			0,
			ctx.storage.currentHistoryIndex + 1
		);
	}
	// remove exceeding history from stack
	if (ctx.storage.historyStack.length === ctx.options.depth) {
		ctx.storage.historyStack.shift();
	}
	// add new snapshot to the stack
	ctx.storage.historyStack = [
		...ctx.storage.historyStack,
		{
			content: ctx.editor.getJSON().content,
			selection: ctx.editor.view.state.selection.$anchor.pos,
		},
	];
	// set current history index to the end of the stack
	ctx.storage.currentHistoryIndex = ctx.storage.historyStack.length - 1;
}
