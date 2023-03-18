const ul = document.querySelector("ul");

export function addList(text) {
  const li = document.createElement("li");
  li.innerText = text;
  ul.appendChild(li);
}

export function removeAll() {
  ul.innerHTML = "";
}
