import * as Sentry from '@sentry/nextjs'
import { styled } from '@stitches/react'
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react'
import DragHandle from 'components/DragHandle'
import { useHighFidelityEnabled } from 'components/editor/TextEditor'
import { ImagePreview } from 'components/ImagePreview'
import LinkCardPreview from 'components/LinkCardPreview'
import MediaWrapper from 'components/MediaWrapper'
import QuotedTweet from 'components/QuotedTweet'
import ThreadFinisher from 'components/ThreadFinisher'
import { getImagesAverageAspectRatio } from 'components/tweets/shared-components'
import VideoPreview, { VideoThumbnail } from 'components/VideoPreview'
import useHandleEditorAttachments, {
  VALID_FILE_TYPES,
  VALID_FILE_TYPES_HUMAN_READABLE,
  VALID_GIF_TYPES,
  VALID_IMAGE_TYPES,
  VALID_VIDEO_TYPES
} from 'hooks/useHandleEditorAttachments'
import useSelectedThreadMedia, {
  useAttachments
} from 'hooks/useSelectedThreadMedia'
import useTweetMediaPreviews from 'hooks/useTweetMediaPreviews'
import React, { useEffect, useMemo, useRef } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import {
  Box,
  Button,
  Icon,
  notif,
  P1,
  Stack,
  useConfig,
  useDetectBrowser
} from 'uikit'
import parseTweet from 'utils/parseTweet'
import {
  altTextModalShownState,
  focusedIndexState,
  focusModeState,
  threadFinisherAttrsState,
  tweetNumberingStringsState
} from 'utils/recoilState'
import {
  addMediaInvalidMsg,
  assertValidMediaUploadOrThrow
} from './AttachmentChecks'
import {
  shouldSmartSplitContent,
  smartSplitContent,
  textFromTweetNode
} from './editorUtils'
import getCleanTextFromPastedData from './getCleanTextFromPastedData'
import HighFidelityPreview from './HighFidelityPreview'
import TweetToolbar from './TweetToolbar'

