/*

explanation:
http://snowball.tartarus.org/algorithms/porter/stemmer.html

The purpose of the stemming algorithm is
to reduce the inflected words down to their word stem

it is sufficient that related words map to the same stem.

TODO refactor
*/

const vowels = ["a", "e", "i", "o", "u"];

// equals to m in the explanation
const m = (word: string) => {
  let count = 0;
  for (let i = 0; i < word.length - 1; i++) {
    const cur = word[i];
    const next = word[i + 1];
    if (vowels.includes(cur) && !vowels.includes(next)) count++;
  }

  return count;
};

// equals to *o in the explanation
const isO = (word: string) => {
  const len = word.length;
  // consonant-vowel-consonant
  const isCVC =
    !vowels.includes(word[len - 1]) &&
    vowels.includes(word[len - 2]) &&
    !vowels.includes(word[len - 3]);
  const forbidden = ["w", "x", "y"];

  return isCVC && !forbidden.includes(word[len - 1]);
};

// TOASK
const vowelsOf = (word: string) =>
  word.split("").filter((ch) => vowels.includes(ch)).length;

const a1 = (word: string) => {
  if (word.endsWith("sses")) return word.slice(0, -2);
  if (word.endsWith("ies")) return word.slice(0, -2);
  if (word.endsWith("ss")) return word;
  if (word.endsWith("s")) return word.slice(0, -1);

  return word;
};

const b2 = (word: string) => {
  if (word.endsWith("at") || word.endsWith("bl") || word.endsWith("iz"))
    return word + "e";

  const last = word[word.length - 1];
  const preLast = word[word.length - 2];
  const forbidden = ["l", "s", "z"];
  if (last === preLast && !forbidden.includes(last)) return word.slice(0, -1);

  if (isO(word) && m(word) === 1) return word + "e";

  return word;
};

const b1 = (word: string) => {
  if (word.endsWith("eed") && m(word) > 0) return word.slice(0, -1);
  if (word.endsWith("ed") && vowelsOf(word) > 1) return b2(word.slice(0, -2));
  if (word.endsWith("ing") && vowelsOf(word) > 1) return b2(word.slice(0, -3));

  return word;
};

const c1 = (word: string) => {
  if (word.endsWith("y") && vowelsOf(word) > 1) return word.slice(0, -1) + "i";

  return word;
};

const endingsC2 = {
  ational: "ate",
  tional: "tion",
  enci: "ence",
  anci: "ance",
  izer: "ize",
  iser: "ise", // British
  abli: "able",
  alli: "al",
  entli: "ent",
  eli: "e",
  ousli: "ous",
  ization: "ize",
  isation: "ise", // British
  ation: "ate",
  ator: "ate",
  alism: "al",
  iveness: "ive",
  fulness: "ful",
  ousness: "ous",
  aliti: "al",
  iviti: "ive",
  biliti: "ble",
};

const c2 = (word: string) => {
  const endings = endingsC2;
  const measure = m(word);

  for (const key in endings)
    if (word.endsWith(key) && measure > 0)
      return word.slice(0, -key.length) + endings[key as keyof typeof endings];

  return word;
};

const endingsC3 = {
  icate: "ic",
  ative: "",
  alize: "al",
  alise: "al", // british
  iciti: "ic",
  ical: "ic",
  icalli: "", // carefully -> carefulli -> care
  ful: "",
  fulli: "", // carefully -> carefulli -> care
  ness: "",
  less: "",
  ist: "",
};

const c3 = (word: string) => {
  const endings = endingsC3;
  const measure = m(word);

  for (const key in endings)
    if (word.endsWith(key) && measure > 0)
      return word.slice(0, -key.length) + endings[key as keyof typeof endings];

  return word;
};

const endingsC4 = {
  al: "",
  ance: "",
  ence: "",
  er: "e", // driver -> drive
  ic: "",
  able: "",
  ible: "",
  ant: "",
  ement: "",
  ment: "",
  ent: "",
  sion: "s",
  tion: "t",
  ou: "",
  ism: "",
  ate: "",
  iti: "",
  ous: "",
  ive: "",
  ize: "",
  ise: "", // british
};

const c4 = (word: string) => {
  const endings = endingsC4;
  const measure = m(word);

  for (const key in endings)
    if (word.endsWith(key) && measure > 1)
      return word.slice(0, -key.length) + endings[key as keyof typeof endings];

  return word;
};

const a5 = (word: string) => {
  if (word.endsWith("e") && m(word) > 1) return word.slice(0, -1);
  if (word.endsWith("e") && m(word) === 1 && isO(word))
    return word.slice(0, -1);

  return word;
};

const b5 = (word: string) => {
  if (m(word) > 1 && word.endsWith("ll")) return word.slice(0, -1);

  return word;
};

const pipe = (...fns: ((word: string) => string)[]) => (word: string) =>
  fns.reduce((acc, fn) => fn(acc), word);

export default function porterStemming(word: string) {
  const piped = pipe(a1, b1, c1, c2, c3, c4, a5, b5);

  return piped(word);
}
