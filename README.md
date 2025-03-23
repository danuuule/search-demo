# Search Demo
> Built by Daniel Gray for betashares coding test 2025

## Getting started
1. Clone the repository `git clone https://github.com/danuuule/search-demo.git`
2. Install dependencies `npm install`
3. Run the application `npm run dev`
4. Open application in your browser `http://localhost:3000/`
5. Try searching for `betashares`

## Structure
This application is built ontop of next.js. This framework is great for building fullstack react applications and offers server side rendering where needed.

**The most interesting place to start** is `./pages/index.tsx`. This is the core of the application.

- `./components` - contains some components used in the application as well as svg icon components. Some of the components in the page could be moved here.
- `./lib` - contains services and utility functions (interfacing with search api and local json db)
- `./pages` - contains the routes that are accessible via the browser (currently just `index.tsx`)
- `./pages/api` - contains api endpoints
- `./styles/globals.css` - includes tailwind and some styles for the autosuggest component

## Features
- **Autosuggest** - when typing in the search field: presents relevant options that have been searched before, ranked by popularity (amount of times searched).
  - The library `react-autosuggest` was leveraged for this.
  - Integrated `lowdb` to manage a local json database file `db.json`. Terms searched for (that generate results) are stored in here. If the search term already exists in the db the popularity is increased.
- **Quick search terms** - show 5 most popular search terms from the db
- **Refinements panel** (filters) - refine the search results with additional filters. There are more that could be put here.
- **Search results** - Shows a snapshot of relevant data from the search results. This could be extended to click on the result and show a more detail.
- **Pagination** - Shows 5 search results at a time (this would be increased in production). There is  a button to load more which calls the search api again. Pagination is important to make sure the server and client are not being overloaded.
- **TypeScript** - Have used TypeScript to make sure key variables have the correct data types / structures. My TypeScript could be better implemented with more time but hopefully you can get the idea and see the structures I have tried to put in place.