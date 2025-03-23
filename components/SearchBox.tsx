import React, { useState } from "react";
import Autosuggest from "react-autosuggest";
import { DatabaseRecord } from "@/lib/DatabaseController";

export default function SearchBox({
  searchString,
  setSearchString,
  searchTerms,
  onSuggestionSelected,
  onChange,
}: {
  searchString: string;
  searchTerms: Array<DatabaseRecord>;
  onSuggestionSelected: (value: string) => void;
  onChange: (value: string) => void;
  setSearchString: (value: string) => void;
}) {
  const getSuggestions = (value: string): any => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : searchTerms.filter(
          (item) => item.text.toLowerCase().slice(0, inputLength) === inputValue
        );
  };

  const getSuggestionValue = (suggestion: any) => suggestion.text;

  // Use your imagination to render suggestions.
  const renderSuggestion = (suggestion: any) => <div>{suggestion.text}</div>;

  const [suggestions, setSuggestions] = useState([]);

  const _onChange = (
    event: React.FormEvent,
    { newValue }: { newValue: string }
  ) => {
    setSearchString(newValue);
    onChange(newValue);
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  const onSuggestionsFetchRequested = ({ value }: { value: string }) => {
    setSuggestions(getSuggestions(value));
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      onSuggestionSelected={(e, data) => {
        onSuggestionSelected(data.suggestionValue);
      }}
      inputProps={{
        placeholder: "Search...",
        value: searchString,
        onChange: _onChange,
      }}
    />
  );
}
