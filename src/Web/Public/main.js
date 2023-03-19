/* eslint-disable */

// const searchDebounce = ((delay) => {
//   let canSearch = true;
//   let timeout;
//
//   const debounce = (value) => {
//     canSearch = false;
//     if (timeout) clearTimeout(timeout);
//     timeout = setTimeout(() => {
//       console.log("done");
//       canSearch = true;
//     }, delay);
//   };
//
//   return debounce;
// })(500);
// let canSearch = true;

import * as HTML from "./Components.js";

const open = async (file) => {
  const url = new URL("/api/open", "http://localhost:3000");
  url.searchParams.append("path", file);

  const res = await fetch(url.href, {
    method: "PATCH",
    mode: "same-origin",
  });

  return "done";
}

const search = async (query) => {
  HTML.removeAll();

  const url = new URL("/api/search", "http://localhost:3000");
  url.searchParams.append("input", query);
  url.searchParams.append("limit", 40);

  const res = await fetch(url.href, {
    method: "POST",
    mode: "same-origin",
  }).then((response) => response.json());

  return JSON.parse(res);
};

const input = document.querySelector("#input");

const searchHandler = () => {
  if (input.value.length === 0) return;

  search(input.value).then((res) => {
    for (const item of res) {
      const [name, frequency] = item;
      HTML.addList(name, frequency, open);
    }
  });
};

input.onkeyup = (e) => {
  if (e.key === "Enter" && input.value.length > 0) {
    searchHandler();
  }
};

const searchBtn = document.querySelector("#search-btn");

searchBtn.onclick = searchHandler;
