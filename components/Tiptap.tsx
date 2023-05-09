import React, { useState, useCallback, useMemo } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import Document from '@tiptap/extension-document'
import Text from '@tiptap/extension-text'
import HardBreak from '../extensions/Hardbreak'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import Mention from '@tiptap/extension-mention'
import suggestion from './suggestion'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Tweet from '../extensions/Paragraph'
import Highlight from '@tiptap/extension-highlight'
import { History } from './History'
import { KVStorage } from './KVStorage'
import ActionBar from './ActionBar'
import { CustomKeymap } from '../extensions/CustomKeymap'
import { CustomClipboardTextSerializer } from './CustomClipboardTextSerializer'
import StarterKit from '@tiptap/starter-kit'
import { createEmptyTweetEditorModel } from './editorUtils'

const Tiptap = () => {
  // const limit = 280

  const initialContent = {
    type: 'doc',
    content: [createEmptyTweetEditorModel()]
  }

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
            'data-typefully': 'true'
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
      KVStorage
    ],
    content: initialContent,
    autofocus: 'start'
    // onUpdate({ editor }) {
    //   editor.chain().focus(1)
    // },
    // onBeforeCreate: ({ editor }) => {
    //   console.log('onBeforeCreate', editor)
    // },
    // onBeforeCreate({ editor }) {
    //   console.log('onBeforeCreate', editor)
    // },
    // onCreate({ editor }) {
    //   console.log('onCreate', editor)
    // },
    // onUpdate({ editor }) {
    //   editor.commands.focus('start')
    //   const value = editor.getText()
    //   if (value.endsWith('\n\n')) {
    //     console.log('Break', editor)
    //   }
    // }
    // onSelectionUpdate({ editor }) {
    //   console.log('onSelectionUpdate', editor)
    // },

    // onFocus({ editor, event }) {
    //   console.log('onFocus', editor, event)
    // },
    // onBlur({ editor, event }) {
    //   console.log('onBlur', editor, event)
    // },
    // onDestroy() {
    //   console.log('onDestroy')
    // }
  })

  if (!editor) {
    return null
  }

  // const characterCount = editor.storage.characterCount.characters()

  const addImage = () => {
    const url = window.prompt('URL')

    if (url) {
      editor.chain().setImage({ src: url }).run()
    }
  }

  const clearNode = () => {
    editor.commands.clearContent()
  }

  return (
    <>
      <EditorContent
        editor={editor}
        id='editor'
        style={{
          height: '80vh',
          overflowY: 'scroll',
          scrollSnapMarginBottom: 0,
          scrollBehavior: 'smooth',
          scrollPaddingBlockEnd: '50%'
        }}
      />
      <div className='fixed bottom-b w-80 md:w-96'>
        <ActionBar />
      </div>
      {/* <div className='flex gap-2 items-center mt-2 text-gray-500'>
        <div>
          {characterCount}/{limit} Characters
        </div>
        <div>
          <button onClick={addImage}>
            <BsFillImageFill size={18} className='mt-2' />
            Image
          </button>
        </div>
        <div>
          <GifModal editor={editor} />
        </div>
        <div>
          <button onClick={clearNode}>Clear</button>
        </div>
      </div> */}
    </>
  )
}

export default Tiptap
