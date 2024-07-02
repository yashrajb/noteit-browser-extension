import { EVENTS } from "@app/constant";
import { ITab } from "./background.types";
import Notes from "@app/notes";

/**
 * Background scripts or a background page enable you to monitor and react to events
 * in the browser, such as navigating to a new page, removing a bookmark, or closing
 * a tab.
 */

class BackGroundScript {
  constructor() {
    browser.runtime.onInstalled.addListener(this.onInstalled.bind(this));
    browser.contextMenus.onClicked.addListener(
      this.onClickedContext.bind(this)
    );
    browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      if (msg.event === EVENTS["SHAREDNOTE"]) {
        this.sharedNote(msg.data, sendResponse);
      }
      return true;
    });
  }

  /**
   * This callback function is triggered when the extension is first installed
   * in the browser. It adds an empty object to the local storage of the
   * Firefox extension, which will be used for storing notes.
   * It also adds the 'Note It' option to the context menu of the Firefox extension.
   *
   * @param {browser.runtime.InstalledDetails}
   * @return {void}
   */
  async onInstalled(details: browser.runtime._OnInstalledDetails) {
    if (details.reason === "install") {
      try {
        await browser.storage.local.set({ data: {} });
      } catch (e) {
        console.error("Error on onInstalled function in background.ts:", e);
      }
    }
    browser.contextMenus.create({
      id: EVENTS["SELECTION"],
      title: "Note It",
      contexts: ["selection"],
    });
  }

  /**
   * This function is triggered when a context menu item is clicked.
   * It checks if the clicked item is the 'Note It' option and if a tab is available.
   * If both conditions are met, it sends a message to the tab and adds a note using the
   * `Notes` service.
   *
   * @param {browser.contextMenus.OnClickData} info - The information about the clicked context menu item.
   * @param {browser.tabs.Tab} [tab] - The tab where the context menu item was clicked (optional).
   * @return {Promise<void>}
   */
  async onClickedContext(
    info: browser.contextMenus.OnClickData,
    tab?: browser.tabs.Tab
  ) {
    try {
      console.log(1);
      if (!tab || info.menuItemId !== EVENTS["SELECTION"]) {
        return;
      }
      console.log(2);
      const typedTab: ITab = tab as ITab;
      console.log(typedTab);
      const response = await browser.tabs.sendMessage(typedTab.id, {
        event: info.menuItemId,
      });
      await Notes.add({
        title: typedTab.title,
        content: response,
        url: typedTab.url,
      });
    } catch (err) {
      console.error("Error in onClickedContext:", err);
    }
  }

  /**
   * This function is triggered when a message is received with the event 'SHAREDNOTE'.
   * It decrypts the note data and adds it to the notes.
   *
   * @param {string} data - The encrypted note data.
   * @param {Function} sendResponse - The function to send a response back to the sender.
   * @return {Promise<void>}
   */
  async sharedNote(data: string, sendResponse: (response: boolean) => void) {
    try {
      let decryptedContent: CryptoJS.lib.WordArray | string =
        CryptoJS.AES.decrypt(data, "");
      decryptedContent = decryptedContent.toString(CryptoJS.enc.Utf8);
      const res = await Notes.add(JSON.parse(decryptedContent));
      sendResponse(res);
    } catch (e) {
      sendResponse(false);
    }
  }
}

new BackGroundScript();
