import IMediaAttrObj from "./IMediaAttrObj";

export interface ITweetAttrs {
	text: string;
	charCount: number;
  link: string;
  isSelected: boolean;
	isThreadFinisher: boolean;
	images: IMediaAttrObj[];
	id: string;
}
