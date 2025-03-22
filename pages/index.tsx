import React, { useEffect, useState, useRef, useCallback } from "react";
import { makeRequest, storeSearchTerm } from "@/lib/SearchController";
import { Debouncer, isBlank } from "@/lib/Utils";
import { SearchResult, RequestData } from "@/lib/SearchController.d";
import Image from "next/image";

export default function Page() {
  const [searchString, setSearchString] = useState("");
  const [searchResults, setSearchResults] = useState<RequestData>(
    {} as RequestData
  );
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
    <section className="w-[1000px] max-w-full mx-auto py-20">
      <input className="border" type="text" onChange={onSearchStringChange} />
      <div className="flex">
        <div className="w-[400px]">
          <FilterPanel />
        </div>
        <div className="grow">
          {(searchResults?.results || []).map((result, i) => (
            <ResultBlock key={i} result={result} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FilterPanel() {
  return <>filter panel</>;
}

function ResultBlock({ result }: { result: SearchResult }) {
  return (
    <div className="bg-slate-100 border-b border-slate-300 p-4 flex items-start">
      {result?.logo && (
        <Image
          className="rounded-xl w-[50px]"
          src={result.logo}
          alt={`${result.display_name} logo`}
          width={100}
          height={100}
        />
      )}
      <div className="pl-4 grow flex flex-col gap-y-1">
        <div className="flex items-center">
          <h3 className="font-bold text-orange leading-tight">
            {result.display_name}
          </h3>
          <div className="grow pl-4"></div>
          <div className="bg-orange text-white font-bold rounded-md leading-none px-2 py-1">
            {result?.symbol && <div>{result.symbol}</div>}
          </div>
        </div>
        {result?.asset_categories && result.asset_categories.length > 0 && (
          <>
            <ul className="flex gap-1 flex-wrap">
              {(result?.asset_categories || []).map((cat, i) => (
                <li
                  key={i}
                  className="rounded-md bg-slate-200 leading-none px-2 py-1 text-xs"
                >
                  {cat}
                </li>
              ))}
            </ul>
          </>
        )}
        {result?.flagship_description_short && (
          <div className="text-sm italic">
            {result.flagship_description_short}
          </div>
        )}
        <div className="flex gap-2 flex-wrap text-sm">
          {result?.one_year_return && (
            <div>
              <strong>1YR</strong>{" "}
              {parseFloat(result.one_year_return).toFixed(2)}%
            </div>
          )}
          {result?.five_year_return && (
            <div>
              <strong>5YR</strong>{" "}
              {parseFloat(result.five_year_return).toFixed(2)}%
            </div>
          )}
          {result?.management_fee && (
            <div>
              <strong>FEE</strong> $
              {parseFloat(result.management_fee).toFixed(2)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
