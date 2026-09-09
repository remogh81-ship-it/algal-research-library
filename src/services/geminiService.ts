const ENV_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const STORAGE_KEY = 'custom_gemini_api_key';
const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export function getStoredGeminiKey(): string {
  return localStorage.getItem(STORAGE_KEY) ?? '';
}

export function saveGeminiKey(key: string): void {
  const normalized = key.trim();
  if (normalized) localStorage.setItem(STORAGE_KEY, normalized);
  else localStorage.removeItem(STORAGE_KEY);
}

export function resolveGeminiKey(): string {
  return ENV_KEY?.trim() || getStoredGeminiKey();
}

export async function askGemini(prompt: string, signal?: AbortSignal): Promise<string> {
  const key = resolveGeminiKey();
  if (!key) throw new Error('GEMINI_API_KEY_REQUIRED');

  const response = await fetch(`${endpoint}?key=${encodeURIComponent(key)}`, {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Gemini request failed (${response.status}): ${detail}`);
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('').trim();
  if (!text) throw new Error('Gemini returned an empty response');
  return text;
}
