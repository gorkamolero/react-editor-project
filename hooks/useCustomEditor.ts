import { useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Document from '@tiptap/extension-document'
import Mention from '@tiptap/extension-mention'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'

import UniqueID from "../extensions/UniqueIDTiptap"
import { History } from "../components/History"
import { CustomClipboardTextSerializer } from "../components/CustomClipboardTextSerializer"
import { KVStorage } from "../components/KVStorage"
import suggestion from "../components/suggestion"
import { CustomKeymap } from "../extensions/CustomKeymap"
import Tweet from "../extensions/Paragraph"
import createEmptyTweetEditorModel from "../utils/editorUtils/createEmptyTweetEditorModel"

const initialContent = {
	type: 'doc',
	content: [createEmptyTweetEditorModel()]
}

const useCustomEditor = () => {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				// nodes
				text: true,
				blockquote: false,
				bulletList: false,
				codeBlock: false,
				document: false,
				hardBreak: false,
				heading: false,
				horizontalRule: false,
				listItem: false,
				orderedList: false,
				paragraph: {
					HTMLAttributes: {
						class: 'tweet-p',
					}
				},
				// marks
				bold: false,
				code: false,
				italic: false,
				strike: false,
				// extensions
				dropcursor: {
					class: 'drop-cursor'
				},
				gapcursor: false,
				history: false
			}),
			Document.extend({ content: 'tweet*' }),
			Tweet,
			Highlight.configure({
				multicolor: true,
				HTMLAttributes: {
					style: 'color: inherit'
				}
			}),
			Mention.configure({
				HTMLAttributes: {
					class: 'mention'
				},
				suggestion
			}),
			Link.configure({
				openOnClick: true
			}),
			CustomKeymap,
			CustomClipboardTextSerializer,
			History,
			KVStorage,
			UniqueID.configure({
				types: ['tweet'],
			}),
		],
		content: initialContent,
		autofocus: 'start'
	})

	return editor;
}

export default useCustomEditor;