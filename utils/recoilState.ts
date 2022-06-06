import { atom } from 'recoil'

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
