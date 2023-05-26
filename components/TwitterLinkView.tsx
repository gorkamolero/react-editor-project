import React from "react";
import { Tweet } from "react-twitter-widgets";

interface TwitterLinkViewProps {
	tweet: string;
}

const TwitterLinkView: React.FC<TwitterLinkViewProps> = ({ tweet }) => {
	const link = tweet;
	const link2 = link.split("/");
	const finalLink = link2[5];

	return (
		finalLink && (
			<div style={{ width: "200px", marginLeft: "10px" }} contentEditable={false}>
				<Tweet
					tweetId={finalLink}
					options={{ theme: "light" }}
				/>
			</div>
		)
	);
};

export default TwitterLinkView;
