import React, { ChangeEvent } from "react";
import { useStore } from "@app/hooks/useStore";
import LocalStorage from "@app/storage";


const DEBOUNCE_TIMEOUT = 1500;

const SearchInput = () => {
  const { notes, setNotes } = useStore();
  let timeTimeout: ReturnType<typeof setTimeout> | null = null;

  const onInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    timeTimeout ? clearTimeout(timeTimeout) : "";
    const pattern = e?.target?.value?.toLowerCase();
    let data = await LocalStorage.get();
    if (!pattern) {
      setNotes(data)
      return;
    }

    timeTimeout = setTimeout(async () => {
      const newNotes = Object.assign({}, data);
      for (let key in newNotes) {
        if (!key.toLowerCase().includes(pattern)) {
          delete newNotes[key];
        }
      }

      setNotes(newNotes);
    }, DEBOUNCE_TIMEOUT);
  };

  return (
    <input
      onChange={onInputChange}
      autoComplete="off"
      id="search"
      type="text"
      placeholder="search title..."
    />
  );
};

export { SearchInput };
