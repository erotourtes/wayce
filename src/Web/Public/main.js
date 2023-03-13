/* eslint-disable */
const search = async (query) => {
  const url = new URL("/api/search", "http://localhost:3000");
  url.searchParams.append("input", query);

  const res = await fetch(url.href, {
    method: "POST",
    mode: "same-origin",
  }).then((response) => response.json());

  return res;
};

search("I want to know everyting").then((res) => {
  console.log(res);
});
