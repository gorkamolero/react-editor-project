import { IMediaAttrObj } from "../types";

export interface ITweetAttrs {
	text: string;
	charCount: number;
	images: IMediaAttrObj[];
	gifs: IMediaAttrObj[];
	videos: IMediaAttrObj[];
	isThreadFinisher: boolean;
}
