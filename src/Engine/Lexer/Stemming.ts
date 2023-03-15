// http://snowball.tartarus.org/algorithms/porter/stemmer.html

/*
The purpose of the stemming algorithm is
to reduce the inflected words down to their word stem

it is sufficient that related words map to the same stem.
*/

const vowels = ["a", "e", "i", "o", "u"];

const m = (word: string) => {
  let count = 0;
  for (let i = 0; i < word.length - 1; i++) {
    const cur = word[i];
    const next = word[i + 1];
    if (vowels.includes(cur) && !vowels.includes(next)) count++;
  }

  return count;
};

const isO = (word: string) => {
  const len = word.length;
  const isCVC =
    !vowels.includes(word[len - 1]) &&
    vowels.includes(word[len - 2]) &&
    !vowels.includes(word[len - 3]);
  const forbidden = ["w", "x", "y"];

  return isCVC && !forbidden.includes(word[len - 1]);
};

const vowelsCount = (word: string) => {
  let count = 0;
  for (let i = 0; i < word.length; i++) {
    if (vowels.includes(word[i])) count++;
  }

  return count;
};

const a1 = (word: string) => {
  if (word.endsWith("sses")) {
    return word.slice(0, -2);
  } else if (word.endsWith("ies")) {
    return word.slice(0, -2);
  } else if (word.endsWith("ss")) {
    return word;
  } else if (word.endsWith("s")) {
    return word.slice(0, -1);
  }

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
  if (word.endsWith("eed") && m(word) > 0) {
    return word.slice(0, -1);
  } else if (word.endsWith("ed") && vowelsCount(word) > 1) {
    return b2(word.slice(0, -2));
  } else if (word.endsWith("ing") && vowelsCount(word) > 1) {
    return b2(word.slice(0, -3));
  }

  return word;
};

const c1 = (word: string) => {
  if (word.endsWith("y") && vowelsCount(word) > 1) {
    return word.slice(0, -1) + "i";
  }

  return word;
};

const c2 = (word: string) => {
  const endings = {
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

  for (const key in endings) {
    if (word.endsWith(key) && m(word) > 0) {
      return word.slice(0, -key.length) + endings[key as keyof typeof endings];
    }
  }

  return word;
};

const c3 = (word: string) => {
  const endings = {
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

  for (const key in endings) {
    if (word.endsWith(key) && m(word) > 0) {
      return word.slice(0, -key.length) + endings[key as keyof typeof endings];
    }
  }

  return word;
};

const c4 = (word: string) => {
  const endings = {
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

  for (const key in endings) {
    if (word.endsWith(key) && m(word) > 1) {
      return word.slice(0, -key.length) + endings[key as keyof typeof endings];
    }
  }

  return word;
};

const a5 = (word: string) => {
  if (word.endsWith("e") && m(word) > 1) {
    return word.slice(0, -1);
  } else if (word.endsWith("e") && m(word) === 1 && isO(word)) {
    return word.slice(0, -1);
  }

  return word;
};

const b5 = (word: string) => {
  if (m(word) > 1 && word.endsWith("ll")) {
    return word.slice(0, -1);
  }

  return word;
};

export default function porterStemming(word: string) {
  let res = word;
  res = a1(res);
  res = b1(res);
  res = c1(res);
  res = c2(res);
  res = c3(res);
  res = c4(res);
  res = a5(res);
  res = b5(res);

  return res;
}
