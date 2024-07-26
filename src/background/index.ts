import { EVENTS } from "@app/constant"
import { ITab } from "./background.types"
import Notes from "@app/notes"

/**
 * Background scripts or a background page enable you to monitor and react to events
 * in the browser, such as navigating to a new page, removing a bookmark, or closing
 * a tab.
 */

export class BackGroundScript {
  constructor() {
    chrome.runtime.onInstalled.addListener(this.onInstalled)

    chrome.contextMenus.onClicked.addListener(this.onClickedContext)
  }

  /**
   * This callback function is triggered when the extension is first time installed
   * in the browser. It adds an empty object to the local storage of the
   * Chrome extension, which will be used for storing notes.
   * It also adds the 'Note It' option to the context menu of the Chrome extension.
   *
   * @param {chrome.runtime.InstalledDetails}
   * @return {void}
   */

  async onInstalled(details: chrome.runtime.InstalledDetails) {
    try {
      if (details.reason == "install") {
        await chrome.storage.local.set({ data: {} })
      }
      chrome.contextMenus.create({
        id: EVENTS["SELECTION"],
        title: "Note It",
        contexts: ["selection"],
      })
    } catch (e: unknown | Error | any) {
      console.log("Error on onInstalled Function in background.js", e)
      throw new Error(e)
    }
  }

  /**
   * This function is triggered when a context menu item is clicked.
   * It checks if the clicked item is the 'Note It' option and if a tab is available.
   * If both conditions are met, it sends a message to the tab and adds a note using the
   * `Notes` service.
   *
   * @param {chrome.contextMenus.OnClickData} - The information about the clicked context menu item.
   * @param {chrome.tabs.Tab} - The tab where the context menu item was clicked (optional).
   * @return {void}
   */

  async onClickedContext(
    info: chrome.contextMenus.OnClickData,
    tab?: chrome.tabs.Tab,
  ) {
    try {
      if (!tab || info.menuItemId != EVENTS["SELECTION"]) {
        return
      }
      const typedTab: ITab = tab as ITab
      const response = await chrome.tabs.sendMessage(typedTab.id, {
        event: info.menuItemId,
      })
      await Notes.add({
        title: typedTab.title,
        content: response,
        url: typedTab.url,
      })
    } catch (err: any) {
      console.log("Error in onClickedContext function in background.js", err)
      throw new Error(err)
    }
  }
}

new BackGroundScript()
