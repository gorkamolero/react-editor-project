import cloneDeep from "lodash.clonedeep";
import deepEqual from "../utils/deepEqual";
import { AttrsMeta, IMediaAttrObj, StrippedAttrs } from "../types";
import { ITweetAttrs } from "../types/ITweetAttrs";

export class TweetAttrs {
	static text: AttrsMeta<string> = { default: "", stripIfUnchanged: false };
	static charCount: AttrsMeta<number> = { default: 0, stripIfUnchanged: false };
	static images: AttrsMeta<IMediaAttrObj[]> = {
		default: [],
		stripIfUnchanged: true,
	};
	static gifs: AttrsMeta<IMediaAttrObj[]> = {
		default: [],
		stripIfUnchanged: true,
	};
	static videos: AttrsMeta<IMediaAttrObj[]> = {
		default: [],
		stripIfUnchanged: true,
	};
	static isThreadFinisher: AttrsMeta<boolean> = {
		default: false,
		stripIfUnchanged: true,
	};

	static getDefaultAttrs(): ITweetAttrs {
		return {
			text: TweetAttrs.text.default,
			charCount: TweetAttrs.charCount.default,
			images: TweetAttrs.images.default,
			gifs: TweetAttrs.gifs.default,
			videos: TweetAttrs.videos.default,
			isThreadFinisher: TweetAttrs.isThreadFinisher.default,
		};
	}

	static stripDefaultAttrs(attrs: ITweetAttrs): StrippedAttrs {
		const newAttrs = cloneDeep(attrs);
		for (const [key, value] of Object.entries(TweetAttrs)) {
			const valueMeta = value as AttrsMeta<any>;
			if (
				valueMeta.stripIfUnchanged === true &&
				deepEqual(newAttrs[key], valueMeta.default)
			) {
				delete newAttrs[key];
			}
		}
		return newAttrs;
	}
}
