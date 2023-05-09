import React from "react";
import { Tweet } from "react-twitter-widgets";

interface TwitterLinkViewProps {
	url: string;
}

const TwitterLinkView: React.FC<TwitterLinkViewProps> = ({ url }) => {
	const link = url;
	const link2 = link.split("/");
	const finalLink = link2[5];

	return (
		finalLink && (
			<div style={{ width: "200px", marginLeft: "10px" }}>
				<Tweet
					tweetId={finalLink}
					options={{ theme: "light" }}
					// TODO: make sure this prop is actually working
					contentEditable="false"
				/>
			</div>
		)
	);
};

export default TwitterLinkView;
