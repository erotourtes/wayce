import * as T from "../../../Utils/types.js";

export default class WikiContent implements T.ContentProvider {
  constructor(private links: string[], private pagesLimit: number) {}

  private readonly baseUrl = "https://www.wikipedia.org";
  private visited: Set<string> = new Set();

  private async getContentOf(link: string): Promise<string> {
    const response = await fetch(link);
    const html = await response.text();

    return html;
  }

  private getLinksOf(html: string) {
    const hrefs = html.match(/href="\/wiki\/[^"]+/g);
    return hrefs
      ?.filter((href) => !href.includes(":"))
      .map((href) => this.baseUrl + href.replace(/href="/, ""));
  }

  async getContent() {
    const res: [string, Promise<string>][] = [];

    let curLink = 0;
    while (this.pagesLimit > 0 && curLink < this.links.length) {
      const link = this.links[curLink++] as string;
      if (this.visited.has(link)) continue;
      this.visited.add(link);

      const html = await this.getContentOf(link);

      const links = this.getLinksOf(html);
      if (links) this.links.push(...links);

      res.push([link, Promise.resolve(html)]);
      this.pagesLimit--;
    }

    return res;
  }
}
