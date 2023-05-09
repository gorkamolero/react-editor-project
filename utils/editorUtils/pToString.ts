import { IParagraph } from "../../types/IParagraph";

function pToString(p: IParagraph) {
	if (!p.content) return "";
	return p.content.map((el) => el.text).join("");
}

export default pToString;
