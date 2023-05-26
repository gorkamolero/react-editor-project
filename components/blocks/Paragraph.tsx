import React from "react"
import { Editor } from "@tiptap/core"
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react"
import Image from "next/image"
import dp from "../../assets/dp.jpeg"
import TwitterLinkView from "../TwitterLinkView"
import { BsPlusCircle } from "react-icons/bs"

interface ParagraphProps {
  editor: Editor
  node: any
  getPos: () => number
}

const Paragraph = (props: ParagraphProps) => {
  let text = String(props.editor.getText())

  const { charCount, link, isSelected, isThreadFinisher, id } = props.node.attrs

  const percentage = props.editor ? Math.round((100 / 280) * charCount) : 0

  return (
    <>
      <NodeViewWrapper
        className="paragraph draggable-item"
        data-link={link}
        data-isThreadFinisher={isThreadFinisher}
        data-id={id}
      >
        <div
          className="drag-handle"
          contentEditable={false}
          draggable="true"
          data-drag-handle
        />
        <div className="not-prose relative w-full">
          <div className="absolute h-full border-r-2 border-gray-300/75 left-6"></div>
          <ul className="m-0 list-none space-y-2">
            <li className="m-0 list-none">
              <div
                className=" not-prose flex items-start"
                contentEditable={false}
              >
                <span
                  className="select-none rounded-full"
                  contentEditable={false}
                >
                  <Image
                    src={dp}
                    width={48}
                    height={48}
                    alt="profile"
                    className="rounded-full"
                  />
                </span>
                <div
                  contentEditable={false}
                  className="flex w-full flex-row items-center justify-start overflow-hidden"
                >
                  <h4
                    contentEditable={false}
                    className="ml-3 select-none overflow-hidden text-base font-bold tracking-tightish text-gray-800 line-clamp-1"
                  >
                    George Miller{" "}
                    <span className="ml-1 select-none text-sm font-normal text-gray-500/75">
                      @gorkamiller
                    </span>
                  </h4>
                </div>
              </div>
              <div className="ml-[44px] -mt-7">
                <NodeViewContent
                  className={`content thread-text mb-2 w-full pl-3`}
                />

								{/* New quoteTweet here */}
								
                <div>
                  <TwitterLinkView tweet={text} />
                </div>

								{/* Content blocks here */}
              </div>
            </li>
          </ul>
          {/* Toolbar */}
          <div
            contentEditable={false}
            className={`-my-3 flex gap-2 items-center justify-end mb-0.5`}
          >
            <div className="text-gray-500/75 mr-1">
              {props.node.content.size - 2}/280
            </div>
            <div>
              <svg
                height="20"
                width="20"
                viewBox="0 0 20 20"
                className="character-count__graph"
              >
                <circle r="10" cx="10" cy="10" fill="#e9ecef" />
                <circle
                  r="5"
                  cx="10"
                  cy="10"
                  fill="transparent"
                  stroke="#3b82f6"
                  strokeWidth="10"
                  strokeDasharray={`calc(${percentage} * 31.4 / 100) 31.4`}
                  transform="rotate(-90) translate(-20)"
                />
                <circle r="6" cx="10" cy="10" fill="white" />
              </svg>
            </div>
            <button
              onMouseDown={(e) => {
                e.preventDefault()
                // const entries = props.node.contentComponent.state.renderers
                const endPos = props.getPos() + props.node.nodeSize
                const selection = props.editor.state.selection.empty
                console.log("para", endPos)
                // console.log('para', entries)
                // I focus the start of the editor because
                // when the cursor is at the end of the node below which
                // we want to add a block, it doesn't focus the next block
                props.editor.commands.focus("start")
                props.editor
                  .chain()
                  .focus(endPos)
                  .insertContentAt(endPos, { type: "paragraph" })
                  .run()
              }}
            >
              <BsPlusCircle size={16} className="text-gray-600" />
            </button>
          </div>
        </div>
      </NodeViewWrapper>
    </>
  )
}

export default Paragraph
