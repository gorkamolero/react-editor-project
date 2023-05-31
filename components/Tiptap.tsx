import React from 'react'
import { EditorContent } from '@tiptap/react'
import useCustomEditor from '../hooks/useCustomEditor'

const Tiptap = () => {
  // const limit = 280
 
	const editor = useCustomEditor();

  if (!editor) {
    return null
  }

  // const characterCount = editor.storage.characterCount.characters()

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
    </>
  )
}

export default Tiptap
