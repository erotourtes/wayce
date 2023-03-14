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

const search = async (query) => {
  const url = new URL("/api/search", "http://localhost:3000");
  url.searchParams.append("input", query);

  const res = await fetch(url.href, {
    method: "POST",
    mode: "same-origin",
  }).then((response) => response.json());

  return res;
};

const input = document.querySelector("#input");

input.onkeyup = (e) => {
  if (e.key === "Enter" && input.value.length > 0) {
    search(input.value).then((res) => {
      console.log(res);
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