const TiptapTweetComponent = (props) => {
  const config = useConfig()
  const mediaUploadInputRef = useRef()
  const { hasTouch } = useDetectBrowser()

  const highFidelityPreview = useHighFidelityEnabled()
  const focusMode = useRecoilValue(focusModeState)
  const setThreadFinisherAttrs = useSetRecoilState(threadFinisherAttrsState)

  const {
    handleDragEnter,
    handleDragLeave,
    handleDropOrPaste,
    uploadAttachments,
    isDragging,
    setIsDragging,
    isUploading,
    extractFilesFromEvent
  } = useHandleEditorAttachments()

  const {
    url: attachmentUrl,
    linkPreview,
    quotedTweet
  } = useTweetMediaPreviews(textFromTweetNode(props.node.content))

  const focusedIndex = useRecoilValue(focusedIndexState)
  const isAltTextModalShown = useRecoilValue(altTextModalShownState)
  const tweetNumbering = useRecoilValue(tweetNumberingStringsState)

  // position of this tweet node in the document (index of first character in whole doc)
  const currentNodePosition = props.getPos()
  const nodes = props.editor.view.state.doc.content.content

  const currentTweetIndex = useMemo(() => {
    let nodePosition = 0

    for (let nodeIndex = 0; nodeIndex < nodes.length; nodeIndex++) {
      if (currentNodePosition === nodePosition) {
        return nodeIndex
      }
      nodePosition += nodes[nodeIndex].nodeSize
    }

    return 0
  }, [nodes, currentNodePosition])

  useEffect(() => {
    if (currentTweetIndex === 0) {
      setThreadFinisherAttrs(props.node.attrs)
    }
  }, [props.node.attrs, setThreadFinisherAttrs, currentTweetIndex])

  const isFocused = useMemo(
    () => currentTweetIndex === focusedIndex,
    [currentTweetIndex, focusedIndex]
  )

  const { headNumbering, tailNumbering } = useMemo(() => {
    const headNumbering = tweetNumbering?.heading[currentTweetIndex] ?? ''
    const tailNumbering = tweetNumbering?.tailing[currentTweetIndex] ?? ''

    return { headNumbering, tailNumbering }
  }, [tweetNumbering, currentTweetIndex])

  // TL:DR; we need to compute the charCount at runtime to account for eventual tweet numbering
  //
  // props.node.attrs.charCount a.k.a. thread.richText don't and can't know about tweet numbering,
  // because it's a twitter agnostic source of truth (e.g. tweet numbering should not be included in Typefully posts)
  //
  // thread.tweets is the source of truth for what is published on Twitter, and it should be aware of tweet numbering.
  const computedCharCount = useMemo(() => {
    return (
      props.node.attrs.charCount +
      parseTweet(headNumbering + tailNumbering).weightedLength
    )
  }, [props.node.attrs.charCount, headNumbering, tailNumbering])

  // /* ----------- ATTACHMENTS and MEDIA ----------- */
  const { data: threadMedia } = useSelectedThreadMedia()
  const attachments = useAttachments(props.node.attrs, threadMedia)

  // Used to show placeholders while the actual attachments load
  const tweetMediaAttachmentsCount =
    (props?.node?.attrs?.images?.length ?? 0) +
    (props?.node?.attrs?.gifs?.length ?? 0) +
    (props?.node?.attrs?.videos?.length ?? 0)

  const showMediaPlaceholders =
    tweetMediaAttachmentsCount > 0 && typeof attachments === 'undefined'

  function checkUploadRules(files) {
    const gifs = [
      ...files.filter((file) => VALID_GIF_TYPES.includes(file.type)),
      ...props.node.attrs.gifs
    ]
    const videos = [
      ...files.filter((file) => VALID_VIDEO_TYPES.includes(file.type)),
      ...props.node.attrs.videos
    ]
    const images = [
      ...files.filter((file) => VALID_IMAGE_TYPES.includes(file.type)),
      ...props.node.attrs.images
    ]

    assertValidMediaUploadOrThrow({ gifs, videos, images }, addMediaInvalidMsg)

    const unsupportedFile = files.find(
      (file) => !VALID_FILE_TYPES.includes(file.type)
    )

    if (unsupportedFile) {
      alert(
        `Unsupported file type (${unsupportedFile.name}).\n\nThese are the supported formats: ${VALID_FILE_TYPES_HUMAN_READABLE}.`
      )
      throw new Error()
    }
  }

  function handleFileInputChange(ev) {
    ev.stopPropagation()
    ev.preventDefault()

    const files = [...ev.target.files]
    uploadFiles(files)
  }

  function uploadFiles(files) {
    // if we don't reset the input, trying to upload the same image again will fail
    // since `onChange` will not be triggered on the input
    const resetInput = () => {
      if (!mediaUploadInputRef.current) {
        return
      }
      mediaUploadInputRef.current.value = null
    }

    try {
      checkUploadRules(files)
    } catch {
      resetInput()
      return
    }

    uploadAttachments(
      files,
      (uploadedAttachments) => {
        resetInput()
        props.editor
          .chain()
          .onAttachmentUploaded(uploadedAttachments, currentTweetIndex)
          .run()
      },
      resetInput
    )
  }

  function handleDropOrPasteEvent(ev) {
    // don't customize paste behavior when the altText modal is shown
    if (isAltTextModalShown) return

    // effectAllowed is "all" with media attachments, but "copyMove" for tweets
    if (ev.dataTransfer?.effectAllowed === 'all') {
      ev.preventDefault()
    }

    setIsDragging(false)

    const clipboardData = ev.clipboardData || window.clipboardData

    function handlePasteText() {
      // remove styling from pasted content
      const textOnly = clipboardData?.getData('text')
      const htmlText = clipboardData?.getData('text/html')

      const cleanPastedText = getCleanTextFromPastedData(textOnly, htmlText)

      if (cleanPastedText && cleanPastedText.length > 0) {
        const newContent = []
        const paragraphs = cleanPastedText.split('\n')
        if (paragraphs.length > 1) {
          paragraphs.forEach((paragraph) => {
            if (paragraph.length === 0) {
              newContent.push({ type: 'paragraph' })
            } else {
              newContent.push({
                type: 'paragraph',
                content: [{ type: 'text', text: paragraph }]
              })
            }
          })
        } else {
          newContent.push({ type: 'text', text: cleanPastedText })
        }

        try {
          props.editor.commands.insertContent(newContent)

          let content = props.editor.getJSON().content
          if (shouldSmartSplitContent(content)) {
            notif.show(
              <Stack gap={3} noWrap>
                <P1>Auto-split text?</P1>
                <Button
                  glow
                  variant='small'
                  onClick={() => {
                    content = smartSplitContent(content)
                    props.editor.commands.setContent(content, true)
                    notif.success('Thread-ified', {
                      position: 'top-center',
                      id: 'auto-split',
                      duration: 1500
                    })
                  }}
                >
                  Make thread
                </Button>
                <Icon
                  name='closeBold'
                  color={config.colors.c4}
                  onClick={() => notif.dismiss('auto-split')}
                />
              </Stack>,
              { duration: 6 * 1000, position: 'top-center', id: 'auto-split' }
            )
          }
        } catch (err) {
          notif.error("Can't paste content")

          console.error('Error pasting content: ', cleanPastedText)
          console.error('Error', err)
          console.log('New content:', newContent)
          console.log('Editor content:', props.editor.getJSON())

          Sentry.addBreadcrumb({
            data: {
              pasted: JSON.stringify(cleanPastedText),
              newContent: JSON.stringify(newContent)
            }
          })
          Sentry.captureMessage(
            `error pasting content: |${JSON.stringify(cleanPastedText)}|`
          )
          Sentry.captureMessage(
            `error setting content: |${JSON.stringify(newContent)}|`
          )
          Sentry.captureException(err)
        }

        // You can now safely prevent default since we handled dropping tweets and pasting
        ev.preventDefault()
        return true
      }
    }

    function handlePasteMedia() {
      const files = extractFilesFromEvent(ev)

      if (files.length === 0) return false

      try {
        checkUploadRules(files)
      } catch {
        return false
      }

      handleDropOrPaste(ev, (uploadedAttachments) => {
        props.editor
          .chain()
          .onAttachmentUploaded(uploadedAttachments, currentTweetIndex)
          .run()
      })
      return true
    }

    const textPasted = handlePasteText()

    if (!textPasted) {
      const mediaPasted = handlePasteMedia()
      if (!mediaPasted) {
        props.editor.commands.blur()
      }
    }
  }

  function handleDeleteAttachment(attachment) {
    props.editor
      .chain()
      .onClickDeleteAttachment(attachment, currentTweetIndex)
      .run()
  }

  const averageAspectRatio = getImagesAverageAspectRatio(attachments)

  const quoteType = (() => {
    if (props.node.attrs.isThreadFinisher ?? false) return 'threadFinisher'
    if (quotedTweet) return 'quote'
    return null
  })()

  const attachmentType = (() => {
    if (attachments.length > 0 || isUploading) return 'media'
    if (linkPreview && !quoteType) return 'link'
    return null
  })()

  const emptyText = props.node?.textContent.length === 0

  return (
    <NodeViewWrapper
      className='tweet-node-wrapper'
      onPaste={handleDropOrPasteEvent}
      onDrop={handleDropOrPasteEvent}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={(e) => {
        e.preventDefault()
        handleDragEnter(e)
      }}
      onDragLeave={(e) => {
        e.preventDefault()
        handleDragLeave(e)
      }}
    >
      <HighFidelityPreview
        index={focusedIndex}
        className={`${isFocused ? 'focused' : ''} ${
          isDragging ? 'dragging-media' : ''
        }`}
      >
        {!hasTouch && props.editor.isEditable && <DragHandle />}
        {!isUploading && (
          <input
            type='file'
            // needed to programmatically receive clicks from the tiptap extension
            id='upload_file'
            ref={mediaUploadInputRef}
            accept='image/*,video/*'
            multiple
            style={{ display: 'none' }}
            onChange={handleFileInputChange}
          />
        )}
        {(attachmentType || showMediaPlaceholders || quoteType) && (
          <div
            style={{
              // This moves the media after the tweet content
              marginTop: highFidelityPreview ? 6 : 16,
              order: 2,
              display: 'flex',
              flexDirection: 'column'
            }}
            contentEditable={false}
          >
            {showMediaPlaceholders && (
              <MediaWrapper
                asThumbnails={!highFidelityPreview}
                count={tweetMediaAttachmentsCount}
              >
                {[...Array(tweetMediaAttachmentsCount)].map((_, i) => (
                  <LoadingPlaceholder key={i} />
                ))}
              </MediaWrapper>
            )}
            {attachmentType === 'link' && (
              <LinkCardPreview
                url={attachmentUrl}
                linkPreview={linkPreview}
                style={{
                  width: highFidelityPreview ? '100%' : 220
                }}
              />
            )}
            {attachmentType === 'media' && (
              <MediaWrapper
                asThumbnails={!highFidelityPreview}
                count={attachments?.length + (isUploading ? 1 : 0)}
              >
                {attachments?.map((file) => {
                  if (file.mime.startsWith('image/')) {
                    const { width, height } = getThumbnailSize(file)
                    const isThumbnail = !highFidelityPreview

                    return (
                      <ImagePreview
                        key={file.id}
                        imageUrl={file.public_url}
                        mime={file.mime}
                        altText={file.alt_text}
                        onDelete={() => handleDeleteAttachment(file)}
                        aspectRatio={highFidelityPreview && averageAspectRatio}
                        width={isThumbnail && width}
                        height={isThumbnail && height}
                        style={isThumbnail ? { borderRadius: 6 } : {}}
                      />
                    )
                  } else if (file.mime.startsWith('video/')) {
                    return highFidelityPreview ? (
                      <VideoPreview
                        key={file.id}
                        url={file.public_url}
                        onDelete={() => handleDeleteAttachment(file)}
                      />
                    ) : (
                      <VideoThumbnail
                        key={file.id}
                        url={file.public_url}
                        onDelete={() => handleDeleteAttachment(file)}
                      />
                    )
                  }
                })}
                {isUploading && (
                  <LoadingPlaceholder aspectRatio={averageAspectRatio} />
                )}
              </MediaWrapper>
            )}
            {quoteType === 'quote' && (
              <QuotedTweet
                url={attachmentUrl}
                tweet={quotedTweet}
                noNestedQuote
                style={{
                  width: highFidelityPreview ? '100%' : 300,
                  zoom: highFidelityPreview ? 1 : 0.9
                }}
              />
            )}
            {quoteType === 'threadFinisher' && (
              <ThreadFinisher
                tweetAttrs={props.editor.getJSON().content[0].attrs}
                threadMedia={threadMedia}
                style={{
                  width: highFidelityPreview ? '100%' : 300,
                  zoom: highFidelityPreview ? 1 : 0.9
                }}
              />
            )}
          </div>
        )}
        <div className='toolbar-and-separator' contentEditable={false}>
          <div className='tweet-separator' />
          {isFocused && !focusMode && props.editor.isEditable && (
            <TweetToolbar
              key={currentTweetIndex.toString()}
              tweetIndex={currentTweetIndex}
              attachments={attachments}
              editorProps={props}
              charCount={computedCharCount}
              onGifClick={(file) => uploadFiles([file])}
            />
          )}
        </div>

        <NodeViewContentWithNumbering
          currentTweetIndex={currentTweetIndex}
          emptyText={emptyText}
          isFocused={isFocused}
        />
      </HighFidelityPreview>
    </NodeViewWrapper>
  )
}

