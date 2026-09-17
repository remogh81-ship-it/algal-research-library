const ENV_KEY = (
  import.meta.env.VITE_API_KEY as string | undefined
)?.trim() || (
  import.meta.env.VITE_GEMINI_API_KEY as string | undefined
)?.trim();
const STORAGE_KEY = 'custom_gemini_api_key';
const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

if (!ENV_KEY) {
  console.warn('Gemini API environment variable is missing. Configure VITE_API_KEY in .env.local for development or set custom key.');
}

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

export interface ChatMessagePayload {
  role: 'user' | 'model';
  parts: [{ text: string }];
}

export async function askGeminiChat(
  messages: ChatMessagePayload[],
  systemInstruction?: string,
  signal?: AbortSignal
): Promise<string> {
  const key = resolveGeminiKey();
  if (!key) throw new Error('GEMINI_API_KEY_REQUIRED');

  const bodyPayload: Record<string, any> = {
    contents: messages,
  };

  if (systemInstruction) {
    bodyPayload.systemInstruction = {
      parts: [{ text: systemInstruction }],
    };
  }

  const response = await fetch(`${endpoint}?key=${encodeURIComponent(key)}`, {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bodyPayload),
  });

  if (response.status === 401 || response.status === 403) {
    throw new Error('GEMINI_API_KEY_UNAUTHORIZED');
  }
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

export async function askGemini(prompt: string, signal?: AbortSignal, systemInstruction?: string): Promise<string> {
  return askGeminiChat([{ role: 'user', parts: [{ text: prompt }] }], systemInstruction, signal);
}

