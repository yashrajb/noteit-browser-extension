import { EVENTS } from "@app/constant"
import { ContentScript } from "./index"

describe("ContentScript", () => {
  let contentScript: ContentScript

  beforeEach(() => {
    jest.clearAllMocks()

    global.getSelection = jest.fn().mockReturnValue({
      toString: jest.fn().mockReturnValue("mocked selection"),
    })

    contentScript = new ContentScript()
  })

  it("should add onMessage listener on instantiation", () => {
    expect(chrome.runtime.onMessage.addListener).toHaveBeenCalledWith(
      contentScript.onMessage,
    )
  })

  it("should respond with the selected text when SELECTION event is received", () => {
    const request = { event: EVENTS["SELECTION"] }
    const sender = {} as chrome.runtime.MessageSender
    const sendResponse = jest.fn()

    contentScript.onMessage(request, sender, sendResponse)

    expect(global.getSelection).toHaveBeenCalled()
    expect(sendResponse).toHaveBeenCalledWith("mocked selection")
  })

  it("should not respond if event is not SELECTION", () => {
    const request = { event: "OTHER_EVENT" }
    const sender = {} as chrome.runtime.MessageSender
    const sendResponse = jest.fn()

    contentScript.onMessage(request, sender, sendResponse)

    expect(global.getSelection).not.toHaveBeenCalled()
    expect(sendResponse).not.toHaveBeenCalled()
  })

  it("should throw error if there is an error with getSelection", () => {
    global.getSelection = jest.fn(() => {
      throw new Error("Error")
    })

    const request = { event: EVENTS["SELECTION"] }
    const sender = {} as chrome.runtime.MessageSender
    const sendResponse = jest.fn()

    expect(() => {
      contentScript.onMessage(request, sender, sendResponse)
    }).toThrow("Error")

    expect(global.getSelection).toHaveBeenCalled()
    expect(sendResponse).not.toHaveBeenCalled()
  })
})
