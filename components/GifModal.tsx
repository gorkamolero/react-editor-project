import React from "react";
import Modal from "react-modal";
import ReactGiphySearchbox from "react-giphy-searchbox";
import { BsEmojiLaughing } from "react-icons/bs";

const customStyles = {
	content: {
		top: "50%",
		left: "50%",
		right: "auto",
		bottom: "auto",
		marginRight: "-50%",
		transform: "translate(-50%, -50%)",
	},
};

const GifModal = ({ setGif }) => {
	let subtitle;
	const [modalIsOpen, setIsOpen] = React.useState(false);

	function openModal(e) {
		e.preventDefault();
		setIsOpen(true);
	}

	function afterOpenModal() {
		// references are now sync'd and can be accessed.
		subtitle.style.color = "#f00";
	}

	function closeModal() {
		setIsOpen(false);
	}

	const handleSubmit = (item) => {
		console.log(item.images.original.mp4);
		setTimeout(() => {
			setGif(item.images.original.mp4);
		}, 1000);
		setIsOpen(false);
	};

	return (
		<>
			<div>
				<button className="p-1 font-bold" onClick={openModal}>
					<BsEmojiLaughing className="text-gray-500/75 mt-0.5" size={18} />
				</button>
				<Modal
					isOpen={modalIsOpen}
					onAfterOpen={afterOpenModal}
					onRequestClose={closeModal}
					style={customStyles}
					ariaHideApp={false}
					contentLabel="Example Modal"
				>
					<div className="flex items-center justify-between mb-3 z-50">
						<h2 ref={(_subtitle) => (subtitle = _subtitle)}>Upload GIF</h2>
					</div>
					<div className="searchboxWrapper" style={{ width: "100%" }}>
						<ReactGiphySearchbox
							apiKey="1hqexOwDJU7auRDWAXogTvGYjnqruv0B"
							onSelect={(item) => handleSubmit(item)}
							masonryConfig={[
								{ columns: 2, imageWidth: 110, gutter: 5 },
								{ mq: "700px", columns: 5, imageWidth: 120, gutter: 2 },
							]}
						/>
					</div>
				</Modal>
			</div>
		</>
	);
};

export default GifModal;
