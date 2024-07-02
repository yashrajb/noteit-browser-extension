import { INote } from "@app/notes/notes.types";

class LocalStorage {
  static instance: LocalStorage;

  constructor() {
    if (!LocalStorage.instance) {
      LocalStorage.instance = this;
    }

    return LocalStorage.instance;
  }

  /**
   * Retrieves data from Chrome's local storage.
   * @returns {Promise<{ [key: string]: INote } | undefined>} The data stored in local storage, or undefined if there is no data.
   * @throws {Error} Throws an error if the retrieval fails.
   */

  async get() {
    try {
      let data = await browser.storage.local.get(["data"]);
      return data.data;
    } catch (err: any) {
      throw new Error("Error in get function of LocalStorage", err);
    }
  }

  /**
   * Sets data in Chrome's local storage.
   * @param {Object} data - The data to be stored, with keys as strings and values as INote objects.
   * @returns {Promise<void>} A promise that resolves when the data has been set.
   * @throws {Error} Throws an error if the storage operation fails.
   */
  async set(data: { [key: string]: INote }) {
    try {
      console.log("in localstorage set", data);
      return await browser.storage.local.set({ data });
    } catch (err: any) {
      throw new Error("Error in set function of LocalStorage", err);
    }
  }

  /**
   * Adds a change listener to Chrome's local storage.
   * @param {Function} callback - The callback function to be called when the storage changes.
   */
  onChangeListener(callback: () => {}) {
    browser.storage.onChanged.addListener(callback);
  }

  /**
   * Removes a change listener from Chrome's local storage.
   * @param {Function} callback - The callback function to be removed.
   */
  removeOnChangeListener(callback: () => {}) {
    browser.storage.onChanged.removeListener(callback);
  }
}

const instance = new LocalStorage();

export default instance as LocalStorage;
