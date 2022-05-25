import React, { useState, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import Document from '@tiptap/extension-document'
import Paragraph from '../extensions/Paragraph'
import Text from '@tiptap/extension-text'
import HardBreak from '../extensions/Hardbreak'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import Mention from '@tiptap/extension-mention'
import suggestion from './suggestion'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Dropcursor from '@tiptap/extension-dropcursor'
import { BsFillImageFill } from 'react-icons/bs'
import GifModal from './GifModal'
import { Extension } from '@tiptap/core'
import ActionBar from './ActionBar'

// const CustomExtension = Extension.create({
//   name: 'customExtension',

//   addStorage() {
//     return {
//       awesomeness: 1
//     }
//   },

//   onUpdate() {
//     this.storage.awesomeness += 1
//   }
// })

const Tiptap = () => {
  const limit = 280
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      HardBreak,
      Placeholder.configure({
        placeholder: 'Write something...'
      }),
      CharacterCount.configure({
        limit
      }),
      Mention.configure({
        HTMLAttributes: {
          class: 'mention'
        },
        suggestion
      }),
      Link.configure({
        openOnClick: true
      })
    ],
    content: '',
    autofocus: 'end',
    // onBeforeCreate: ({ editor }) => {
    //   console.log('onBeforeCreate', editor)
    // },
    // onBeforeCreate({ editor }) {
    //   console.log('onBeforeCreate', editor)
    // },
    // onCreate({ editor }) {
    //   console.log('onCreate', editor)
    // },
    onUpdate({ editor }) {
      editor.commands.focus()
      const value = editor.getText()
      if (value.endsWith('\n\n')) {
        console.log('Break', editor)
      }
    }
    // onSelectionUpdate({ editor }) {
    //   console.log('onSelectionUpdate', editor)
    // },
    // onTransaction({ editor, transaction }) {
    //   console.log('onTransaction', editor)
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

  const characterCount = editor.storage.characterCount.characters()

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
      <ActionBar />
    </>
  )
}

export default Tiptap
