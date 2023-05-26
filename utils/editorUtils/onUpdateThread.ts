import { Editor } from "@tiptap/core";
import tweetEditorPosition from "./tweetEditorPosition";
import convertEmptyParagraphsToNewTweets from "./convertEmptyParagraphsToNewTweets";
import sanitizeContent from "./sanitizeContent";
import shouldPreventOnUpdate from "./shouldPreventOnUpdate";
import parseTweet from "../parseTweet";
import extractMentions from "./extractMentions";

const onUpdateThread = ({ editor, transaction }: { editor: Editor; transaction: any }) => {
  console.log('YOLO this is working')
  if (shouldPreventOnUpdate({ transaction })) {
    return;
  }
  const {
    content: sanitizedContent,
    selection: sanitizedSelection,
    sanitized,
  } = sanitizeContent(editor);

  if (sanitized) {
    editor
      .chain()
      .setMeta("preventUpdate", true)
      .setContent(sanitizedContent)
      .setTextSelection(sanitizedSelection)
      .run();
  }

  const initialTweetsNumber = editor.getJSON().content.length;
  let { content, selection, affectedIndex } =
    convertEmptyParagraphsToNewTweets(editor);

  // Set Thread Finisher to false in case it happened to arrive at index 0 of the thread
  // It can happen by deleting all preceding tweets or by drag and dropping
  if (content[0].attrs.isThreadFinisher === true) {
    content[0].attrs = { ...content[0].attrs, isThreadFinisher: false };
    console.error("Thread finisher removed from first tweet.");
  }

  // sanitize in case of tweet merge
  editor
    .chain()
    .setMeta("preventUpdate", true)
    .setContent(content)
    .setTextSelection(selection)
    .run();

  // * In case a tweet was split, cursor position should be at the stat of the new tweet.
  // needed to fix glitches caused by some needed logic in convertEmptyParagraphsToNewTweets.
  if (initialTweetsNumber + 1 === content.length) {
    const { start } = tweetEditorPosition(editor, affectedIndex + 1);
    editor.commands.setTextSelection(start + 2);
    selection = start + 2;
  }

  const chain = editor.chain();

  // Highlight text over char count:
  // for (let tIndex = Math.max(affectedIndex - 1, 0); tIndex < Math.min(content.length, affectedIndex + 2); tIndex++) {
    for (let tIndex = 0; tIndex < content.length; tIndex++) {
      const { start, end } = tweetEditorPosition(editor, tIndex);
      chain
        .setMeta('preventUpdate', true)
        .setTextSelection({ from: start, to: end })
        .unsetHighlight();
  
      const headNumbering =
        (editor.storage.kvStorage.headNumbering ?? [])[tIndex] ?? '';
  
      const tailNumbering =
        (editor.storage.kvStorage.tailNumbering ?? [])[tIndex] ?? '';
  
      const currNumbering = headNumbering + tailNumbering;
  
      const tweet = content[tIndex];
      const tweetText = tweet.attrs.text;
      const parsedTweet = parseTweet(currNumbering + tweetText);
  
      if (!parsedTweet.valid) {
        const validRangeEnd = parsedTweet.validRangeEnd + 1;
  
        const pCount =
          tweetText.substring(0, parsedTweet.validRangeEnd).split('\n').length +
          1;
  
        const outOfBoundsStart = start + validRangeEnd + pCount;
  
        const mentionsLength = extractMentions(tweet);
  
        chain
          .setTextSelection({
            from: outOfBoundsStart - currNumbering.length - mentionsLength,
            to: end,
          })
          .setHighlight({ color: 'hsla(360, 100%, 65%, 0.25)' });
      }
  }
  chain.setTextSelection(selection).run();

  const finalTweetsNumber = content.length;
  if (initialTweetsNumber !== finalTweetsNumber) {
    // simpleScrollToTweet()
  }

  editor.chain().focus(1);

  // Add to History
  if (editor.extensionStorage.customHistory.shouldIgnoreAddToHistory) {
    editor.extensionStorage.customHistory.shouldIgnoreAddToHistory = false;
  } else {
    editor.commands.addToHistory();
  }
}

export default onUpdateThread;