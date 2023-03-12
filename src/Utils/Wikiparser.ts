import fs from "node:fs";

type UrlParams = { [key: string]: string };
type Query = {
  pages: {
    [id: string]: {
      pageid: number;
      ns: number;
      title: string;
      revisions?: {
        slots: {
          main: {
            contentmodel: string;
            contentformat: string;
            "*": string;
          };
        };
      }[];
    };
  };
};

const applyParamsTo = (url: string, params: UrlParams) => {
  let newUrl = url + "?";
  Object.keys(params).forEach((key) => {
    newUrl += "&" + key + "=" + params[key];
  });

  return newUrl;
};

const getDocuments = async (count = 1) => {
  const baseUrl = "https://en.wikipedia.org/w/api.php";

  const params: UrlParams = {
    format: "json",
    action: "query",
    generator: "random",
    prop: "revisions",
    grnnamespace: "0",
    rvprop: "content",
    grnlimit: count.toString(),
    rvslots: "main",
  };

  const url = applyParamsTo(baseUrl, params);

  const response = await fetch(url)
    .then((response) => response.json())
    .catch((error) => {
      console.log(error);
    });

  const query = response.query as Query;
  const pages = query.pages;

  const documents: { content: string; title: string }[] = [];
  for (const id in pages) {
    const page = pages[id];
    if (!page.revisions) continue;

    const content = page.revisions[0].slots.main["*"];
    const title = page.title;

    documents.push({ content, title });
  }

  return documents;
};

const saveWikiContent = async (dirPath: fs.PathLike) => {
  const documents = await getDocuments(1000);
  const promises: Promise<void>[] = [];

  for (const { title, content } of documents) {
    const path = `${dirPath}${title}.txt`;
    const promise = fs.promises.writeFile(path, content);
    promises.push(promise);
  }

  return Promise.all(promises);
};

await saveWikiContent(`${process.cwd()}/src/WikiData/`);
