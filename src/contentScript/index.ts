import { EVENTS } from "@app/constant"

/**
 * Content scripts are files that run in the context of web pages.
 * Using the standard Document Object Model (DOM), they are able to
 * read details of the web pages the browser visits, make changes to them,
 * and pass information to their parent extension.
 */

export class ContentScript {
  constructor() {
    chrome.runtime.onMessage.addListener(this.onMessage)
  }

  /**
   * This function is called when a message is received from the background script.
   * It checks if the message event matches the 'SELECTION' event.
   * If so, it gets the text selection from the current webpage and sends it back as a response.
   *
   * @param {any}
   * @param {chrome.runtime.MessageSender} .
   * @param {Function}
   */

  onMessage(
    request: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void,
  ) {
    if (request.event === EVENTS["SELECTION"]) {
      let selection = window.getSelection() as Selection
      sendResponse(selection.toString())
    }
  }
}

new ContentScript()
