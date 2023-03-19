const ul = document.querySelector("ul");

export function addList(text, frequency, open) {
  const li = document.createElement("li");
  li.innerText = text;
  li.setAttribute("path-to-file", text);
  li.onclick = () => { open(text); };
  ul.appendChild(li);
}

export function removeAll() {
  ul.innerHTML = "";
}
