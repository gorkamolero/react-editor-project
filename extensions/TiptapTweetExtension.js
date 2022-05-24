import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { focusModeScrollToTweet, simpleScrollToTweet } from "components/FocusModeIconButton";
import { addTweetCommandEnter } from "hooks/useAddTweet";
import cloneDeep from "lodash.clonedeep";
import { notif } from "uikit";
import parseTweet from "utils/parseTweet";
import {
  convertEmptyParagraphsToNewTweets,
  createEmptyTweetEditorModel,
  getSelectedTweetIndex,
  sanitizeContent,
  tweetEditorPosition,
} from "./editorUtils";
import TiptapTweetComponent from "./TiptapTweetComponent";
import { TweetAttrs } from "./TweetAttrs";

function shouldPreventOnUpdate({ editor, transaction }) {
  // Fix writing accents and diacritics in Safari.
  const ignoredChars = new Set(["`", "´", "¨", "ˆ", "˜"]);

  const insertedChar = transaction?.steps?.[0]?.slice?.content?.content?.[0]?.text;
  if (ignoredChars.has(insertedChar)) {
    return true;
  }

  return false;
}

const Tweet = Node.create({
  name: "tweet",
  group: "block",
  content: "paragraph*",
  inline: false,
  draggable: true,
  addAttributes() {
    return TweetAttrs.getDefaultAttrs();
  },
  onUpdate({ editor, transaction }) {
    if (shouldPreventOnUpdate({ editor, transaction })) {
      return;
    }

    let { content: sanitizedContent, selection: sanitizedSelection, sanitized } = sanitizeContent(editor);
    if (sanitized) {
      editor
        .chain()
        .setMeta("preventUpdate", true)
        .setContent(sanitizedContent)
        .setTextSelection(sanitizedSelection)
        .run();
    }

    const initialTweetsNumber = editor.getJSON().content.length;
    let { content, selection, affectedIndex } = convertEmptyParagraphsToNewTweets(editor);

    // Set Thread Finisher to false in case it happened to arrive at index 0 of the thread
    // It can happen by deleting all preceding tweets or by drag and dropping
    if (content[0].attrs.isThreadFinisher === true) {
      content[0].attrs = { ...content[0].attrs, isThreadFinisher: false };
      notif.error("Thread finisher removed from first tweet.");
    }

    // sanitize in case of tweet merge
    editor.chain().setMeta("preventUpdate", true).setContent(content).setTextSelection(selection).run();

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
      chain.setMeta("preventUpdate", true).setTextSelection({ from: start, to: end }).unsetHighlight();

      const headNumbering = (editor.storage.kvStorage.headNumbering ?? [])[tIndex] ?? "";
      const tailNumbering = (editor.storage.kvStorage.tailNumbering ?? [])[tIndex] ?? "";
      const currNumbering = headNumbering + tailNumbering;
      const parsedTweet = parseTweet(currNumbering + content[tIndex].attrs.text);

      if (!parsedTweet.valid) {
        const validRangeEnd = parsedTweet.validRangeEnd + 1;
        const pCount = content[tIndex].attrs.text.substring(0, parsedTweet.validRangeEnd).split("\n").length + 1;
        const outOfBoundsStart = start + validRangeEnd + pCount;
        chain
          .setTextSelection({ from: outOfBoundsStart - currNumbering.length, to: end })
          .setHighlight({ color: "hsla(360, 100%, 65%, 0.25)" });
      }
    }
    chain.setTextSelection(selection).run();

    const finalTweetsNumber = content.length;
    if (initialTweetsNumber !== finalTweetsNumber) {
      simpleScrollToTweet();
    }

    // Add to History
    if (editor.extensionStorage.customHistory.shouldIgnoreAddToHistory) {
      editor.extensionStorage.customHistory.shouldIgnoreAddToHistory = false;
    } else {
      editor.commands.addToHistory();
    }
  },

  addCommands() {
    return {
      uploadAttachment: () => () => {
        document.getElementById("upload_file")?.click();
      },
      onAttachmentUploaded:
        (attachments, index) =>
        ({ commands, chain, state, editor }) => {
          const { selection } = editor.view.state;
          const tIndex = index ?? getSelectedTweetIndex(editor);
          let content = editor.getJSON().content;
          let newAttrs = cloneDeep(content[tIndex].attrs);
          if (!newAttrs.gifs || !newAttrs.images || !newAttrs.videos) {
            newAttrs = TweetAttrs.getDefaultAttrs();
          }
          attachments
            .filter((file) => file.mime === "image/gif")
            .forEach((el) => newAttrs.gifs.push({ human_id: el.human_id }));
          attachments
            .filter((file) => file.mime === "image/jpeg" || file.mime === "image/png")
            .forEach((el) => newAttrs.images.push({ human_id: el.human_id }));
          attachments
            .filter((file) => file.mime.startsWith("video/"))
            .forEach((el) => newAttrs.videos.push({ human_id: el.human_id }));
          content[tIndex].attrs = newAttrs;
          chain().setContent(content, true).setTextSelection(selection).run();

          editor.commands.addToHistory(true);
        },
      onClickDeleteAttachment:
        (attachment, index) =>
        ({ commands, chain, state, editor }) => {
          let content = editor.getJSON().content;
          let newAttrs = cloneDeep(content[index].attrs);
          if (!newAttrs.gifs || !newAttrs.images || !newAttrs.videos || !newAttrs || newAttrs == {}) {
            throw new Error("Didn't have attributes when trying to delete image");
          }
          newAttrs.images = newAttrs.images?.filter((el) => el.human_id !== attachment.human_id);
          newAttrs.gifs = newAttrs.gifs?.filter((el) => el.human_id !== attachment.human_id);
          newAttrs.videos = newAttrs.videos?.filter((el) => el.human_id !== attachment.human_id);

          content[index].attrs = newAttrs;
          commands.setContent(content, true);

          editor.commands.addToHistory(true);
        },
      moveTweet:
        (index, direction) =>
        ({ editor }) => {
          const destIndex = index + direction;
          const tweets = editor.getJSON().content;
          if (destIndex < 0 || destIndex > tweets.length - 1) return;

          const srcTweet = tweets[index];
          const destTweet = tweets[destIndex];

          // check if we're moving a thread finisher tweet at an invalid index
          if (
            (srcTweet.attrs.isThreadFinisher === true && destIndex === 0) ||
            (destTweet.attrs.isThreadFinisher === true && index === 0)
          ) {
            notif.error("Thread finisher is not allowed as first tweet");
            return;
          }

          // move tweet
          tweets[destIndex] = srcTweet;
          tweets[index] = destTweet;

          // setTimeout: ensures we can reason on selection after editor content is updated
          setTimeout(() => {
            editor.commands.setContent(tweets, true);
            editor.commands.setSelectionToTweetAtIndex(destIndex, destIndex > 0 ? 4 : -4);
            editor.commands.addToHistory(true);
            simpleScrollToTweet(0, true);
          });
        },
      setSelectionToTweetAtIndex:
        (index, offset) =>
        ({ editor, commands }) => {
          const { start } = tweetEditorPosition(editor, index);
          commands.setTextSelection(start + offset);
        },
      moveTweetUp:
        () =>
        ({ editor, commands }) => {
          commands.moveTweet(getSelectedTweetIndex(editor), -1);
        },
      moveTweetDown:
        () =>
        ({ editor, commands }) => {
          commands.moveTweet(getSelectedTweetIndex(editor), +1);
        },
      deleteCurrentTweet:
        () =>
        ({ editor, chain }) => {
          const indexToDelete = getSelectedTweetIndex(this.editor);

          // remove tweet at index from content
          let content = editor.getJSON().content;
          content.splice(indexToDelete, 1);

          // if last tweet deleted, insert an empty new one
          if (content.length === 0) {
            content = [createEmptyTweetEditorModel()];
          }

          chain()
            .setContent(content, true)
            .setSelectionToTweetAtIndex(Math.min(indexToDelete, this.editor.getJSON().content.length - 1), 0)
            .run();

          focusModeScrollToTweet();
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      Escape: () => this.editor.commands.blur(),
      Backspace: () => {
        // when pressing backspace, if cursor is at the start of a tweet, the tweet is merged with the previous one
        // in this case, we need to save a snapshot of the current content before the merge
        // because if merging will not be possible, we'll do a redo to restore the content we're seeing here.
        const tIndex = getSelectedTweetIndex(this.editor);
        const tStartPos = tweetEditorPosition(this.editor, tIndex).start + 2;
        const currPos = this.editor.view.state.selection;

        if (tIndex > 0 && currPos.from === tStartPos) {
          this.editor.commands.addToHistory(true);
        }
      },
      "alt-ArrowUp": () => this.editor.commands.moveTweetUp(),
      "alt-ArrowDown": () => this.editor.commands.moveTweetDown(),
      "Mod-alt-shift-Backspace": () => this.editor.commands.deleteCurrentTweet(),
      "Mod-i": () => this.editor.commands.uploadAttachment(),
      "Mod-Enter": () => {
        addTweetCommandEnter(this.editor);
      },
    };
  },

  parseHTML() {
    return [{ tag: "tweet" }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return ["tweet", mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TiptapTweetComponent);
  },
});

export default Tweet;
