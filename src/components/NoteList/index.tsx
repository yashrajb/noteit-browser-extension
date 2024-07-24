import { INote } from "@app/notes/notes.types"
import { useStore } from "@app/hooks/useStore"
import React, { useMemo } from "react"
import { NoteDetails } from "../NoteDetails"

const NoteList = () => {
  const { notes } = useStore()

  const notesKeys: string[] = useMemo(() => {
    return Object.keys(notes)
  }, [notes])

  return (
    <>
      {notesKeys.map((key: string) => {
        const { title, url } = notes[key]
        if (title) {
          return <NoteDetails title={title} url={url} />
        }
        return null
      })}
    </>
  )

  // return
}

export { NoteList }
