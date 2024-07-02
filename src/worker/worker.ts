import { INote, ISubNote } from '@app/notes/notes.types'
import { IWorker } from './worker.types'

/**
 * A web worker is a JavaScript script that runs in the background,
 * separate from the main execution thread of a web application.
 * This allows web applications to perform tasks without interfering
 * with the user interface, providing a more responsive experience.
 * Web workers can handle time-consuming tasks such as computations or
 * data processing without blocking the main thread,
 * which is responsible for updating the UI and responding to user
 * interactions.
 *
 * @param {Object<data>}
 *
 */

self.onmessage = async function (e: MessageEvent<IWorker>) {
  const { fileExtension } = e.data
  const data = e.data.data
  console.log('hello from worker')
  let allNotes = Object.keys(data)

  const fileContent =
    fileExtension == 'txt' ? exportAsText(allNotes, data) : exportAsMarkdown(allNotes, data)

  self.postMessage({ content: fileContent })
  return
}

/**
 * Exports notes as a plain text
 * @param {string[]}
 * @param {{[key: string]: INote}}
 * @returns {string}
 */

function exportAsText(
  allNotes: string[],
  data: {
    [key: string]: INote
  },
): string {
  let fileContent = ''
  allNotes.forEach((item, index) => {
    let { url, subNotes } = data[item] as INote
    const title = `${index + 1}. ${item}\n`
    const urlText = `(${url})\n\n`
    fileContent += title
    fileContent += urlText
    if (subNotes && subNotes.length) {
      subNotes.forEach(({ text }: ISubNote) => {
        const subNote = `- ${text}\n\n`
        fileContent += subNote
      })
    }

    fileContent += '\n\n'
  })
  return fileContent
}

/**
 * Exports notes as a markdown text
 * @param {string[]}
 * @param {{[key: string]: INote}}
 * @returns {string}
 */

function exportAsMarkdown(allNotes: string[], data: { [key: string]: INote }): string {
  let fileContent = ''
  allNotes.forEach((item, index) => {
    let { url, subNotes } = data[item]
    const title = `# ${index + 1}. ${item}\n`
    const urlText = `[Link](${url})\n\n`
    fileContent += title
    fileContent += urlText
    if (subNotes && subNotes.length) {
      subNotes.forEach(({ text }: ISubNote, i: number) => {
        const subNote = `### ${i + 1} ${text}\n\n`
        fileContent += subNote
      })
    }
    fileContent += '\n\n'
  })
  return fileContent
}
