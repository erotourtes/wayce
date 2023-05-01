import pdfjsLib from "pdfjs-dist";

export default async function loadPdf(url: string): Promise<string> {
  const pdf = await pdfjsLib.getDocument(url).promise;
  const numOfpages = pdf.numPages;
  let text = "";

  for (let i = 1; i <= numOfpages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item: any) => item.str).join(" ");
  }

  return text;
}
