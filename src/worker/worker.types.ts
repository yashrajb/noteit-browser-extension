import { INote } from '@app/notes/notes.types'



export interface IWorkerFIleExt {
  fileExtension: 'md' | 'txt'
}

export interface IWorker extends IWorkerFIleExt {
  data: {
    [key: string]: INote
  }
}
