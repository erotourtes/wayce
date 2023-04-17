import PDFParser from "pdf2json";

export default class PDF {
  private pdfParser = new PDFParser({}, 1);
  private content = "";

  async load(url: string): Promise<string> {
    return new Promise((res, rej) => {
      this.pdfParser.on("pdfParser_dataError", (errData) =>
        rej(new Error(errData.parserError))
      );

      this.pdfParser.on("pdfParser_dataReady", () => {
        this.content = this.pdfParser.getRawTextContent();
        res(this.content);
      });

      this.pdfParser.loadPDF(url);
    });
  }

  getContent() {
    return this.content;
  }
}
