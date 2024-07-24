import React from "react"
import ExportNotesBtn from "./ExportNotesBtn"
import "./index.scss"
import { SearchInput } from "./SearchInput"
import { MAIN_URL, links } from "@app/constant"

const Header = () => {
  return (
    <>
      <nav className="nav">
        <div className="nav-left">
          <span className="brand">note it</span>
        </div>
        <div className="nav-right">
          {links.map(({ title, href, imgSrc }) => {
            return (
              <a href={href} target="_blank">
                <img src={imgSrc} alt={title} />
              </a>
            )
          })}
          <a href={MAIN_URL} target="_blank">
            About
          </a>
        </div>
      </nav>
      <nav className="nav">
        <div className="nav-left">
          <SearchInput />
        </div>
        <div className="nav-right">
          <ExportNotesBtn />
        </div>
      </nav>
    </>
  )
}

export { Header }
