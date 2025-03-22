import React, { useEffect, useState, useRef, useCallback } from "react";
import { makeRequest, storeSearchTerm } from "@/lib/SearchController";
import { Debouncer, isBlank } from "@/lib/Utils";

export default function Page() {
  const [searchString, setSearchString] = useState("");
  const [searchResults, setSearchResults] = useState({});
  const searchDebounce = useRef(new Debouncer(350));
  const searchStoreDebounce = useRef(new Debouncer(2000));

  const doSearch = useCallback(async (value: string) => {
    console.log("searching...", value);
    try {
      const r = await makeRequest({ search_text: value });
      setSearchResults(r);
    } catch (e) {
      console.log(e);
    }
  }, []);

  const storeSearch = useCallback(async (value: string) => {
    console.log("storing...", value);
    try {
      const r = await storeSearchTerm(value);
      console.log(r);
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    console.log("searchResults", searchResults);
  }, [searchResults]);

  function onSearchStringChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.toLowerCase();
    setSearchString(value);
    if (isBlank(value)) return;

    searchDebounce.current.start(async () => {
      await doSearch(value);

      searchStoreDebounce.current.start(() => {
        storeSearch(value);
      });
    });
  }

  return (
    <section className="w-[1000px] mx-auto py-20">
      <input className="border" type="text" onChange={onSearchStringChange} />
    </section>
  );
}
