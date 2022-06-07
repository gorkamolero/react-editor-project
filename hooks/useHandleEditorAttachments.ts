// import { useRef, useState } from 'react'
// import { useRecoilState, useRecoilValue } from 'recoil'
// import { IMime } from '../types'
// import notif from '../uikit/src/utils/notif'
// import { fileUploader } from '../utils/api'
// import notifApiError from '../utils/notifApiError'
// import { pluralize } from '../utils/pluralize'
// import { demoModeState, selectedThreadIDState } from '../utils/recoilState'
// import { useSelectedThreadMedia } from './useThreadMedia'

// export const VALID_IMAGE_TYPES: IMime[] = [
//   'image/png',
//   'image/jpeg',
//   'image/jpg',
//   'image/webp'
// ]
// export const VALID_GIF_TYPES: IMime[] = ['image/gif']
// export const VALID_VIDEO_TYPES: IMime[] = [
//   'video/mp4',
//   'video/quicktime',
//   'video/mov'
// ]
// export const VALID_FILE_TYPES = [
//   ...VALID_IMAGE_TYPES,
//   ...VALID_GIF_TYPES,
//   ...VALID_VIDEO_TYPES
// ]
// export const VALID_FILE_TYPES_HUMAN_READABLE = VALID_FILE_TYPES.map((type) =>
//   type.split('/')[1].toUpperCase()
// ).join(', ')

// export default function useHandleEditorAttachments() {
//   const selectedThreadID = useRecoilValue(selectedThreadIDState)
//   const [demoMode, setDemoMode] = useRecoilState(demoModeState)

//   const [isDragging, setIsDragging] = useState(false)
//   const [isUploading, setUploading] = useState(false)

//   const { mutate: mutateMedia } = useSelectedThreadMedia()

//   const dragEnterDate = useRef<number | null>(null)

//   function handleDragEnter(event) {
//     // copyMove effect is triggered when dragging tweets, otherwise it's "all"
//     if (event?.dataTransfer?.effectAllowed === 'copyMove') return

//     dragEnterDate.current = Date.now()

//     const fileTypes = [...event.dataTransfer.items].map((file) => file.type)
//     const validFile = VALID_FILE_TYPES.some((type) => fileTypes.includes(type))

//     if (!validFile) return

//     // Remove TipTap drop-cursor when dragging media
//     document.querySelector('.drop-cursor')?.classList.add('hidden')

//     setIsDragging(true)
//     event.preventDefault()
//   }

//   function handleDragLeave(e) {
//     // Ignore instant dragLeave events, they're false positives
//     if (dragEnterDate.current && Date.now() - dragEnterDate.current < 10) return

//     setIsDragging(false)
//   }

//   function uploadAttachments(files, onSuccess, onError) {
//     setIsDragging(false)

//     // don't allow upload if user not logged in
//     if (demoMode) {
//       setDemoMode(false)
//       return
//     }

//     let addingWhat

//     if (files.length === 1 && files[0].type.startsWith('video/')) {
//       addingWhat = 'video'
//       if (files[0].size > maxSizes.video) {
//         notif.error('Video needs to be smaller than 512MB')
//         return
//       }
//     } else if (files.length === 1 && files[0].type.startsWith('image/gif')) {
//       addingWhat = 'GIF'
//       if (files[0].size > maxSizes.gif) {
//         notif.error('GIF needs to be smaller than 15MB')
//         return
//       }
//     } else {
//       addingWhat = pluralize('image', files.length)
//       if (files.some((file) => file.size > maxSizes.image)) {
//         notif.error('Images need to be smaller than 5MB')
//         return
//       }
//     }

//     setUploading(true)
//     notif.loading(`Uploading ${addingWhat}...`, {
//       duration: 9999,
//       id: 'image-upload-status'
//     })

//     Promise.all(files.map((image) => fileUploader(image, selectedThreadID)))
//       .then((_files) => {
//         // _files[i] will be undefined if i-th image upload failed
//         const files = _files.filter((f) => f)
//         if (files.length === 0) return
//         setUploading(false)
//         mutateMedia((cache) => [...(cache ?? []), ...files], {
//           revalidate: false
//         })
//         notif.success('Uploaded!', {
//           duration: 1200,
//           id: 'image-upload-status'
//         })
//         onSuccess && onSuccess(files)
//       })
//       .catch((err) => {
//         const fallbackMsg =
//           "Can't upload image, please check that it is at most 4.8 MB"
//         notifApiError(err, fallbackMsg, {
//           duration: 2000,
//           id: 'image-upload-status'
//         })
//         // eslint-disable-next-line no-console
//         console.log('media upload error', err)
//         onError && onError()
//       })
//       .finally(() => {
//         setUploading(false)
//       })
//   }

//   function handleDropOrPaste(ev, onSuccess, onError) {
//     setIsDragging(false)

//     const files = extractFilesFromEvent(ev)
//     if (files.length > 0) {
//       ev.preventDefault()
//       uploadAttachments(files, onSuccess, onError)
//     }
//   }

//   function extractFilesFromEvent(ev) {
//     let mediaFiles: File[] = []

//     // handle drop
//     if (ev.dataTransfer) {
//       mediaFiles = ([...ev.dataTransfer?.files] ?? [])?.filter(
//         (item) =>
//           item.type.startsWith('image/') || item.type.startsWith('video/')
//       )
//     }

//     if (mediaFiles.length === 0 && ev.clipboardData) {
//       // handle paste
//       mediaFiles = [...ev.clipboardData?.items]
//         .filter(
//           (item) =>
//             item.type.startsWith('image/') || item.type.startsWith('video/')
//         )
//         .map((item) => item.getAsFile())
//     }

//     return mediaFiles
//   }

//   return {
//     handleDragEnter,
//     handleDragLeave,
//     handleDropOrPaste,
//     isUploading,
//     isDragging,
//     setIsDragging,
//     uploadAttachments,
//     extractFilesFromEvent
//   }
// }

// const maxSizes = {
//   video: 512 * 2 ** 20,
//   image: 5 * 2 ** 20,
//   gif: 15 * 2 ** 20
// }
