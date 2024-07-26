import { EVENTS } from "@app/constant"
import { BackGroundScript } from "./index"
import Notes from "@app/notes"

jest.mock("@app/notes")

const info = {
  menuItemId: EVENTS["SELECTION"],
  editable: false,
  pageUrl: "",
}
const tab = {
  id: 1,
  title: "Test Tab",
  url: "http://example.com",
  index: 0,
  pinned: false,
  highlighted: false,
  windowId: 0,
  active: false,
  incognito: false,
  selected: false,
  discarded: false,
  autoDiscardable: false,
  groupId: 0,
}

describe("BackGroundScript", () => {
  let backgroundScript: BackGroundScript

  beforeEach(() => {
    jest.clearAllMocks()

    backgroundScript = new BackGroundScript()
  })

  it("should add listeners on instantiation", () => {
    expect(chrome.runtime.onInstalled.addListener).toHaveBeenCalledWith(
      backgroundScript.onInstalled,
    )
    expect(chrome.contextMenus.onClicked.addListener).toHaveBeenCalledWith(
      backgroundScript.onClickedContext,
    )
  })

  describe("onInstalled", () => {
    it("should set local storage and create context menu on install", async () => {
      ;(chrome.storage.local.set as jest.Mock).mockResolvedValue(undefined)

      await backgroundScript.onInstalled({
        reason: chrome.runtime.OnInstalledReason.INSTALL,
      })

      expect(chrome.storage.local.set).toHaveBeenCalledWith({ data: {} })
      expect(chrome.contextMenus.create).toHaveBeenCalledWith({
        id: EVENTS["SELECTION"],
        title: "Note It",
        contexts: ["selection"],
      })
    })

    it("should handle errors in onInstalled", async () => {
      ;(chrome.storage.local.set as jest.Mock).mockRejectedValue("Error")

      await expect(
        backgroundScript.onInstalled({
          reason: chrome.runtime.OnInstalledReason.INSTALL,
        }),
      ).rejects.toThrow("Error")

      expect(chrome.contextMenus.create).not.toHaveBeenCalled()
    })

    it("should not set local storage if not installed", async () => {
      await backgroundScript.onInstalled({
        reason: chrome.runtime.OnInstalledReason.UPDATE,
      })

      expect(chrome.storage.local.set).not.toHaveBeenCalled()
      expect(chrome.contextMenus.create).toHaveBeenCalled()
    })
  })

  describe("onClickedContext", () => {
    it("should add a note when context menu item is clicked", async () => {
      chrome.tabs.sendMessage = jest.fn().mockResolvedValue("response")

      await backgroundScript.onClickedContext(info, tab)

      expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(tab.id, {
        event: info.menuItemId,
      })
      expect(Notes.add).toHaveBeenCalledWith({
        title: tab.title,
        content: "response",
        url: tab.url,
      })
    })

    it("should not add a note if tab is not available", async () => {
      await backgroundScript.onClickedContext(info)

      expect(chrome.tabs.sendMessage).not.toHaveBeenCalled()
      expect(Notes.add).not.toHaveBeenCalled()
    })

    it("should handle errors in onClickedContext", async () => {
      chrome.tabs.sendMessage = jest
        .fn()
        .mockRejectedValue(new Error("Mocked Error"))

      await expect(
        backgroundScript.onClickedContext(info, tab),
      ).rejects.toThrow("Mocked Error")

      expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(tab.id, {
        event: info.menuItemId,
      })
      expect(Notes.add).not.toHaveBeenCalled()
    })
  })
})
