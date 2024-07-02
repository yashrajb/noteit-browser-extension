import React, { useMemo, useState } from "react";
import LocalStorage from "@app/storage/index";
import exportNotesImg from "@app/assets/export-notes.svg";
import { IWorkerFIleExt } from "@app/worker/worker.types";

const WORKER_FILE_PATH = "../../worker/worker.ts";
const FILE_TYPES = {
  md: "text/markdown",
  txt: "text/plain",
};

const ExportNotesBtn = () => {
  const [disableBtn, setDisableBtn] = useState(false);
  const [toggleDropdown, setToggleDropdown] = useState(false);

  const onExport = async (
    e: React.MouseEvent,
    fileExtension: IWorkerFIleExt["fileExtension"]
  ) => {
    try {
      console.log("in export", fileExtension);

      if (disableBtn) {
        return;
      }

      var worker = new Worker(new URL(WORKER_FILE_PATH, import.meta.url));
      let data = await LocalStorage.get();
      setDisableBtn(true);
      setToggleDropdown(false);
      worker.postMessage({ data, fileExtension });

      worker.onmessage = function (e) {
        let { data } = e;
        const filename = `my-notes.${fileExtension}`;
        console.log("onMessage", filename);
        let blob = new Blob([data.content], {
          type: FILE_TYPES[fileExtension],
        });
        let url = URL.createObjectURL(blob);
        browser.downloads.download({
          url,
          filename,
        });
        setDisableBtn(false);
      };
    } catch (e) {
      console.log("Error in onExport function", e);
    }
  };

  const onToggle = () => {
    setToggleDropdown((prevState) => !prevState);
  };

  return (
    <details
      onClick={onToggle}
      className={`dropdown ${disableBtn ? "disableDropdown" : ""}`}
      open={toggleDropdown}
    >
      <summary
        onClick={onToggle}
        className={`button  ${disableBtn ? "disableDropdown" : "primary"} exportBtn`}
      >
        <span>Export Data As</span>{" "}
        <img src={exportNotesImg} alt="export data button" />
      </summary>

      <div className="card">
        <a className="option" onClick={(e) => onExport(e, "txt")}>
          Text (.txt)
        </a>
        <a className="option" onClick={(e) => onExport(e, "md")}>
          Markdown (.md)
        </a>
      </div>
    </details>
  );
};

export default ExportNotesBtn;