const StyledNodeViewContent = styled(NodeViewContent)

const HIGH_FIDELITY_OPACITY = 1
const NORMAL_OPACITY = 0.5
const EMPTY_OPACITY = 0.25

const NodeViewContentWithNumbering = React.memo(
  ({ currentTweetIndex, emptyText, isFocused, children }) => {
    const tweetNumbering = useRecoilValue(tweetNumberingStringsState)
    const highFidelityPreview = useHighFidelityEnabled()

    const headNumbering = tweetNumbering?.heading[currentTweetIndex]
    const tailNumbering = tweetNumbering?.tailing[currentTweetIndex]

    return (
      <StyledNodeViewContent
        className='node-view-content'
        css={{
          '& .tweet-p:first-child::before': {
            ...(headNumbering && {
              content:
                (headNumbering ?? '') +
                (emptyText && !isFocused ? 'Empty tweet...' : ''),
              opacity: emptyText
                ? EMPTY_OPACITY
                : highFidelityPreview
                ? HIGH_FIDELITY_OPACITY
                : NORMAL_OPACITY
            }),
            ...(!headNumbering &&
              emptyText &&
              !isFocused && {
                content: 'Empty tweet...',
                opacity: EMPTY_OPACITY
              })
          },
          '& .tweet-p:last-child::after': {
            ...(tailNumbering && {
              content: (tailNumbering ?? '')?.replace(/\n/g, ''),
              opacity: emptyText
                ? EMPTY_OPACITY
                : highFidelityPreview
                ? HIGH_FIDELITY_OPACITY
                : NORMAL_OPACITY,
              display: 'block',
              marginTop: 22
            })
          }
        }}
      >
        {children}
      </StyledNodeViewContent>
    )
  }
)

