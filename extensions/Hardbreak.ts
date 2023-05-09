import { Node, mergeAttributes } from "@tiptap/core";

export default Node.create({
	name: "hardbreak",
	// TODO: in the Node.create() function, addOptions is expected to be a function that returns an object, but it's not here!
	addOptions: {
		HTMLAttributes: {},
	},
	inline: true,
	group: "inline",
	selectable: false,

	parseHTML() {
		return [{ tag: "br" }];
	},

	renderHTML({ HTMLAttributes }) {
		return ["br", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
	},

	addCommands() {
		return {
			setHardBreak:
				() =>
				({ commands }) => {
					return commands.first([
						() => commands.exitCode(),
						() => commands.insertContent({ type: this.name }),
					]);
				},
		};
	},

	addKeyboardShortcuts() {
		return {
			Enter: () => this.editor.commands.setHardBreak(),
		};
	},
});
