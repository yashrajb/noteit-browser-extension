import React, { useEffect, useMemo, useState } from "react"
import ReactDOM from "react-dom/client"
import { Header } from "@app/components/Header"
import { Context, IContext } from "@app/store/Context"
import "chota/dist/chota.min.css"
import "./index.css"
import LocalStorage from "@app/storage"
import { NoteList } from "@app/components/NoteList"

const App = () => {
  const [notes, setNotes] = useState({})
  const [showClipboardMessage, setClipboardMessage] = useState("")
  const getLocalData = async function () {
    try {
      const data = await LocalStorage.get()
      setNotes(data || {})
    } catch (error) {
      console.error("Error getLocalData data:", error)
    }
  }

  useEffect(() => {
    getLocalData()

    LocalStorage.onChangeListener(getLocalData)

    return () => {
      LocalStorage.removeOnChangeListener(getLocalData)
    }
  }, [])

  return (
    <React.StrictMode>
      <Context.Provider
        value={{
          notes,
          setNotes,
          showClipboardMessage: showClipboardMessage,
          setClipboardMessage: setClipboardMessage,
        }}
      >
        <Header />
        <NoteList />
        {showClipboardMessage ? (
          <p id="copied-text">{showClipboardMessage}</p>
        ) : (
          ""
        )}
      </Context.Provider>
    </React.StrictMode>
  )
}

ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
  <App />,
)
