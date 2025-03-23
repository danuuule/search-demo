import React, { useEffect, useState, useRef, useCallback } from "react";
import { makeRequest, storeSearchTerm } from "@/lib/SearchController";
import { Debouncer, isBlank } from "@/lib/Utils";
import {
  SearchResult,
  RequestData,
  RequestOptions,
} from "@/lib/SearchController.d";
import * as AvailableOptions from "@/lib/AvailableOptions";
import Image from "next/image";
import SearchBox from "@/components/SearchBox";
import { DatabaseRecord, getSearchTerms } from "@/lib/DatabaseController";
import SearchGlass from "@/components/svg/SearchGlass";

export default function Page({
  searchTerms: _searchTerms,
}: {
  searchTerms: Array<DatabaseRecord>;
}) {
  const [searchTerms, setSearchTerms] = useState(_searchTerms);
  const [searchString, setSearchString] = useState("");
  const _searchString = useRef("");
  const [searchResults, setSearchResults] = useState<RequestData>(
    {} as RequestData
  );
  const [category, setCategory] = useState(undefined);
  // const searchDebounce = useRef(new Debouncer(350));
  // const searchStoreDebounce = useRef(new Debouncer(2000));

  const storeSearch = useCallback(async (value: string) => {
    console.log("storing...", value);
    try {
      const r = await storeSearchTerm(value);
      setSearchTerms(r.searchTerms);
      console.log(r);
    } catch (e) {
      console.log(e);
    }
  }, []);

  const doSearch = useCallback(
    async (shouldStore: boolean = false, value: string = "") => {
      if (isBlank(value)) {
        value = searchString;
      } else {
        setSearchString(value);
      }

      if (isBlank(value)) {
        setSearchResults({} as RequestData);
        return;
      }
      if (value == _searchString.current) return;
      _searchString.current = value;
      console.log("searching...", value);
      try {
        const opts: RequestOptions = {};
        if (value) {
          opts["search_text"] = value;
        }
        if (category) {
          opts["asset_categories"] = [category];
        }

        const r = await makeRequest(opts);
        setSearchResults(r);

        if (shouldStore && r?.count) await storeSearch(value);
      } catch (e) {
        console.log(e);
      }
    },
    [category, searchString, storeSearch]
  );

  useEffect(() => {
    console.log("searchResults", searchResults);
  }, [searchResults]);

  useEffect(() => {
    console.log("category", category);
    // doSearch();
  }, [category]);

  useEffect(() => {
    if (isBlank(searchString)) {
      setSearchResults({} as RequestData);
      _searchString.current = "";
      return;
    }
  }, [searchString]);

  function onSuggestionSelected(value: string) {
    console.log("clicked", value);
    setSearchString(value.toLowerCase());
    doSearch(true);
  }

  function onSearchBoxChanged(value: string) {
    setSearchString(value.toLowerCase());
  }

  return (
    <section className="w-[1000px] max-w-full mx-auto py-20 px-4 md:px-8">
      <form
        className="flex gap-x-4"
        onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          doSearch(true);
        }}
      >
        <SearchBox
          searchString={searchString}
          setSearchString={setSearchString}
          searchTerms={searchTerms}
          onSuggestionSelected={onSuggestionSelected}
          onChange={onSearchBoxChanged}
        />
        <button
          type="submit"
          className="cursor-pointer bg-orange font-bold text-lg text-white px-8 h-[45px] rounded-md"
        >
          Search
        </button>
      </form>
      <div className="flex items-center gap-1 flex-wrap mt-2">
        <span className="text-sm italic text-slate-500">Try searching:</span>
        <ul className="flex flex-wrap gap-2">
          {searchTerms.slice(0, 5).map((item, i) => (
            <li
              key={i}
              onClick={() => doSearch(true, item.text)}
              className="bg-white border border-slate-300 rounded-full px-4 leading-none py-1 text-sm flex gap-x-1 text-slate-500 cursor-pointer"
            >
              {item.text}
              <SearchGlass className="w-[14px] h-[14px] fill-slate-500" />
            </li>
          ))}
        </ul>
      </div>
      {/* <input
        className="rounded-md bg-white border border-slate-300 w-full p-4 text-lg outline-0"
        type="text"
        onChange={onSearchStringChange}
        placeholder="Search..."
      /> */}
      <div className="mt-4"></div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-[400px] max-w-full">
          <FilterPanel category={category} setCategory={setCategory} />
        </div>
        <div className="grow bg-white rounded-md border border-slate-300">
          {(searchResults?.results || []).map((result, i) => (
            <ResultBlock key={i} result={result} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FilterPanel({
  category,
  setCategory,
}: {
  category: string | undefined;
  setCategory: any;
}) {
  return (
    <div className="w-full bg-white rounded-md border border-slate-300 p-4">
      <h2 className="strong font-bold text-xl">Refine</h2>
      <label>
        Category:{" "}
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
          }}
        >
          <option disabled selected>
            Select one
          </option>
          {AvailableOptions.asset_categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

function ResultBlock({ result }: { result: SearchResult }) {
  return (
    <div className="p-4 flex items-start border-b border-slate-300 last:border-b-0">
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

export async function getServerSideProps() {
  const searchTerms = await getSearchTerms();

  return { props: { searchTerms } };
}
