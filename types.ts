// import { ICoupon } from "types-paywall";
// import { numberingFormats } from "./components/editor/TweetNumberingModal";

import { ITweetAttrs } from "./types/ITweetAttrs";

export type MonetizationStatus =
	| "free"
	| "subscribed"
	| "canceled_with_access"
	| "past_due"
	| "gifted";

// owner | admin | publish | write | read
export type TeamAccessLevel = "o" | "a" | "p" | "w" | "r";

export interface ITeam {
	id: string;
	name: string;
	accounts: IAccount[];
}

export interface ITeamMembership {
	id: string;
	team: ITeam;
	access_level: TeamAccessLevel;
	label?: string;
	user: ITeamMembershipUserMetadata;
}

export interface ITeamMembershipUserMetadata {
	name: string;
	profile_image_url: string;
	screen_name: string;
}

export interface IWSClient {
	onOpen: () => void;
	onMessage: (m: any) => void;
	onClose: (m: any) => void;
	onError: (e: any) => void;
}

export type IThreadLock = {
	threadId: number;
	ownerIsSelf: boolean;
} & IThreadLockOwnerUserMetadata;

export type LiveEvent =
	| IThreadLockStatusesEvent
	| IThreadLockAcquiredEvent
	| IThreadLockReleasedEvent
	| IThreadListChangedEvent;

interface ILiveEventBase {
	session_id: string;
}

export interface IThreadListChangedEvent extends ILiveEventBase {
	type: "draft_list_changed";
	event:
		| "new_draft"
		| "pinned"
		| "status"
		| "publish"
		| "delete"
		| "duplicate"
		| "move";
	thread_id?: number;
	start_message: boolean;
}

export interface IThreadLockStatusesEvent extends ILiveEventBase {
	type: "lock_statuses";
	locks: IThreadLockAcquiredEvent[];
	start_message: boolean;
}

export interface IThreadLockAcquiredEvent extends ILiveEventBase {
	type: "lock_acquired";
	thread_id: number;
	start_message: boolean;
	lock_expiration: number;
	lock_owner: IThreadLockOwnerUserMetadata;
}

export interface IThreadLockOwnerUserMetadata extends ILiveEventBase {
	name: string;
	profile_image_url: string;
	screen_name: string;
}

export interface IThreadLockReleasedEvent extends ILiveEventBase {
	type: "lock_released";
	thread_id: number;
	start_message: boolean;
}

export type WSMessage =
	| { type: "subscribe_to_live_events" }
	| { type: "leave_thread"; thread_id: number }
	| { type: "thread_status"; thread_id: number };

export interface IUserFeatures {
	max_connected_accounts: number;
	max_teams: number;
	teams: boolean;
}
export interface IAccountFeatures {
	edit_threads: boolean;
	max_images_per_thread: number;
	max_scheduled_drafts: number;
	advanced_scheduling: boolean;
	analytics: boolean;
	auto_plug: boolean;
	auto_retweet: boolean;
	thread_finisher: boolean;
	tweet_numbering: boolean;
}
export interface IUser {
	id: number;
	name: string;
	screen_name: string;
	profile_image_url: string;
	timezone?: string;
	is_pro: boolean;
	features: IUserFeatures;
	monetization_status: MonetizationStatus;
	subscription_id?: string;
	plan_nickname?: string;
	coupon?: ICoupon;
}

export interface IAccount {
	id: number;
	name: string;
	screen_name: string;
	profile_image_url: string;
	timezone?: string;
	paused: boolean;
	features: IAccountFeatures;
	affiliate_name?: string;
	was_first_connected?: boolean;
	has_public_stats?: boolean;
}

export interface ITypefullyTweet {
	images: string[];
	text: string;
	length: number;
}

export enum ThreadStatus {
	Draft = 0,
	Published = 1,
	Scheduled = 2,
	Error = 3,
	Publishing = 4,
}
type TwitterUser = {
	name: string;
	screen_name: string;
	profile_image_url_https: string;
	verified: boolean;
};

type TwitterMedia = {
	media_url_https: string;
	type: string;
	video_info?: {
		variants: {
			content_type: string;
			url: string;
		}[];
	};
};

type TwitterUrl = {
	url: string;
	expanded_url: string;
	display_url: string;
	indices: [number, number];
};

export type ITwitterTweet = {
	created_at: string;
	user: TwitterUser;
	full_text: string;
	display_text_range: [number, number];
	quoted_status_permalink?: {
		url: string;
		expanded: string;
	};
	entities: {
		media: TwitterMedia[] | [];
		urls: TwitterUrl[] | [];
	};
	extended_entities: {
		media: TwitterMedia[] | [];
		urls: TwitterUrl[] | [];
	};
};

export interface NumberingStyle {
	enabled: boolean;
	format: (typeof numberingFormats)[number];
	position_start: boolean;
	use_emoji: boolean;
	skip_first: number;
	skip_last: number;
}

export interface IAutoPlug {
	min_likes: number;
	min_retweets: number;
	threshold_mode: 0 | 1;
	tweet_text: string;
}

export interface IRichTextTweet {
	type: "tweet";
	content: { [key: string]: any }[];
	attrs: ITweetAttrs;
}

export type RichText = IRichTextTweet[];

export interface ITypefullyThread {
	id: number;
	text: string;
	tweets: ITypefullyTweet[];
	rich_text: RichText;
	num_tweets: number;
	last_edited: string;
	preview: string;
	scheduled_date?: string;
	status: ThreadStatus;
	error_msg?: string;
	thread_head_twitter_url?: string;
	is_publicly_shared: boolean;
	title?: string;
	published_on?: string;
	publish_to_typefully: boolean;
	is_empty: boolean;
	share_id?: string;
	numbering_style?: NumberingStyle;
	pinned: boolean;
}

export interface ITypefullyThreadLocalMetadata {
	has_thread_finisher: boolean;
	invalid_tweet: boolean | number;
}

export interface ITypefullyMedia {
	id: string;
	human_id: string;
	public_url: string;
	alt_text?: string;
	name?: string;
	created_on: string;
	aspect_ratio: number;
	height: number;
	width: number;
	mime: IMime;
}

export type IMime =
	| "image/png"
	| "image/jpeg"
	| "image/jpg"
	| "image/webp"
	| "image/gif"
	| "video/mp4"
	| "video/quicktime"
	| "video/mov";

export interface ITypefullyPostTweet {
	media?: IPostMedia[];
	text: string;
}

export interface IPostMedia {
	url: string;
	alt_text?: string;
	mime: IMime;
	aspect_ratio?: number;
	height?: number;
	width?: number;
}

export type ImageEditingProps =
	| { type: "remote-image"; imageUrl: string }
	| {
			type: "internal-image";
			imageUrl: string;
			name: string;
			humanId: string;
	  };

// Tweet Attributes

export interface IMediaAttrObj {
	human_id: string;
}

export type AttrsMeta<Type> = {
	stripIfUnchanged: boolean;
	default: Type;
};

export type StrippedAttrs = any;

export interface IGrowthData {
	value: number;
	diff: number | null;
	diff_percent: number | null;
	prev_value: number | null;
	data: { date: string; value: number | null }[];
}

export interface IMentionSuggestion {
	account_id: string;
	screen_name: string;
	name: string;
	profile_image_url: string;
	followers_count: number;
	verified: boolean;
}

export interface ITwitterMentionSuggestion {
	id_str?: string;
	profile_image_url_https?: string;
}

export interface ITipTapDropDownMenuProps {
	text: string;
	query: string;
	items: any[];
	command: (text: string) => void;
}
