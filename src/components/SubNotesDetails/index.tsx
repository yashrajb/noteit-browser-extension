import React, { useEffect, useMemo } from "react"

import CopyImg from "@app/assets/copy.svg"
import ShareLinkImg from "@app/assets/share-link.png"
import TrashImg from "@app/assets/trash.svg"
import { useClipboard } from "@app/hooks/useClipboard"
import Notes from "@app/notes/index"
interface INoteContentDeails {
  title: string
  text: string
  url: string
  index: number
}

const SHARE_LINK_SELECTOR = {
  selector: ".share__link",
  message: "copied link!",
}
const COPY_CONTENT_SELECTOR = {
  selector: ".copy__content",
  message: "copied note!",
}

const SubNotesDetails = (props: INoteContentDeails) => {
  const { title, index, text, url } = props

  useClipboard(SHARE_LINK_SELECTOR.selector, SHARE_LINK_SELECTOR.message)
  useClipboard(COPY_CONTENT_SELECTOR.selector, COPY_CONTENT_SELECTOR.message)

  const onDelete = async () => await Notes.deleteSubNote(title, index)

  return (
    <div className="row">
      <div className="col-9 content">{text}</div>
      <div
        className="col-1 copy__content"
        title="Copy Note"
        data-clipboard-text={text}
      >
        <img src={CopyImg} className="image" />
      </div>
      <div
        className="col-1 share__link"
        title="Copy Link"
        data-clipboard-text={url}
      >
        <img src={ShareLinkImg} className="image" />
      </div>
      <div
        className="col-1 content__delete"
        title="Delete Note"
        data-content={text}
        onClick={onDelete}
      >
        <img className="image" src={TrashImg} alt="link icon" />
      </div>
    </div>
  )
}

export { SubNotesDetails }
