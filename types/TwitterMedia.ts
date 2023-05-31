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

export default TwitterMedia;