import React from 'react'
import { Tweet } from 'react-twitter-widgets'

const TwitterLinkView = ({ url }) => {
  const link = url
  const link2 = link.split('/')
  const finalLink = link2[5]
  return finalLink && <Tweet tweetId={finalLink} options={{ theme: 'light' }} />
}

export default TwitterLinkView
