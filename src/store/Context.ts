import React, { createContext, useContext } from 'react'
import { INote } from '@app/notes/notes.types'

interface IDefaultNotes {
  [key: string]: INote
}

export interface IContext {
  notes: IDefaultNotes
  setNotes: React.Dispatch<React.SetStateAction<IDefaultNotes>>
  showClipboardMessage: string
  setClipboardMessage: React.Dispatch<React.SetStateAction<string>>
}

const defaultValue: IContext = {
  notes: {},
  setNotes: () => {},
  showClipboardMessage: '',
  setClipboardMessage: () => {},
}

export const Context = createContext<IContext>(defaultValue)