NodeViewContentWithNumbering.displayName = 'StyledNodeViewContent'

const THUMBNAIL_BASE_HEIGHT = 70
const THUMBNAIL_BASE_WIDTH = 110

function getThumbnailSize(file) {
  const height = file.mime === 'image/gif' ? 100 : THUMBNAIL_BASE_HEIGHT
  const width = Math.min(
    Math.max(
      60,
      file.aspect_ratio ? height / file.aspect_ratio : THUMBNAIL_BASE_WIDTH
    ),
    160
  )
  return { width, height }
}

const LoadingPlaceholder = ({ aspectRatio }) => {
  const config = useConfig()
  const highFidelityPreview = useHighFidelityEnabled()

  const paddingBottom = aspectRatio ? aspectRatio * 100 + '%' : '60%'

  if (highFidelityPreview) {
    return (
      <Box
        className='loading'
        style={{
          width: '100%',
          height: 0,
          paddingBottom,
          background: config.colors.c5
        }}
      />
    )
  } else {
    return (
      <Box
        className='loading'
        style={{
          borderRadius: 6,
          width: THUMBNAIL_BASE_WIDTH,
          height: THUMBNAIL_BASE_HEIGHT,
          background: config.colors.c5
        }}
      />
    )
  }
}

export default TiptapTweetComponent
