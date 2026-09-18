import { openDB } from 'idb';
import type { RawResource, Resource } from '../types/resource';
import { mapResource } from '../types/resource';

const DB_NAME = 'algae-research-library';
const STORE_NAME = 'resources';
const SUBMISSIONS_STORE = 'submissions';
const CACHE_KEY = 'resources-library-v3-reclassified';

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

  if (!('DecompressionStream' in globalThis)) throw new Error('This browser does not support native gzip decompression');
  const loadGzipJson = async (path: string, progress?: (loaded: number, total?: number) => void): Promise<unknown[]> => {
    const rawBase = import.meta.env.BASE_URL || '/';
    const baseUrl = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const requestUrl = rawBase === './' ? `./${cleanPath}` : `${baseUrl}${cleanPath}`;
    const response = await fetch(requestUrl).catch(() => fetch(`/${cleanPath}`));
    if (!response.ok) throw new Error(`Unable to load resource database (${response.status})`);
    const contentType = response.headers.get('content-type')?.toLowerCase() ?? '';
    if (contentType.includes('text/html') || !response.body) throw new Error('Resource database URL returned an invalid response');
    const total = Number(response.headers.get('content-length')) || undefined;
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let loaded = 0;
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      chunks.push(chunk.value);
      loaded += chunk.value.byteLength;
      progress?.(loaded, total);
    }
    const bytes = new Uint8Array(loaded);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    let jsonText: string;
    if (bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b) {
      if (!('DecompressionStream' in globalThis)) throw new Error('This browser does not support native gzip decompression');
      const decompressed = new Blob([bytes.buffer as ArrayBuffer]).stream().pipeThrough(new DecompressionStream('gzip'));
      jsonText = await new Response(decompressed).text();
    } else {
      jsonText = new TextDecoder('utf-8').decode(bytes);
    }
    const parsed: unknown = JSON.parse(jsonText);
    if (!Array.isArray(parsed)) throw new Error('Resource database has an invalid format');
    return parsed;
  };
  onProgress?.({ phase: 'download', loaded: 0 });
  const [primary, journal] = await Promise.all([
    loadGzipJson('resources_30000.json.gz', (loaded, total) => onProgress?.({ phase: 'download', loaded, total })),
    loadGzipJson('data/egyptian_journal_phycology_classified.json.gz'),
  ]);
  onProgress?.({ phase: 'parse' });
  const resources = [
    ...primary.map(toRawResource).map((raw) => mapResource(raw)),
    ...journal.map((value, index) => {
      const raw = toRawResource(value);
      return mapResource({
        ...raw,
        id: 100000000 + index,
        issue: raw.i,
        i: undefined,
        pages: raw.p,
        p: undefined,
      }, 100000000 + index);
    }),
  ];
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

export async function saveSubmittedResourcesBatch(resources: Resource[]): Promise<void> {
  const db = await database;
  const tx = db.transaction(SUBMISSIONS_STORE, 'readwrite');
  await Promise.all([
    ...resources.map((res) => tx.store.put(res)),
    tx.done,
  ]);
}

export async function deleteSubmittedResource(id: number): Promise<void> {
  const db = await database;
  await db.delete(SUBMISSIONS_STORE, id);
}

