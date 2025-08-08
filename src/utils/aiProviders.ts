export type Provider = 'gemini' | 'groq' | 'openrouter' | 'ollama';

export function getStoredKey(provider: Provider): string | null {
  if (typeof localStorage === 'undefined') return null;
  const map: Record<Provider, string> = {
    gemini: 'gemini_api_key',
    groq: 'groq_api_key',
    openrouter: 'openrouter_api_key',
    ollama: 'ollama_api_key', // optional; commonly not required
  };
  return localStorage.getItem(map[provider]);
}

// ---- Ollama settings (base URL + model) ----
const OLLAMA_BASE_KEY = 'ollama_base_url';
const OLLAMA_MODEL_KEY = 'ollama_model';

export function getOllamaBase(): string {
  if (typeof localStorage === 'undefined') return 'http://localhost:11434';
  return localStorage.getItem(OLLAMA_BASE_KEY) || 'http://localhost:11434';
}

export function setOllamaBase(url: string) {
  if (typeof localStorage === 'undefined') return;
  const v = (url || '').trim() || 'http://localhost:11434';
  localStorage.setItem(OLLAMA_BASE_KEY, v);
}

export function getOllamaModel(): string {
  if (typeof localStorage === 'undefined') return '';
  return localStorage.getItem(OLLAMA_MODEL_KEY) || '';
}

export function setOllamaModel(model: string) {
  if (typeof localStorage === 'undefined') return;
  const v = (model || '').trim();
  localStorage.setItem(OLLAMA_MODEL_KEY, v);
}

/**
 * Fetch list of installed Ollama models from the target base URL.
 * Falls back to empty list on error.
 */
export async function fetchOllamaModels(baseUrl?: string, apiKey?: string): Promise<string[]> {
  try {
    const base = (baseUrl || getOllamaBase()).replace(/\/$/, '');
    const endpoint = `${base}/api/tags`;
    const headers: Record<string, string> = {};
    if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;
    const res = await fetch(endpoint, { method: 'GET', headers });
    if (!res.ok) throw new Error(`Bad status ${res.status}`);
    const data = await res.json();
    const models = Array.isArray(data?.models) ? data.models : [];
    return models
      .map((m: any) => (typeof m?.name === 'string' ? m.name : ''))
      .filter((s: string) => !!s);
  } catch {
    return [];
  }
}

