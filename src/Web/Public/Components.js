const ul = document.querySelector("ul");

let mainFrequency = undefined;
const relativeFrequency = (frequency) =>
  (frequency / mainFrequency * 100).toFixed(2);

export function addList(text, frequency, open) {
  if (mainFrequency === undefined) {
    mainFrequency = frequency;
  }

  const li = document.createElement("li");
  li.innerText = text;
  li.setAttribute("path-to-file", text);
  li.setAttribute("frequency", relativeFrequency(frequency));
  li.onclick = () => { open(text); };
  ul.appendChild(li);
}

export function removeAll() {
  mainFrequency = undefined;
  ul.innerHTML = "";
}
