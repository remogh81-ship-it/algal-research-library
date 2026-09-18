const STORAGE_KEY = 'custom_gemini_api_key';

// Server-side proxy endpoint (Vercel Serverless Function)
const PROXY_ENDPOINT = '/api/gemini';

// Direct Gemini endpoint (fallback for local dev or when user provides own key)
const DIRECT_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export function getStoredGeminiKey(): string {
  return localStorage.getItem(STORAGE_KEY) ?? '';
}

export function saveGeminiKey(key: string): void {
  const normalized = key.trim();
  if (normalized) localStorage.setItem(STORAGE_KEY, normalized);
  else localStorage.removeItem(STORAGE_KEY);
}

export function resolveGeminiKey(): string {
  const envKey = (
    import.meta.env.VITE_API_KEY as string | undefined
  )?.trim() || (
    import.meta.env.VITE_GEMINI_API_KEY as string | undefined
  )?.trim();
  return envKey || getStoredGeminiKey();
}

export interface ChatMessagePayload {
  role: 'user' | 'model';
  parts: [{ text: string }];
}

/**
 * Primary entry point: tries the secure server proxy first (/api/gemini),
 * then falls back to a direct Gemini call if a client-side key exists.
 */
export async function askGeminiChat(
  messages: ChatMessagePayload[],
  systemInstruction?: string,
  signal?: AbortSignal
): Promise<string> {
  const bodyPayload: Record<string, any> = {
    contents: messages,
    generationConfig: {
      temperature: 0.25,
      topP: 0.95,
      maxOutputTokens: 8192,
    },
  };

  if (systemInstruction) {
    bodyPayload.systemInstruction = {
      parts: [{ text: systemInstruction }],
    };
  }

  // Strategy 1: Use server-side proxy (no API key needed on the client)
  try {
    const proxyResponse = await fetch(PROXY_ENDPOINT, {
      method: 'POST',
      signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyPayload),
    });

    // If proxy responded (even with an error status), parse it
    if (proxyResponse.ok) {
      const data = await proxyResponse.json();
      const text = data.candidates?.[0]?.content?.parts
        ?.map((part: { text?: string }) => part.text ?? '')
        .join('')
        .trim();
      if (text) return text;
    }

    // If proxy returned 500 (key not configured), fall through to direct
    const proxyError = await proxyResponse.json().catch(() => null);
    console.warn('Proxy returned error, trying direct fallback:', proxyError);
  } catch (proxyErr) {
    // Network error, proxy not available (e.g., local dev), fall through
    console.warn('Server proxy unavailable, trying direct Gemini call:', proxyErr);
  }

  // Strategy 2: Direct API call with client-side key (fallback)
  const clientKey = resolveGeminiKey();
  if (!clientKey) {
    throw new Error('GEMINI_API_KEY_REQUIRED');
  }

  const response = await fetch(`${DIRECT_ENDPOINT}?key=${encodeURIComponent(clientKey)}`, {
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
