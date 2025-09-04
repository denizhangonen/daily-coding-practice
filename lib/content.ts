// lib/content.ts
import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

export interface ChallengeMeta {
  title: string;
  slug: string;
  date: string; // YYYY-MM-DD
  platform?: string;
  difficulty?: string;
  language?: string;
  tags?: string[];
  link?: string;
  _filepath: string; // internal use only
}

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'content');

async function getAllMdxPaths(): Promise<string[]> {
  const entries = await fs.readdir(CONTENT_DIR, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const full = path.join(CONTENT_DIR, entry.name);
    if (entry.isDirectory()) {
      const inner = await fs.readdir(full);
      for (const f of inner) {
        if (f.endsWith('.mdx') || f.endsWith('.md')) {
          files.push(path.join(full, f));
        }
      }
    } else if (
      entry.isFile() &&
      (entry.name.endsWith('.mdx') || entry.name.endsWith('.md'))
    ) {
      files.push(full);
    }
  }
  return files;
}

function inferPlatformFromPath(fp: string): string | undefined {
  const parts = fp.split(path.sep);
  const idx = parts.lastIndexOf('content');
  return idx >= 0 && parts[idx + 1] ? parts[idx + 1] : undefined;
}

export async function getAllChallenges(): Promise<ChallengeMeta[]> {
  const filepaths = await getAllMdxPaths();
  const metas: ChallengeMeta[] = [];

  for (const fp of filepaths) {
    const raw = await fs.readFile(fp, 'utf8');
    const { data } = matter(raw);

    // pick only allowed fields
    const meta: ChallengeMeta = {
      title: String(data.title),
      slug: String(data.slug),
      date: String(data.date),
      platform: (data.platform as string) ?? inferPlatformFromPath(fp),
      difficulty: data.difficulty as string | undefined,
      language: data.language as string | undefined,
      tags: Array.isArray(data.tags) ? (data.tags as string[]) : undefined,
      link: data.link as string | undefined,
      _filepath: fp,
    };

    metas.push(meta);
  }

  metas.sort((a, b) => b.date.localeCompare(a.date));
  return metas;
}

export async function getChallengeBySlug(
  slug: string
): Promise<{ content: string; meta: ChallengeMeta } | null> {
  const filepaths = await getAllMdxPaths();

  for (const fp of filepaths) {
    const raw = await fs.readFile(fp, 'utf8');
    const { content, data } = matter(raw);

    if (data.slug === slug) {
      const meta: ChallengeMeta = {
        title: String(data.title),
        slug: String(data.slug),
        date: String(data.date),
        platform: (data.platform as string) ?? inferPlatformFromPath(fp),
        difficulty: data.difficulty as string | undefined,
        language: data.language as string | undefined,
        tags: Array.isArray(data.tags) ? (data.tags as string[]) : undefined,
        link: data.link as string | undefined,
        _filepath: fp,
      };
      return { content, meta };
    }
  }
  return null;
}

