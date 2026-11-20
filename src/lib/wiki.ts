/**
 * Read side of the wiki data. Everything here is a pure function of
 * src/data/wiki.json, which scripts/fetch-wiki.mjs produces.
 */
import { marked } from "marked";
import wikiData from "../data/wiki.json";

export interface WikiDocument {
  slug: string;
  title: string;
  depth: number;
  urlId: string;
  wikiUrl: string;
  revision: number | null;
  status: string;
  owner: string;
  reviewed: string;
  images: number;
  markdown: string;
}

export interface WikiCollection {
  slug: string;
  share: string;
  brand: "society" | "education" | "democracy" | "economy";
  title: string;
  wikiTitle: string;
  wikiUrl: string;
  documents: WikiDocument[];
}

export const collections = wikiData.collections as WikiCollection[];

export const getCollection = (slug: string) => collections.find((c) => c.slug === slug);

marked.setOptions({ gfm: true, breaks: false });

export const renderMarkdown = (markdown: string) => marked.parse(markdown) as string;

/**
 * The lead is the first real paragraph, used for the page intro and the meta
 * description. Headings, images and tables are skipped so the lead is always prose.
 */
export function leadOf(markdown: string, limit = 240): string {
  const paragraph = markdown
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .find((block) => block && !/^[#>|!\-*\d]/.test(block));

  if (!paragraph) return "";
  const text = paragraph.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[*_`]/g, "");
  return text.length > limit ? `${text.slice(0, limit).trimEnd()}…` : text;
}

/** Surface class per brand, so a mission page carries its own colour. */
export const brandSurface = {
  society: "bg-paper",
  education: "bg-surface-education",
  democracy: "bg-surface-democracy",
  economy: "bg-surface-economy",
} as const;

export const brandText = {
  society: "text-society",
  education: "text-education",
  democracy: "text-democracy",
  economy: "text-economy",
} as const;
