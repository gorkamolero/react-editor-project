import { IRichTextTweet } from "../../types/IRichTextTweet";
import { ISentence } from "../../types/ISentence";

function textFromTweetNode(tweet: IRichTextTweet) {
  const paragraphsText = (tweet.content ?? []).map((p) => {
    if (Array.isArray(p.content)) {
      return p.content.map((el) => el.text).join("");
    } else if (p.content) {
      return (p.content as ISentence).text || "";
    }
    return ""; // Handle the case when p.content is undefined, null.
  });
  const text = paragraphsText.join("\n");
  return text;
}



export default textFromTweetNode;
