import Image from "next/image";
import React from "react";
import {
	BsCalendar4,
	BsClipboardData,
	BsPen,
	BsPerson,
	BsWindowSidebar,
} from "react-icons/bs";
import { signInWithPopup, TwitterAuthProvider } from "firebase/auth";

import { authentication } from "../auth/firebase";
import dp from "../assets/dp.jpeg";

const Header = ({ sidebar, setSidebar }) => {
	const handleSubmit = async () => {
		const provider = new TwitterAuthProvider();
		await signInWithPopup(authentication, provider)
			.then((result) => console.log(result))
			.catch((error) => console.error(error));
	};
	return (
		<header className="px-4 py-1 bg-gray-50 shadow-sm sticky top-0 z-50">
			<div className="flex justify-between items-center">
				<button onClick={() => setSidebar(!sidebar)}>
					<BsWindowSidebar className="text-gray-400" size={22} />
				</button>
				<div className="flex space-x-4 items-center font-light text-gray-400">
					<div className="heading-tab text-gray-700">
						<BsPen />
						<span className="hidden md:block">Write</span>
					</div>
					<div className="heading-tab">
						<BsCalendar4 />
						<span className="hidden md:block">Queue</span>
					</div>
					<div className="heading-tab">
						<BsClipboardData />
						<span className="hidden md:block">Grow</span>
					</div>
					<div className="heading-tab">
						<BsPerson size={18} />
						<span className="hidden md:block">Profile</span>
					</div>
				</div>
				<button onClick={handleSubmit} className="px-0">
					<Image
						src={dp}
						width={32}
						height={32}
						alt="profile"
						className="rounded-full"
					/>
				</button>
			</div>
		</header>
	);
};

export default Header;
