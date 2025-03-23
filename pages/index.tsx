import React, { useEffect, useState, useRef, useCallback } from "react";
import Head from "next/head";
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
import ChevronDown from "@/components/svg/ChevronDown";
import Refresh from "@/components/svg/Refresh";

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
  const [filters, setFilters] = useState({});
  const limit = 5;
  const [paging, setPaging] = useState({ page: 1, count: 0 });
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
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

  async function doSearch(
    shouldStore: boolean = false,
    value: any = {},
    forceRefresh: boolean = false,
    appendResults: boolean = false
  ) {
    if (loading) return;

    if (!appendResults) {
      setPaging({ page: 1, count: 0 });
      setSearchResults({} as RequestData);
    }
    if (!value?.searchString) {
      value = { ...value, searchString };
    }
    if (!value?.paging) {
      value = { ...value, paging };
    }
    value.filters = { ...filters, ...(value?.filters || {}) };
    if (value?.clearFilters) {
      value.filters = {};
      setFilters({});
    }

    if (isBlank(value.searchString)) {
      setSearchResults({} as RequestData);
      return;
    }
    if (!forceRefresh && value.searchString == _searchString.current) return;
    setLoading(true);

    _searchString.current = value.searchString;
    console.log("searching...", value.searchString);
    try {
      setShowResults(true);
      const opts: RequestOptions = {
        from: value.paging?.page || 1,
        size: limit,
      };
      if (value.searchString) {
        opts["search_text"] = value.searchString;
      }

      Object.keys(value.filters).forEach((key) => {
        console.log(value.filters);
        if (!isBlank(value.filters[key]?.value)) {
          //@ts-ignore
          opts[key] = value.filters[key].value;
        }
      });

      const r = await makeRequest(opts);
      if (appendResults) {
        setSearchResults((s: any) => {
          return { ...s, results: [...s.results, ...r.results] };
        });
      } else {
        setSearchResults(r);
      }
      setPaging((s: any) => {
        return { ...s, count: r.count };
      });

      if (shouldStore && r?.count && !isBlank(value?.searchString))
        await storeSearch(value.searchString);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  }

  useEffect(() => {
    console.log("searchResults", searchResults);
  }, [searchResults]);

  useEffect(() => {
    if (isBlank(searchString)) {
      setSearchResults({} as RequestData);
      _searchString.current = "";
      setPaging({ page: 1, count: 0 });
      setShowResults(false);
      return;
    }
  }, [searchString]);

  function onSuggestionSelected(value: string) {
    setSearchString(value.toLowerCase());
    doSearch(true, { searchString: value });
  }

  function onSearchBoxChanged(value: string) {
    setSearchString(value.toLowerCase());
  }

  async function updateSearch(value: any = {}) {
    await doSearch(false, value, true);
  }

  async function nextPage() {
    const newValue = { ...paging, page: paging.page + 1 };
    await doSearch(false, { paging: newValue }, true, true);
    setPaging(() => {
      return newValue;
    });
  }

  return (
    <>
      {" "}
      <Head>
        <title>Betashares search</title>
      </Head>
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
                onClick={() => {
                  setSearchString(item.text);
                  doSearch(true, { searchString: item.text });
                }}
                className="bg-white border border-slate-300 rounded-full px-4 leading-none py-1 text-sm flex gap-x-1 text-slate-500 cursor-pointer"
              >
                {item.text}
                <SearchGlass className="w-[14px] h-[14px] fill-slate-500" />
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4"></div>
        <div
          className={`flex flex-col md:flex-row gap-4 ${
            !showResults ? "hidden" : ""
          }`}
        >
          <div className="w-full md:w-[400px] shrink-0 max-w-full">
            <FilterPanel
              filters={filters}
              setFilters={setFilters}
              updateSearch={updateSearch}
            />
          </div>
          <div className="grow bg-white rounded-md border border-slate-300">
            {(searchResults?.results || []).map((result, i) => (
              <ResultBlock key={i} result={result} />
            ))}
            {loading && (
              <div className="flex items-center justify-center p-4">
                <Refresh className="animate-spin" />
              </div>
            )}
            <div className="p-4 flex flex-col items-center gap-2">
              {paging.count > 0 ? (
                <>
                  <span className="italic">
                    Showing{" "}
                    {paging.page * limit >= paging.count
                      ? paging.count
                      : paging.page * limit}{" "}
                    out of {paging.count} results
                  </span>
                  <button
                    className="bg-black rounded-md px-4 py-2 text-white disabled:bg-slate-300 cursor-pointer disabled:cursor-not-allowed"
                    disabled={paging.page * limit >= paging.count}
                    onClick={nextPage}
                  >
                    Load more
                  </button>
                </>
              ) : (
                <>
                  {!loading && (
                    <span className="italic">
                      No results found, please try another search.
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function FilterPanel({
  filters,
  setFilters,
  updateSearch,
}: {
  filters: any;
  setFilters: any;
  updateSearch: any;
}) {
  function applyFilter(
    key: string,
    value: string | Array<string> | undefined,
    isArray: boolean = false
  ) {
    const newValue = { valueKey: value, value: isArray ? [value] : value };
    setFilters((s: any) => {
      return {
        ...s,
        [key]: newValue,
      };
    });
    updateSearch({ filters: { [key]: newValue } });
  }
  function clearFilters() {
    updateSearch({ clearFilters: true });
  }

  const filterList = [
    {
      label: "Order By",
      key: "order_by",
      isArrayValue: false,
      valueMap: {
        "one_year_return.desc": "1 year return (High - Low)",
        "one_year_return.asc": "1 year return (Low - High)",
        "five_year_return.desc": "5 year return (High - Low)",
        "five_year_return.asc": "5 year return (Low - High)",
      },
    },
    {
      label: "Kind",
      key: "kind",
      isArrayValue: true,
      valueMap: { etf: "ETF", equity: "Equity" },
    },
    { label: "Category", key: "asset_categories", isArrayValue: true },
    {
      label: "Investment Suitability",
      key: "investment_suitability",
      isArrayValue: true,
    },
    {
      label: "Management Approach",
      key: "management_approach",
      isArrayValue: true,
    },
    {
      label: "Dividend Frequency",
      key: "dividend_frequency",
      isArrayValue: true,
    },
  ];

  return (
    <div className="w-full bg-white rounded-md border border-slate-300 p-4">
      <div className="flex justify-between">
        <h2 className="strong font-bold text-xl">Refine</h2>
        <div
          className={`border border-slate-300 py-0.5 px-1 rounded-md cursor-pointer`}
          onClick={clearFilters}
        >
          Clear all
        </div>
      </div>
      <div className="pt-2"></div>
      {filterList.map((f, i) => (
        <label key={i} className="text-sm block mb-2">
          <div className="flex items-end mb-1">
            <span className="block leading-none">{f.label}</span>
            <div className="grow"></div>
            <div
              className={`border border-slate-300 py-0.5 px-1 rounded-md cursor-pointer ${
                !filters?.[f.key]?.value ? "hidden" : ""
              }`}
              onClick={() => applyFilter(f.key, "")}
            >
              Clear
            </div>
          </div>
          <SelectInput
            value={filters?.[f.key]?.valueKey || ""}
            onChange={(value: string) => {
              applyFilter(f.key, value, f.isArrayValue);
            }}
            //@ts-ignore
            options={AvailableOptions?.[f.key]}
            valueMap={f?.valueMap}
          />
        </label>
      ))}
    </div>
  );
}

function SelectInput({
  value,
  options,
  onChange,
  valueMap,
}: {
  value: string;
  options: any;
  onChange: any;
  valueMap: any;
}) {
  return (
    <div className="relative border border-slate-300 rounded-md">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full bg-transparent pr-4 pl-2 h-[40px] outline-0"
      >
        <option value="" disabled>
          Select one
        </option>
        {options.map((opt: string, i: number) => (
          <option key={i} value={opt}>
            {valueMap ? valueMap?.[opt] : opt}
          </option>
        ))}
      </select>
      <ChevronDown className="w-[16px] h-full absolute top-0 right-2" />
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
