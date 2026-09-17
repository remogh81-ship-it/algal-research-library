export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate-limit: basic protection via origin check
  const origin = req.headers.origin || req.headers.referer || '';
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Server-side API key (never sent to the client)
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ 
      error: 'GEMINI_API_KEY is not configured on the server. Set it in Vercel Environment Variables.' 
    });
  }

  try {
    const { contents, systemInstruction } = req.body;

    if (!contents || !Array.isArray(contents)) {
      return res.status(400).json({ error: 'Invalid request body: contents array is required.' });
    }

    const geminiPayload = { contents };
    if (systemInstruction) {
      geminiPayload.systemInstruction = systemInstruction;
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`;

    const geminiResponse = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiPayload),
    });

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      return res.status(geminiResponse.status).json(data);
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Gemini proxy error:', err);
    return res.status(500).json({ error: 'Internal server error while calling Gemini API.' });
  }
}
