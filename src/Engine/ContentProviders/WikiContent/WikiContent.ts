import * as T from "../../../Utils/types.js";
import { logger } from "../../../Utils/Utils.js";

export default class WikiContent implements T.ContentProvider {
  constructor(private links: string[], private pagesLimit: number) {}

  private readonly baseUrl = "https://www.wikipedia.org";
  private visited: Set<string> = new Set();
  private content: [string, Promise<string>][] = [];

  async init() {
    // TODO: use async generator?
    let curLink = 0;
    while (this.pagesLimit > curLink && curLink < this.links.length) {
      const link = this.links[curLink++] as string;
      if (this.visited.has(link)) continue;
      this.visited.add(link);

      const html = await this.getContentOf(link).catch((err) => {
        logger(`Error reaching link ${link} ${err}`);
      });

      if (!html) continue;

      const links = this.getLinksOf(html);
      if (links) this.links.push(...links);

      this.content.push([link, Promise.resolve(html)]);
    }
  }

  async getPaths(): Promise<string[]> {
    return this.links.slice(0, this.pagesLimit);
  }

  async getContent() {
    if (!this.content.length) throw new Error("WikiContent not initialized");

    return this.content;
  }

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
}
