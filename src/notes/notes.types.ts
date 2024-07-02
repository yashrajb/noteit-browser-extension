export interface ISubNote {
  text: string
  url: string
}

export interface INote {
  title: string
  subNotes: ISubNote[]
  url: string
}

export interface IAddNote {
  title: string
  content: string
  url: string
}
