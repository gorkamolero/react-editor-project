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
	
	static link: AttrsMeta<string> = {
    default: '',
    stripIfUnchanged: true,
  };
	
  static isSelected: AttrsMeta<boolean> = {
    default: false,
    stripIfUnchanged: true,
  };
	
	static isThreadFinisher: AttrsMeta<boolean> = {
		default: false,
		stripIfUnchanged: true,
	};

	static getDefaultAttrs(): ITweetAttrs {
		return {
			id: '',
			text: TweetAttrs.text.default,
			charCount: TweetAttrs.charCount.default,
			link: TweetAttrs.link.default,
			isSelected: TweetAttrs.isSelected.default,
			images: TweetAttrs.images.default,
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
