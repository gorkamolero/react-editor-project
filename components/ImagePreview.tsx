import { AnimatePresence, motion } from 'framer-motion'
import useSelectedThreadMetadata from '../hooks/useSelectedThreadMetadata'
import React, { Fragment, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { useSetRecoilState } from 'recoil'
import { IMime, ThreadStatus } from '../types'
import Box from '../uikit/src/base/Box'
import Button from '../uikit/src/buttons/Button'
import CircleButton from '../uikit/src/buttons/CircleButton'
import { Icon } from '../uikit/src/components/Icon'
import Spinner from '../uikit/src/components/Spinner'
import Stack from '../uikit/src/layout/Stack'
import Tooltip from '../uikit/src/components/Tooltip'
import useBreakpoint from '../uikit/src/hooks/useBreakpoint'
import { useConfig } from '../uikit/src/hooks/configHooks'
import { UIKitCSSProperties } from '../uikit/src/base/Box'
import {
  imageEditingModalShownState,
  imageEditingPropsState
} from '../utils/recoilState'
import zIndexes from '../zIndexes'

export type ImagePreviewProps = {
  imageUrl: string
  altText?: string
  width?: string | number
  height?: string | number
  mime?: IMime
  name?: string
  humanId?: string
  forceError?: boolean
  aspectRatio?: number | null
  onDelete?: () => void
  isEditable?: boolean
  style?: UIKitCSSProperties
}

export const ImagePreview = ({
  imageUrl,
  altText,
  width = '100%',
  height,
  mime,
  name,
  humanId,
  forceError,
  aspectRatio,
  onDelete,
  isEditable = false,
  style
}: ImagePreviewProps) => {
  const config = useConfig()

  const [isLoading, setIsLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  const setImageProps = useSetRecoilState(imageEditingPropsState)
  const setImageEditingModalShown = useSetRecoilState(
    imageEditingModalShownState
  )

  const paddingBottom = (() => {
    if (height) return 0
    if (aspectRatio) {
      return aspectRatio * 100 + '%'
    }
    if (isLoading) {
      return '56%'
    }
    return 0
  })()

  const [fullScreenPreviewShown, setFullScreenPreviewShown] = useState(false)

  function handleClick() {
    if (imageUrl) {
      setFullScreenPreviewShown(!fullScreenPreviewShown)
    }
  }

  function handleEditImage() {
    if (name && humanId && imageUrl) {
      setImageProps({
        type: 'internal-image',
        name,
        humanId,
        imageUrl
      })
    } else {
      throw new Error("Can't edit image")
    }
    setImageEditingModalShown(true)
  }

  const showControls = (isEditable && isStaticImage(mime)) || onDelete

  return (
    // This key is required to keep the right positioning for the image,
    // otherwise it breaks when changing thread
    <Fragment key={imageUrl}>
      <div
        style={{
          position: 'relative',
          cursor: imageUrl ? 'pointer' : 'default',
          width: width,
          height: height || (paddingBottom ? 0 : 'auto'),
          paddingBottom: paddingBottom,
          background: config.colors.c6,
          overflow: 'hidden',
          boxSizing: 'border-box',
          lineHeight: 0,
          ...style
        }}
        role='img'
        className='media-wrapper'
        aria-label={altText}
      >
        <img
          onClick={handleClick}
          src={imageUrl}
          alt={altText}
          onError={() => setFailed(true)}
          onLoad={() => setIsLoading(false)}
          loading='lazy'
          style={{
            background: config.colors.c6,
            ...(paddingBottom || (width && height)
              ? {
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'top center'
                }
              : {
                  width: '100%',
                  height: 'auto'
                })
          }}
        />
        {mime === 'image/gif' && <GifBadge offset={12} />}
        {forceError && (
          <MediaFailedState
            title="Can't find this image :("
            description='Please upload a new image.'
          />
        )}
        {failed && (
          <MediaFailedState
            title='There was an error :('
            description='Please try refreshing the page.'
          />
        )}
        {showControls && (
          <div
            className='media-hover-buttons'
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              left: 0,
              zIndex: 15,
              background:
                'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 100%)',
              padding: '6px 6px 24px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Stack w='100%' align='right'>
              {isEditable && isStaticImage(mime) && (
                <Button
                  icon='bucket'
                  variant={['pill', 'white']}
                  border='none'
                  onClick={handleEditImage}
                >
                  {width < 200 ? '' : 'Edit'}
                </Button>
              )}
              {onDelete && <MediaDeleteButton onDelete={onDelete} />}
            </Stack>
          </div>
        )}
      </div>
      <FullScreenPreview
        imageUrl={imageUrl}
        show={fullScreenPreviewShown}
        setShown={setFullScreenPreviewShown}
      />
    </Fragment>
  )
}

export const FullScreenPreview = ({ imageUrl, show, setShown }) => {
  const hit = useBreakpoint()
  const [loaded, setLoaded] = useState(false)

  const [mount, setMount] = useState(false)
  const [fadeInBackground, setFadeInBackground] = useState(false)
  const [shouldUnmount, setShouldUnmount] = useState(false)

  useEffect(() => {
    if (show) {
      setMount(true)
      const t = setTimeout(() => {
        setFadeInBackground(true)
      }, 1)
      return () => clearTimeout(t)
    }
  }, [show])

  useEffect(() => {
    setLoaded(!show)
  }, [show])

  const padding = hit ? 10 : 22

  if (!mount) return null

  return ReactDOM.createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        background: fadeInBackground
          ? 'rgba(30,30,30,0.8)'
          : 'rgba(30,30,30,0)',
        backdropFilter: fadeInBackground ? 'blur(10px)' : 'blur(0px)',
        WebkitBackdropFilter: fadeInBackground ? 'blur(10px)' : 'blur(0px)',
        transition: 'background 0.1s ease-in-out',
        zIndex: zIndexes.imagePreview
      }}
      onClick={() => setShown(false)}
    >
      <div
        style={{
          overflow: 'hidden',
          width: '100%',
          height: '100%',
          position: 'fixed',
          padding: padding,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box'
        }}
        onClick={() => setShown(false)}
      >
        {!loaded && (
          <Spinner
            size={30}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              opacity: 0.5
            }}
          />
        )}
        <AnimatePresence>
          {show && imageUrl && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.3, bounce: 0.2 }}
              onAnimationStart={() => {
                if (shouldUnmount) {
                  setFadeInBackground(false)
                }
              }}
              onAnimationComplete={() => {
                setShouldUnmount(true)

                if (shouldUnmount) {
                  setMount(false)
                  setShouldUnmount(false)
                }
              }}
              style={{ position: 'relative' }}
            >
              <img
                width='100%'
                height='100%'
                src={imageUrl}
                alt='Image'
                onLoad={() => setLoaded(true)}
                style={{
                  display: 'block',
                  maxHeight: '80vh',
                  objectFit: 'contain',
                  borderRadius: 8
                }}
              />

              {loaded && <CloseButton onClick={() => setShown(false)} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>,
    // @ts-ignore
    document.getElementById('__next')
  )
}

