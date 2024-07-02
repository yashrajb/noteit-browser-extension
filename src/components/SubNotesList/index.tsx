import React, { useMemo } from 'react'
import { INote } from '@app/notes/notes.types'
import { useStore } from '@app/hooks/useStore'
import { SubNotesDetails } from '../SubNotesDetails'
import './index.scss'
interface IContentList extends React.PropsWithChildren {
  title: string
}

const SubNotesList = (props: IContentList) => {
  const { title } = props
  const { notes } = useStore()

  const { subNotes } = notes[title]
  console.log("subNotes",subNotes)
  return (
    <div className="note_sublist">
      {subNotes.map((content, index) => {
        console.log(content)
        return <SubNotesDetails title={title} {...content} index={index} />
      })}
    </div>
  )
}

export { SubNotesList }
