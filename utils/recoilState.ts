import {
  ImageEditingProps,
  ITypefullyThread,
  ITypefullyThreadLocalMetadata,
  ITypefullyTweet
} from '../types'
import parseTweet from './parseTweet'
import cacheReturnValue from './recoil/cacheReturnValue'

import { atom, selector } from 'recoil'

export const selectedThreadState = atom<ITypefullyThread | null>({
  key: 'selectedThread',
  default: null
})

export const focusModeState = atom({
  key: 'focusMode',
  default: false
})

export const threadFinisherAttrsState = atom({
  key: 'threadFinisherAttrs',
  default: {}
})

export const tweetNumberingStringsState = atom({
  key: 'tweetNumberingString',
  default: { heading: [], tailing: [] }
})

export const focusedIndexState = atom({
  key: 'focusedIndex',
  default: 0
})

export const imageEditingModalShownState = atom<boolean>({
  key: 'imageEditingModalShown',
  default: false
})

export const imageEditingPropsState = atom<ImageEditingProps | null>({
  key: 'imageEditingProps',
  default: null
})

function calcHasInvalidTweet(tweets: ITypefullyTweet[]) {
  if (!tweets) return true

  for (let i = 0; i < tweets.length; i++) {
    const tweet = tweets[i]
    const text = tweet.text
    if (text && text.length > 0 && !parseTweet(text).valid) return i
  }

  return false
}

export const selectedThreadMetadataState = selector<
  ITypefullyThread & ITypefullyThreadLocalMetadata
>({
  key: 'selectedThreadMetadata',
  get: cacheReturnValue(({ get }) => {
    const thread: ITypefullyThread & ITypefullyThreadLocalMetadata =
      get(selectedThreadState)

    if (!thread) return null

    const remoteThreadProperties: Partial<ITypefullyThread> = {
      num_tweets: thread.tweets?.length ?? 0,
      text: undefined,
      rich_text: undefined,
      tweets: undefined,
      is_empty: thread.text.trim().length === 0
    }

    const localThreadProperties: ITypefullyThreadLocalMetadata = {
      has_thread_finisher:
        thread.rich_text.find((t) => t.attrs.isThreadFinisher === true) !==
        undefined,
      invalid_tweet: calcHasInvalidTweet(thread.tweets)
    }

    // the selected thread, minus the stuff that changes at every keystroke (for performance)
    const res: ITypefullyThread & ITypefullyThreadLocalMetadata = {
      ...thread,
      ...remoteThreadProperties,
      ...localThreadProperties
    }

    return res
  })
})