export async function callProviderStream(params: {
  provider: Provider;
  apiKey: string;
  prompt: string;
  system?: string;
  onToken: (t: string) => void;
  baseUrl?: string; // ollama only
  model?: string; // ollama only
}): Promise<void> {
  const { provider, apiKey, prompt, system, onToken } = params;
  if (provider !== 'ollama' && !apiKey) throw new Error('Missing API key for selected provider.');

  if (provider === 'gemini') {
    // Gemini browser streaming is not standardized here; fall back to non-streaming
    const full = await callProvider({ provider, apiKey, prompt, system });
    onToken(full);
    return;
  }

  if (provider === 'ollama') {
    const base = (params.baseUrl || getOllamaBase()).replace(/\/$/, '');
    const model = (params.model ?? getOllamaModel()).trim();
    if (!model) throw new Error('No Ollama model configured');
    const endpoint = `${base}/api/chat`;
    const body = {
      model,
      messages: [
        ...(system ? [{ role: 'system', content: system }] : []),
        { role: 'user', content: prompt },
      ],
      stream: true,
      options: { temperature: 0.5, num_predict: 160 },
    } as any;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`; // optional
    const res = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify(body) });
    if (!res.ok || !res.body) throw new Error(`ollama stream error: ${res.status} ${res.statusText}`);
    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let idx: number;
      while ((idx = buffer.indexOf('\n')) !== -1) {
        const line = buffer.slice(0, idx).trim();
        buffer = buffer.slice(idx + 1);
        if (!line) continue;
        try {
          const json = JSON.parse(line);
          const delta = json?.message?.content || '';
          if (delta) onToken(delta as string);
          if (json?.done) return;
        } catch {
          // ignore partial JSON
        }
      }
    }
    return;
  }

  const endpoint = provider === 'groq'
    ? 'https://api.groq.com/openai/v1/chat/completions'
    : 'https://openrouter.ai/api/v1/chat/completions';

  const body = {
    model: provider === 'groq' ? 'llama-3.1-8b-instant' : 'meta-llama/llama-3.1-8b-instruct',
    messages: [
      ...(system ? [{ role: 'system', content: system }] : []),
      { role: 'user', content: prompt },
    ],
    temperature: 0.5,
    max_tokens: 160,
    stream: true,
  } as any;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok || !res.body) throw new Error(`${provider} stream error: ${res.status} ${res.statusText}`);

  const reader = res.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data:')) continue;
      const payload = trimmed.slice(5).trim();
      if (payload === '[DONE]') return;
      try {
        const json = JSON.parse(payload);
        const delta = json?.choices?.[0]?.delta?.content ?? json?.choices?.[0]?.message?.content ?? '';
        if (delta) onToken(delta as string);
      } catch (e) {
        // skip malformed lines
      }
    }
  }
}

export function setStoredKey(provider: Provider, key: string) {
  if (typeof localStorage === 'undefined') return;
  const map: Record<Provider, string> = {
    gemini: 'gemini_api_key',
    groq: 'groq_api_key',
    openrouter: 'openrouter_api_key',
    ollama: 'ollama_api_key',
  };
  localStorage.setItem(map[provider], key.trim());
}

export function getStoredProvider(): Provider | null {
  if (typeof localStorage === 'undefined') return null;
  const p = localStorage.getItem('ai_provider');
  if (p === 'gemini' || p === 'groq' || p === 'openrouter' || p === 'ollama') return p as Provider;
  return null;
}

export function setStoredProvider(provider: Provider) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem('ai_provider', provider);
}

export async function callProvider(params: {
  provider: Provider;
  apiKey: string;
  prompt: string;
  system?: string;
  baseUrl?: string; // ollama only
  model?: string; // ollama only
}): Promise<string> {
  const { provider, apiKey, prompt, system } = params;

  if (provider !== 'ollama' && !apiKey) throw new Error('Missing API key for selected provider.');

  if (provider === 'gemini') {
    // Google Generative Language API (AI Studio) - Gemini 1.5 Flash
    const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + encodeURIComponent(apiKey);
    const body = {
      contents: [
        {
          role: 'user',
          parts: [{ text: (system ? `System: ${system}\n\n` : '') + prompt }],
        },
      ],
      generationConfig: { temperature: 0.5, maxOutputTokens: 160 },
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Gemini error: ${res.status} ${res.statusText}`);
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Gemini returned no content');
    return text as string;
  }

  if (provider === 'groq') {
    const endpoint = 'https://api.groq.com/openai/v1/chat/completions';
    const body = {
      model: 'llama-3.1-8b-instant',
      messages: [
        ...(system ? [{ role: 'system', content: system }] : []),
        { role: 'user', content: prompt },
      ],
      temperature: 0.5,
      max_tokens: 160,
    };
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Groq error: ${res.status} ${res.statusText}`);
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) throw new Error('Groq returned no content');
    return text as string;
  }

  if (provider === 'openrouter') {
    const endpoint = 'https://openrouter.ai/api/v1/chat/completions';
    const body = {
      model: 'meta-llama/llama-3.1-8b-instruct',
      messages: [
        ...(system ? [{ role: 'system', content: system }] : []),
        { role: 'user', content: prompt },
      ],
      temperature: 0.5,
      max_tokens: 160,
    };
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        // Optional headers for attribution; can be added later
        // 'HTTP-Referer': location.origin,
        // 'X-Title': 'DJ Cline Portfolio',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`OpenRouter error: ${res.status} ${res.statusText}`);
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) throw new Error('OpenRouter returned no content');
    return text as string;
  }

  if (provider === 'ollama') {
    const base = (params.baseUrl || getOllamaBase()).replace(/\/$/, '');
    const model = (params.model ?? getOllamaModel()).trim();
    if (!model) throw new Error('No Ollama model configured');
    const endpoint = `${base}/api/chat`;
    const body = {
      model,
      messages: [
        ...(system ? [{ role: 'system', content: system }] : []),
        { role: 'user', content: prompt },
      ],
      stream: false,
      options: { temperature: 0.5, num_predict: 160 },
    } as any;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`; // optional
    const res = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify(body) });
    if (!res.ok) throw new Error(`Ollama error: ${res.status} ${res.statusText}`);
    const data = await res.json();
    const text = data?.message?.content;
    if (!text) throw new Error('Ollama returned no content');
    return text as string;
  }

  throw new Error('Unsupported provider');
}
