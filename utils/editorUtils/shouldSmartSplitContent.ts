import shouldSmartSplitTweet from "./shouldSmartSplitTweet";

import { IRichTextTweet } from "../../types/IRichTextTweet";

function shouldSmartSplitContent(content: IRichTextTweet<"paragraph">[]) {
	return content.find((tweet) => shouldSmartSplitTweet(tweet));
}

export default shouldSmartSplitContent;
