// Remember to set type: module in package.json or use .mjs extension
import path from "path";

import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

export interface DatabaseRecord {
  text: string;
  popularity: number;
}

export interface Database {
  searchTerms: Array<DatabaseRecord>;
}

const file = path.join(process.cwd(), "db.json");

// Configure lowdb to write data to JSON file
const adapter = new JSONFile<Database>(file);
const defaultData = { searchTerms: [] };
const db = new Low(adapter, defaultData);

export async function addSearchTerm(value: string) {
  await db.read();
  const { searchTerms } = db.data;

  let item = searchTerms.find((item) => item.text == value);
  if (item) {
    item.popularity = item.popularity + 1;
  } else {
    item = { text: value, popularity: 1 };
    searchTerms.push(item);
  }
  await db.write();
  return item;
}

export async function getSearchTerms() {
  await db.read();
  const { searchTerms } = db.data;
  return searchTerms.sort(function (a, b) {
    return b.popularity - a.popularity;
  });
}
