import React from "react";
import { Editor } from "@tiptap/core";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import Image from "next/image";
import dp from "../../assets/dp.jpeg";
import TwitterLinkView from "../TwitterLinkView";

interface ParagraphProps {
	editor: Editor;
	node: any;
	getPos: () => number;
}

const Paragraph = (props: ParagraphProps) => {
	let text = String(props.editor.getText());
	const characterCount = props.node.content.size;

	const percentage = props.editor
		? Math.round((100 / 280) * characterCount)
		: 0;

	return (
		<>
			<NodeViewWrapper className="paragraph draggable-item">
				<div
					className="drag-handle"
					contentEditable={false}
					draggable="true"
					data-drag-handle
				/>
				<div className="relative w-full">
					<div className="absolute h-full border-r-2 border-gray-300/75 left-6"></div>
					<ul className="space-y-2">
						<li>
							<div className="flex items-center">
								<span className="rounded-full h-12 w-12">
									<Image
										src={dp}
										width={48}
										height={48}
										alt="profile"
										className="rounded-full"
									/>
								</span>
								<h4 className="ml-3 text-xl font-bold text-gray-800">
									Don Smith{" "}
									<span className="text-sm ml-1 text-gray-500/75 font-normal">
										@DonSmit81652325
									</span>
								</h4>
							</div>
							<div className="ml-12">
								<NodeViewContent
									className={`content w-60 md:w-64 lg:w-96 pl-3 mb-2 text-md`}
								/>
								<div>
									<TwitterLinkView url={text} />
								</div>
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
								e.preventDefault();
								// const entries = props.node.contentComponent.state.renderers
								const endPos = props.getPos() + props.node.nodeSize;
								const selection = props.editor.state.selection.empty;
								console.log("para", endPos);
								// console.log('para', entries)
								// I focus the start of the editor because
								// when the cursor is at the end of the node below which
								// we want to add a block, it doesn't focus the next block
								props.editor.commands.focus("start");
								props.editor
									.chain()
									.focus(endPos)
									.insertContentAt(endPos, { type: "paragraph" })
									.run();
							}}
						>
							<BsPlusCircle size={16} className="text-gray-600" />
						</button>
					</div>
				</div>
			</NodeViewWrapper>
		</>
	);
};

export default Paragraph;
