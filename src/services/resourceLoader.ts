import { openDB } from 'idb';
import type { RawResource, Resource } from '../types/resource';
import { mapResource } from '../types/resource';

const DB_NAME = 'algae-research-library';
const STORE_NAME = 'resources';
const SUBMISSIONS_STORE = 'submissions';
const CACHE_KEY = 'resources-30000-v1';

export type ResourceLoadProgress = {
  phase: 'cache' | 'download' | 'decompress' | 'parse';
  loaded?: number;
  total?: number;
};

export const database = openDB(DB_NAME, 2, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
    if (!db.objectStoreNames.contains(SUBMISSIONS_STORE)) db.createObjectStore(SUBMISSIONS_STORE, { keyPath: 'id' });
  },
});

function toRawResource(value: unknown): RawResource {
  return value && typeof value === 'object' ? value as RawResource : {};
}

export async function loadResources(onProgress?: (progress: ResourceLoadProgress) => void): Promise<Resource[]> {
  onProgress?.({ phase: 'cache' });
  const db = await database;
  const cached = await db.get(STORE_NAME, CACHE_KEY) as Resource[] | undefined;
  if (cached?.length) return cached;

  const response = await fetch(`${import.meta.env.BASE_URL}resources_30000.json.gz`);
  if (!response.ok) throw new Error(`Unable to load resource database (${response.status})`);
  const contentType = response.headers.get('content-type')?.toLowerCase() ?? '';
  if (contentType.includes('text/html')) {
    throw new Error('Resource database URL returned HTML instead of a gzip file');
  }
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
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('Resource database contains invalid JSON');
  }
  if (!Array.isArray(parsed)) {
    throw new Error('Resource database has an invalid format');
  }

  const resources = parsed.map(toRawResource).map(mapResource);
  await db.put(STORE_NAME, resources, CACHE_KEY);
  return resources;
}

export async function clearResourceCache(): Promise<void> {
  const db = await database;
  await db.delete(STORE_NAME, CACHE_KEY);
}

export async function getSubmittedResources(): Promise<Resource[]> {
  const db = await database;
  return db.getAll(SUBMISSIONS_STORE);
}

export async function saveSubmittedResource(resource: Resource): Promise<void> {
  const db = await database;
  await db.put(SUBMISSIONS_STORE, resource);
}

export async function deleteSubmittedResource(id: number): Promise<void> {
  const db = await database;
  await db.delete(SUBMISSIONS_STORE, id);
}
