import React, { useState } from "react";
import Autosuggest from "react-autosuggest";

export default function Page() {
  const items = [
    { name: "Bitcoin", popularity: 1 },
    { name: "Bitdollar", popularity: 5 },
    { name: "Bitcent", popularity: 15 },
    { name: "Bitpound", popularity: 10 },
  ];

  const getSuggestions = (value: string): any => {
    const itemsSorted = items.sort(function (a, b) {
      return b.popularity - a.popularity;
    });
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : itemsSorted.filter(
          (item) => item.name.toLowerCase().slice(0, inputLength) === inputValue
        );
  };

  const getSuggestionValue = (suggestion: any) => suggestion.name;

  // Use your imagination to render suggestions.
  const renderSuggestion = (suggestion: any) => <div>{suggestion.name}</div>;

  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const onChange = (
    event: React.FormEvent,
    { newValue }: { newValue: any }
  ) => {
    setValue(newValue);
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
        console.log(data);
      }}
      inputProps={{
        placeholder: "Type a programming language",
        value,
        onChange: onChange,
      }}
    />
  );
}
