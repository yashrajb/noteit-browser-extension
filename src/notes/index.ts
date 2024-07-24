import { MAIN_URL } from "@app/constant";
import { IAddNote, INote, ISubNote } from "./notes.types";
import LocalStorage from "@app/storage";
import { AES } from "crypto-js";

/**
 * Notes class handles creating shareable url,
 * deleting note, adding note,
 * adding content (which is nothing but selected text by user)
 */

class Notes {
  static instance: Notes;

  /**
   * Creates a singleton instance of the Notes class.
   * Ensures only one instance exists throughout the application.
   */

  constructor() {
    if (!Notes.instance) {
      Notes.instance = this;
    }
    return Notes.instance;
  }

  /**
   * Generates a shareable URL with encrypted note data.
   * @param {INote} - The note object containing title, content, and url.
   * @returns {string} - The encrypted shareable URL.
   * @throws {Error} - Throws an error if encryption fails.
   */

  private generateUrl({ title, content, url }: IAddNote) {
    try {
      let encryptedContent = AES.encrypt(
        JSON.stringify({ title, content, url }),
        ""
      ).toString();
      let shareableUrl = `${MAIN_URL}/notes/?q=${encodeURIComponent(encryptedContent)}`;
      return shareableUrl;
    } catch (e: any) {
      throw new Error("Error in generateUrl function of notes", e);
    }
  }

  /**
   * Checks if a note with given title already exists in local storage.
   * @param {string}- The title of the note to check.
   * @returns {Promise<boolean>} - A promise resolving to true if note exists, false otherwise.
   * @throws {Error} - Throws an error if local storage access fails.
   */

  private async isNoteExists(title: string) {
    try {
      let data = await LocalStorage.get();
      return data[title] ? true : false;
    } catch (e: any) {
      throw new Error("Error in isNoteExists function of notes", e);
    }
  }

  /**
   * Adds a new note to local storage.
   * @param {INote} param0 - The note object containing title, content, and url.
   * @returns {boolean} - A promise resolving to true if addition is successful.
   * @throws {Error} - Throws an error if local storage access or addition fails.
   */

  async add({ title, content, url }: IAddNote) {
    try {
      const data = await LocalStorage.get();
      const shareableUrl = this.generateUrl({ title, content, url });
      const doesNoteExists = await this.isNoteExists(title);
      const newNote: ISubNote = {
        text: content,
        url: shareableUrl,
      };
      if (doesNoteExists) {
        data[title]["subNotes"].push(newNote);
      } else {
        data[title] = {
          title,
          url,
          subNotes: [newNote],
        };
      }

      await LocalStorage.set(data);
      return true;
    } catch (e: any) {
      throw new Error("Error in add function of notes", e);
    }
  }

  /**
   * Delete a note to local storage.
   * @param {string} - The note title.
   * @returns {void}
   * @throws {Error}
   */

  async delete(title: string) {
    try {
      const data = await LocalStorage.get();
      delete data[title];
      await LocalStorage.set(data);
    } catch (e: any) {
      throw new Error("Error in delete function of notes", e);
    }
  }

  /**
   * Delete a subnotes of note to local storage.
   * @param {string} - The note title.
   * @param {number} - index of subnote
   * @returns {void}
   * @throws {Error}
   */

  async deleteSubNote(title: string, index: number) {
    try {
      console.log(title, index);
      if (await this.isNoteExists(title)) {
        const data = await LocalStorage.get();
        const note: INote = data[title];
        note.subNotes = note?.subNotes?.filter((content, i) => i !== index);
        await LocalStorage.set(data);
      }
    } catch (e: any) {
      throw new Error("Error in deleteSubNote function of notes", e);
    }
  }
}

const instanceOfNotes = new Notes();
export default instanceOfNotes as Notes;
