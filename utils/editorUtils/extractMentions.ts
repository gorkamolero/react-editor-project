import twitter from 'twitter-text';

export default function extractMentions(tweet) {
  let mentions = [];
  const text = tweet.attrs.text;
  if (tweet?.content?.length) {
    mentions = tweet?.content
      .map((node) => node?.content?.find((node) => node?.type === 'mention'))
      .filter((n) => n)
      .map((mention) => mention?.attrs?.id);
  }
  const mentionsByTwitter = twitter.extractMentionsWithIndices(text);
  if (mentions.length) {
    const actualMentions = mentionsByTwitter.filter((mention) =>
      mentions.includes(mention.screenName),
    );
    if (!actualMentions.length) return 0;

    const mentionsBeforeEnd = actualMentions.filter(
      (mention) => mention.indices[0] < tweet.attrs.charCount,
    );
    const mentionsLength = mentionsBeforeEnd.reduce((acc, curr) => {
      return acc + curr.screenName.length;
    }, 0);

    return mentionsLength;
  }
  return 0;
}
