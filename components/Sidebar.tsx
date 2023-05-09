import React, { useState } from "react";
import { BsX } from "react-icons/bs";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

const Sidebar = () => {
	const [field, setField] = useState([
		{ id: Math.random() * 100, message: "" },
	]);
	const handleSubmit = () => {
		setField([...field, { id: Math.random() * 100, message: "" }]);
	};
	const handleRemove = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		index: number
	) => {
		const list = [...field];
		list.splice(index, 1);
		setField(list);
	};
	return (
		<div className="overflow-y-scroll text-gray-500" style={{ height: "90vh" }}>
			<Tabs>
				<TabList>
					<Tab>Drafts</Tab>
					<Tab>Queue</Tab>
					<Tab>Tweeted</Tab>
				</TabList>
				<TabPanel>
					<div className={"p-1"}>
						<div className="border-b border-gray-200 mb-2">
							<button
								className="text-base pb-2 w-full text-left"
								onClick={handleSubmit}
							>
								<span className="mr-2">+</span> New draft
							</button>
						</div>
						<div>
							{field.map((item, index) => (
								<div className="mb-2 flex gap-1" key={item.id}>
									<input
										className="border border-gray-200 focus:outline-none w-full px-2 py-1.5 rounded-md"
										type="text"
										value={item.message}
									/>
									<button
										onClick={(e) => handleRemove(e, index)}
										className="bg-gray-100/50 rounded-md"
									>
										<BsX size={16} />
									</button>
								</div>
							))}
						</div>
					</div>
				</TabPanel>
				<TabPanel>
					<div className={"p-2"}>
						<div className="border-b border-gray-200">
							<button className="pb-2 text-base">
								<span className="mr-2">+</span> New draft
							</button>
						</div>
						<div className="my-2">
							<h4>Today May 26</h4>
							<div className="border w-full p-2 mt-2 rounded-md">17.00</div>
						</div>
						<div className="my-2">
							<h4>Tomorrow 27</h4>
							<div className="border w-full p-2 mt-2 rounded-md">17.00</div>
						</div>
						<div className="my-2">
							<h4>Moday May 30</h4>
							<div className="border w-full p-2 mt-2 rounded-md mb-2">
								12.00
							</div>
							<div className="border w-full p-2 mt-2 rounded-md">17.00</div>
						</div>
						<div className="my-2">
							<h4>Tuesday May 31</h4>
							<div className="border w-full p-2 mt-2 rounded-md mb-2">
								12.00
							</div>
							<div className="border w-full p-2 mt-2 rounded-md">17.00</div>
						</div>
						<div className="my-2">
							<h4>Wednesdat June 1</h4>
							<div className="border w-full p-2 mt-2 rounded-md mb-2">
								12.00
							</div>
							<div className="border w-full p-2 mt-2 rounded-md">17.00</div>
						</div>
						<div className="my-2">
							<h4>Thursday June 2</h4>
							<div className="border w-full p-2 mt-2 rounded-md mb-2">
								12.00
							</div>
							<div className="border w-full p-2 mt-2 rounded-md">17.00</div>
						</div>
						<div className="my-2">
							<h4>Friday June 3</h4>
							<div className="border w-full p-2 mt-2 rounded-md mb-2">
								12.00
							</div>
							<div className="border w-full p-2 mt-2 rounded-md">17.00</div>
						</div>
						<div className="my-2">
							<h4>Monday June 6</h4>
							<div className="border w-full p-2 mt-2 rounded-md mb-2">
								12.00
							</div>
							<div className="border w-full p-2 mt-2 rounded-md">17.00</div>
						</div>
						<div className="my-2">
							<h4>Tuesday June 7</h4>
							<div className="border w-full p-2 mt-2 rounded-md mb-2">
								12.00
							</div>
							<div className="border w-full p-2 mt-2 rounded-md">17.00</div>
						</div>
					</div>
				</TabPanel>
				<TabPanel>
					<div className={"py-2 border-b border-gray-200"}>
						<button className="text-base">
							<span className="mr-2">+</span> New draft
						</button>
					</div>
				</TabPanel>
			</Tabs>
		</div>
	);
};

export default Sidebar;
