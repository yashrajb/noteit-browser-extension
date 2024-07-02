import React, { useMemo, useState } from 'react'
import { SubNotesList } from '../SubNotesList'
import LocalStorage from '@app/notes/index'
import './index.scss'

import TrashImg from '@app/assets/trash.svg'
import ShareLinkImg from '@app/assets/share-link.png'

interface INoteDetails extends React.PropsWithChildren {
  title: string
  url: string
}

const NoteDetails = (props: INoteDetails) => {
  const { title, url } = props
  const [showSubNotes, setShowSubNotes] = useState(false)

  const toggleShowSubNotes = () => {
    setShowSubNotes((prevState) => !prevState)
  }

  const onDelete = () => LocalStorage.delete(title)

  return (
    <div key={title} className="card note">
      <div className="row">
        <div className="col-10 note__title" onClick={toggleShowSubNotes}>
          {title}
        </div>
        <div className="col-1 note__url" title="link of webpage">
          <a href={url} target="_blank">
            <img className="image" src={ShareLinkImg} alt="share link icon" />
          </a>
        </div>
        <div className="col-1 note__delete" title="delete all notes">
          <img className="image" src={TrashImg} alt="delete icon" onClick={onDelete} />
        </div>
      </div>
      {showSubNotes ? <SubNotesList title={title} /> : ''}
    </div>
  )
}

export { NoteDetails }