const CloseButton = ({ onClick }) => {
  const config = useConfig()
  return (
    <Box
      // @ts-ignore
      as={motion.div}
      // @ts-ignore
      initial={{ scale: 0.5, opacity: 0 }}
      // @ts-ignore
      animate={{ scale: 1, opacity: 1 }}
      flex
      ai='center'
      jc='center'
      background={config.colors.c1}
      w={9}
      h={9}
      radius={9}
      style={{
        position: 'absolute',
        top: 12,
        right: 12,
        cursor: 'pointer',
        zIndex: 10
      }}
      onClick={onClick}
    >
      <Icon name='close' color={config.colors.c6} size={24} />
    </Box>
  )
}

export const MediaFailedState = ({ title, description }) => {
  const config = useConfig()
  return (
    <Box
      position={'absolute'}
      top={'0'}
      left={'0'}
      right={'0'}
      bottom={'0'}
      flex
      ai='center'
      jc='center'
      background={config.colors.bg4}
      zIndex='2'
    >
      <Tooltip maxWidth={220} title={title} description={description}>
        <Icon name='warningBold' color={config.colors.c5} />
      </Tooltip>
    </Box>
  )
}

export const MediaDeleteButton = ({ onDelete }: { onDelete: () => void }) => {
  const config = useConfig()

  const thread = useSelectedThreadMetadata()

  if (!thread || thread.status === ThreadStatus.Published) return null

  return (
    <div onClick={onDelete}>
      <CircleButton
        icon='close'
        size='26px'
        iconSize='14px'
        iconStroke='3px'
        border='none'
        variant='white'
        style={{
          border: 'none',
          pointerEvents: 'none'
        }}
      />
    </div>
  )
}

export const GifBadge = ({ offset = 18 }: { offset?: number }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: offset,
        bottom: offset,
        background: 'rgba(0, 0, 0, 0.77)',
        color: 'white',
        borderRadius: 4,
        padding: '3px 4px',
        lineHeight: 1,
        fontSize: '13px',
        fontWeight: '700'
      }}
    >
      GIF
    </div>
  )
}

const isStaticImage = (mime?: IMime) =>
  mime === 'image/png' ||
  mime === 'image/jpeg' ||
  mime === 'image/jpg' ||
  mime === 'image/webp'
