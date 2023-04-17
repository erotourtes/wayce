declare module "pdf2json" {
  export default class PDFParser {
    constructor(obj: any, pdfVersion: number);
    on(event: string, callback: (data: any) => void): void;
    loadPDF(filePath: string): void;
    getAllFieldsTypes(): any;
    getRawTextContent(): string;
  }
}
