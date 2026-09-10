import { openDB } from 'idb';
import type { RawResource, Resource } from '../types/resource';
import { mapRawToResource } from '../types/resource';

const DB_NAME = 'algae-research-library';
const STORE_NAME = 'resources';
const CACHE_KEY = 'resources-30000-v1';

export type ResourceLoadProgress = {
  phase: 'cache' | 'download' | 'decompress' | 'parse';
  loaded?: number;
  total?: number;
};

const database = openDB(DB_NAME, 1, {
  upgrade(db) {
    db.createObjectStore(STORE_NAME);
  },
});

function toRawResource(value: unknown): RawResource | null {
  if (!value || typeof value !== 'object') return null;
  const record = value as Partial<RawResource> & Record<string, unknown>;
  const raw: RawResource = {
    i: record.i as number ?? record.id as number,
    t: record.t as string ?? record.title as string,
    ta: record.ta as string ?? record.title_ar as string,
    c: record.c as string ?? record.category as string,
    ca: record.ca as string ?? record.category_ar as string,
    a: record.a as string ?? record.authors as string,
    y: record.y as number ?? record.year as number,
    j: record.j as string ?? record.journal_publisher as string,
    d: record.d as string ?? record.doi as string,
    s: record.s as string ?? record.summary_ar as string,
    u: record.u as string ?? record.url as string,
    p: record.p as string ?? record.pdf_url as string,
  };
  return typeof raw.i === 'number' && typeof raw.t === 'string' &&
    typeof raw.ta === 'string' && typeof raw.c === 'string' &&
    typeof raw.ca === 'string' && typeof raw.a === 'string' &&
    typeof raw.y === 'number' && typeof raw.j === 'string' &&
    typeof raw.d === 'string' && typeof raw.s === 'string' &&
    typeof raw.u === 'string' && typeof raw.p === 'string' ? raw : null;
}

export async function loadResources(onProgress?: (progress: ResourceLoadProgress) => void): Promise<Resource[]> {
  onProgress?.({ phase: 'cache' });
  const db = await database;
  const cached = await db.get(STORE_NAME, CACHE_KEY) as Resource[] | undefined;
  if (cached?.length) return cached;

  const response = await fetch(`${import.meta.env.BASE_URL}resources_30000.json.gz`);
  if (!response.ok) throw new Error(`Unable to load resource database (${response.status})`);
  if (!response.body) throw new Error('Resource database response has no body');
  if (!('DecompressionStream' in globalThis)) throw new Error('This browser does not support native gzip decompression');

  const total = Number(response.headers.get('content-length')) || undefined;
  onProgress?.({ phase: 'download', loaded: 0, total });
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let loaded = 0;
  while (true) {
    const chunk = await reader.read();
    if (chunk.done) break;
    chunks.push(chunk.value);
    loaded += chunk.value.byteLength;
    onProgress?.({ phase: 'download', loaded, total });
  }

  onProgress?.({ phase: 'decompress' });
  const bytes = new Uint8Array(loaded);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  const compressed = new Blob([bytes.buffer as ArrayBuffer]).stream();
  const decompressed = compressed.pipeThrough(new DecompressionStream('gzip'));
  const text = await new Response(decompressed).text();
  onProgress?.({ phase: 'parse' });
  const parsed: unknown = JSON.parse(text);
  const rawResources = Array.isArray(parsed) ? parsed.map(toRawResource) : [];
  if (!rawResources.length || rawResources.some((resource) => resource === null)) {
    throw new Error('Resource database has an invalid format');
  }

  const resources = rawResources.map((resource) => mapRawToResource(resource as RawResource));
  await db.put(STORE_NAME, resources, CACHE_KEY);
  return resources;
}

export async function clearResourceCache(): Promise<void> {
  const db = await database;
  await db.delete(STORE_NAME, CACHE_KEY);
}
