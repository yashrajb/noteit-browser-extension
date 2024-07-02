import React, { useEffect } from 'react'
import { useStore } from './useStore'
import Clipboard from 'clipboard'

const useClipboard = (selector: string, message: string) => {
  const { setClipboardMessage } = useStore()

  const onSuccess = (e: Clipboard.Event) => {
    setClipboardMessage(message)
    setTimeout(() => {
      setClipboardMessage('')
    }, 1000)
  }

  useEffect(() => {
    const clipboardSelector = new Clipboard(selector)
    clipboardSelector.on('success', onSuccess)
  })

  return ''
}

export { useClipboard }
