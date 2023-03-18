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

input.onkeyup = (e) => {
  if (e.key === "Enter" && input.value.length > 0) {
    search(input.value).then((res) => {
      for (const item of res) {
        const [ name, frequency ] = item;
        HTML.addList(name, frequency);
      }
    });
  }
};

const searchBtn = document.querySelector("#search-btn");

searchBtn.onclick = () => {
  if (input.value.length === 0) return;
  search(input.value).then((res) => {
    console.log(res);
  });
};
