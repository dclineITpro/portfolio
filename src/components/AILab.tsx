import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Bot, Upload, Sparkles, Database, Settings as SettingsIcon } from 'lucide-react';
import SettingsModal from './SettingsModal';
import { Provider, getStoredKey, getStoredProvider, callProvider, callProviderStream, getOllamaBase, getOllamaModel } from '../utils/aiProviders';
import { buildSemanticIndex } from '../utils/retrieval';

// ---- Simple Local RAG (TF-IDF) utilities ----

// Shared worker for off-main-thread tasks (TF-IDF & CSV)
let sharedWorker: Worker | null = null;
function getWorker(): Worker {
  if (!sharedWorker) {
    // Vite-friendly worker import
    sharedWorker = new Worker(new URL('../workers/aiWorker.ts', import.meta.url), { type: 'module' });
  }
  return sharedWorker;
}

function makeId() {
  return Math.random().toString(36).slice(2);
}

async function postWorker<T = any>(msg: any, waitFor: string): Promise<T> {
  const worker = getWorker();
  const reqId = msg.reqId || makeId();
  return new Promise<T>((resolve, reject) => {
    const timeout = setTimeout(() => {
      worker.removeEventListener('message', onMsg as any);
      reject(new Error('Worker timeout'));
    }, 8000);
    function onMsg(e: MessageEvent<any>) {
      const data = e.data;
      if (!data || (data.type !== waitFor && data.type !== 'error')) return;
      if (data.type === 'error' && (!data.reqId || data.reqId === reqId)) {
        clearTimeout(timeout);
        worker.removeEventListener('message', onMsg as any);
        reject(new Error(data.message || 'Worker error'));
        return;
      }
      if (data.reqId === reqId || waitFor === 'tfidf_ready') {
        clearTimeout(timeout);
        worker.removeEventListener('message', onMsg as any);
        resolve(data as T);
      }
    }
    worker.addEventListener('message', onMsg as any);
    worker.postMessage({ ...msg, reqId });
  });
}

type Chunk = {
  id: string;
  section: string;
  text: string;
};

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function buildTfidfIndex(chunks: Chunk[]) {
  const docs = chunks.map((c) => tokenize(c.text));
  const df = new Map<string, number>();
  for (const tokens of docs) {
    const uniq = new Set(tokens);
    uniq.forEach((t) => df.set(t, (df.get(t) || 0) + 1));
  }
  const N = docs.length || 1;
  const idf = new Map<string, number>();
  df.forEach((d, term) => idf.set(term, Math.log((N + 1) / (d + 1)) + 1));

  const docVecs = docs.map((tokens) => {
    const tf = new Map<string, number>();
    for (const t of tokens) tf.set(t, (tf.get(t) || 0) + 1);
    const vec = new Map<string, number>();
    tf.forEach((count, term) => {
      const weight = (count / tokens.length) * (idf.get(term) || 0);
      vec.set(term, weight);
    });
    return vec;
  });

  function vectorize(text: string) {
    const tokens = tokenize(text);
    const tf = new Map<string, number>();
    for (const t of tokens) tf.set(t, (tf.get(t) || 0) + 1);
    const vec = new Map<string, number>();
    tf.forEach((count, term) => {
      const weight = (count / tokens.length) * (idf.get(term) || 0);
      vec.set(term, weight);
    });
    return vec;
  }

  function cosineSim(a: Map<string, number>, b: Map<string, number>) {
    let dot = 0;
    let a2 = 0;
    let b2 = 0;
    a.forEach((av, t) => {
      a2 += av * av;
      const bv = b.get(t) || 0;
      dot += av * bv;
    });
    b.forEach((bv) => (b2 += bv * bv));
    const denom = Math.sqrt(a2) * Math.sqrt(b2);
    return denom ? dot / denom : 0;
  }

  function topK(query: string, k = 3) {
    const q = vectorize(query);
    const scored = docVecs.map((dv, i) => ({ i, score: cosineSim(q, dv) }));
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, k).map(({ i, score }) => ({ chunk: chunks[i], score }));
  }

  return { topK };
}

function extractPortfolioChunks(): Chunk[] {
  const sections = [
    { id: '#about', name: 'About' },
    { id: '#experience', name: 'Experience' },
    { id: '#skills', name: 'Skills' },
    { id: '#frameworks', name: 'Frameworks' },
    { id: '#audit-outcomes', name: 'Audit Outcomes' },
    { id: '#skills-matrix', name: 'Skills Matrix' },
    { id: '#achievements', name: 'Achievements' },
  ];
  const chunks: Chunk[] = [];
  sections.forEach((s) => {
    const el = document.querySelector(s.id);
    if (!el) return;
    const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
    // Split into sentences-ish
    const parts = text.split(/(?<=[\.!?])\s+/).filter((p) => p.length > 0);
    parts.forEach((p, idx) => {
      chunks.push({ id: `${s.id}-${idx}`, section: s.name, text: p });
    });
  });
  return chunks;
}

// ---- CSV utils (lightweight parser) ----
function parseCSV(text: string): { headers: string[]; rows: string[][] } {
  // Handles quoted fields with commas. Not RFC-perfect but robust for demos.
  const lines = text.replace(/\r\n?/g, '\n').split('\n').filter((l) => l.trim().length > 0);
  const rows: string[][] = [];
  for (const line of lines) {
    const cells: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        cells.push(cur);
        cur = '';
      } else {
        cur += ch;
      }
    }
    cells.push(cur);
    rows.push(cells.map((c) => c.trim()));
  }
  const headers = rows.shift() || [];
  return { headers, rows };
}

function profileCSV(headers: string[], rows: string[][]) {
  const n = rows.length;
  const summary = headers.map((h, col) => {
    const values = rows.map((r) => r[col]).filter((v) => v !== undefined);
    const nums = values.map((v) => Number(v)).filter((x) => !Number.isNaN(x));
    const isNumeric = nums.length >= Math.max(3, Math.floor(values.length * 0.6));
    const distinct = new Set(values).size;
    const basic: any = { header: h, count: values.length, distinct };
    if (isNumeric) {
      const mean = nums.reduce((a, b) => a + b, 0) / (nums.length || 1);
      const std = Math.sqrt(nums.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (nums.length || 1));
      // z-score anomalies
      const anomalies = nums
        .map((v, i) => ({ v, i, z: std ? Math.abs((v - mean) / std) : 0 }))
        .filter((o) => o.z >= 3)
        .slice(0, 10);
      basic.numeric = { mean, std, anomalies };
    }
    return basic;
  });
  return { rows: n, columns: headers.length, summary };
}

// ---- Components ----

const Card: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => {
  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 shadow-md">
      <div className="flex items-center mb-3">
        <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary-600/20 text-primary-400 mr-2">
          {icon}
        </div>
        <h3 className="text-white font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
};

type Mode = 'local' | 'api';
type RetrievalMode = 'tfidf' | 'semantic';

const ResumeQA: React.FC<{ mode?: Mode; provider?: Provider; retrieval?: RetrievalMode; onMissingKey?: () => void }> = ({ mode = 'local', provider = 'gemini', retrieval = 'tfidf', onMissingKey }) => {
  const [query, setQuery] = useState('What are your top cybersecurity achievements?');
  const [answer, setAnswer] = useState<string>('');
  const [sources, setSources] = useState<{ section: string; text: string; score: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [semanticReady, setSemanticReady] = useState(false);
  const [semanticBuilding, setSemanticBuilding] = useState(false);

  const dataset = useMemo(() => extractPortfolioChunks(), []);
  const tfidfIndexRef = useRef<any | null>(null);

  // Build TF-IDF in worker (non-blocking). Fallback: on-demand build in main if worker fails.
  useEffect(() => {
    if (!dataset.length) return;
    (async () => {
      try {
        await postWorker({ type: 'tfidf_build', chunks: dataset.map((c) => c.text) }, 'tfidf_ready');
      } catch {
        // fallback lazily when/if needed
        tfidfIndexRef.current = null;
      }
    })();
  }, [dataset]);
  const semanticIndexRef = useRef<any | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (retrieval === 'semantic' && !semanticIndexRef.current && dataset.length) {
      setSemanticBuilding(true);
      buildSemanticIndex(dataset)
        .then((idx) => {
          if (!cancelled) {
            semanticIndexRef.current = idx;
            setSemanticReady(true);
          }
        })
        .finally(() => !cancelled && setSemanticBuilding(false));
    }
    return () => {
      cancelled = true;
    };
  }, [retrieval, dataset]);

  const run = useCallback(async () => {
    setLoading(true);
    try {
      let top: { chunk: Chunk; score: number }[] = [] as any;
      if (retrieval === 'semantic') {
        if (!semanticIndexRef.current) {
          setAnswer('Building semantic index… please try again in a moment.');
          return;
        }
        top = await semanticIndexRef.current.topK(query, 3);
      } else {
        // Prefer worker; fallback to main-thread TF-IDF if worker unavailable
        try {
          const res: any = await postWorker({ type: 'tfidf_topk', query, k: 3 }, 'tfidf_topk_result');
          const items = (res?.items || []) as { index: number; score: number }[];
          top = items.map((it) => ({ chunk: dataset[it.index], score: it.score }));
        } catch {
          if (!tfidfIndexRef.current) {
            tfidfIndexRef.current = buildTfidfIndex(dataset);
          }
          top = tfidfIndexRef.current.topK(query, 3);
        }
      }
      setSources(top.map((x) => ({ section: x.chunk.section, text: x.chunk.text, score: x.score })));

      if (mode === 'api') {
        const key = getStoredKey(provider);
        if (provider !== 'ollama' && !key) {
          setAnswer('No API key found for selected provider. Open Settings to add a key.');
          onMissingKey?.();
          return;
        }
        if (provider === 'ollama' && !getOllamaModel().trim()) {
          setAnswer('No Ollama model selected. Open Settings to choose one from your Ollama server.');
          onMissingKey?.();
          return;
        }
        const context = top.map((x, i) => `[${i + 1} | ${x.chunk.section}] ${x.chunk.text}`).join('\n');
        const system = 'You are a concise executive AI assistant. Keep answers under 60 words. Prefer 2 short sentences; if bullets are clearer, use up to 3 very short bullets. No preamble.';
        const prompt = `Question: ${query}\n\nUse the resume context below to answer in under 60 words. Cite sections inline briefly if useful.\n\nContext:\n${context}`;
        // Stream if supported
        if (provider === 'gemini') {
          const apiAnswer = await callProvider({ provider, apiKey: key || '', prompt, system, baseUrl: getOllamaBase(), model: getOllamaModel() });
          setAnswer(apiAnswer.trim());
        } else {
          setAnswer('');
          await callProviderStream({ provider, apiKey: key || '', prompt, system, baseUrl: getOllamaBase(), model: getOllamaModel(), onToken: (t) => setAnswer((prev) => prev + t) });
        }
      } else {
        const bullets = top.slice(0, 2).map((x) => `- ${x.chunk.text}`).join('\n');
        const summary = 'Summary: Focused, measurable outcomes in security governance and transformation; ask for specifics (SOX, NIST, Zero Trust) if needed.';
        const draft = `${bullets}\n\n${summary}`;
        setAnswer(draft);
      }
    } finally {
      setLoading(false);
    }
  }, [retrieval, query, provider, dataset]);

  useEffect(() => {
    // Pre-run once after mount
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-400"
          placeholder="Ask about my experience, security work, AI strategy, etc."
        />
        <button
          onClick={run}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg disabled:opacity-50"
          disabled={loading || !query.trim()}
        >
          {loading ? 'Thinking…' : 'Ask'}
        </button>
      </div>

      {loading ? (
        <div className="text-slate-300">Thinking…</div>
      ) : (
        <div>
          {retrieval === 'semantic' && !semanticReady && (
            <div className="text-xs text-slate-400 mb-2">Semantic retrieval (embeddings) will load on first use…</div>
          )}
          {answer && (
            <div className="text-slate-200 whitespace-pre-wrap">{answer}</div>
          )}
          {sources.length > 0 && (
            <div className="mt-3">
              <div className="text-sm text-slate-400 mb-1">Top sources:</div>
              <ul className="space-y-2">
                {sources.map((s, i) => (
                  <li key={i} className="text-sm text-slate-300">
                    <span className="text-primary-400 font-medium">[{s.section}]</span> {s.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const CSVInsights: React.FC = () => {
  const [fileName, setFileName] = useState<string>('');
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [profile, setProfile] = useState<any | null>(null);

  const sampleCSV = `team,incidents,resolution_hours,category\nNetwork,42,3,Connectivity\nSecurity,5,12,Phishing\nSecurity,1,28,Ransomware\nHelpdesk,120,1,Password\nHelpdesk,10,6,Hardware\nCloud,8,9,Deployment\n`;

  const handleText = async (text: string) => {
    try {
      const res: any = await postWorker({ type: 'csv_parse', text }, 'csv_result');
      setHeaders(res.headers);
      setRows(res.rows);
      setProfile(res.profile);
    } catch {
      // Fallback to main thread if worker not available
      const { headers, rows } = parseCSV(text);
      setHeaders(headers);
      setRows(rows);
      setProfile(profileCSV(headers, rows));
    }
  };

  const onFile = async (f: File) => {
    setFileName(f.name);
    const text = await f.text();
    handleText(text);
  };

  const totalIncidents = useMemo(() => {
    const idx = headers.findIndex((h) => h.toLowerCase().includes('incident'));
    if (idx === -1) return null;
    return rows.reduce((acc, r) => acc + (Number(r[idx]) || 0), 0);
  }, [headers, rows]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start gap-2">
        <div className="flex items-center gap-2">
          <label className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg cursor-pointer text-slate-200 inline-flex items-center">
            <Upload size={16} className="mr-2" /> Upload CSV
            <input type="file" accept=".csv" className="hidden" onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
            }} />
          </label>
          <button
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200"
            onClick={() => handleText(sampleCSV)}
          >
            Use Sample
          </button>
        </div>
        <div className="text-sm text-slate-400">{fileName || 'No file selected'}</div>
      </div>

      {profile && (
        <div className="mt-4 space-y-3">
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200">
              <div className="text-slate-400 text-sm">Rows</div>
              <div className="text-xl font-semibold">{profile.rows}</div>
            </div>
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200">
              <div className="text-slate-400 text-sm">Columns</div>
              <div className="text-xl font-semibold">{profile.columns}</div>
            </div>
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200">
              <div className="text-slate-400 text-sm">Total Incidents (if present)</div>
              <div className="text-xl font-semibold">{totalIncidents ?? '—'}</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  {headers.map((h) => (
                    <th key={h} className="text-left px-2 py-1 text-slate-300 border-b border-slate-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 50).map((r, i) => (
                  <tr key={i} className="even:bg-slate-900/40">
                    {r.map((c, j) => (
                      <td key={j} className="px-2 py-1 text-slate-200 border-b border-slate-800 truncate max-w-[240px]">{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <div className="text-slate-300 font-medium mb-2">Column Profiles</div>
            <div className="grid md:grid-cols-2 gap-3">
              {profile.summary.map((col: any) => (
                <div key={col.header} className="bg-slate-900 border border-slate-700 rounded-lg p-3">
                  <div className="text-slate-200 font-semibold">{col.header}</div>
                  <div className="text-slate-400 text-sm">Values: {col.count} • Distinct: {col.distinct}</div>
                  {col.numeric && (
                    <div className="mt-2 text-sm text-slate-300">
                      <div>Mean: {col.numeric.mean.toFixed(2)} • Std: {col.numeric.std.toFixed(2)}</div>
                      {col.numeric.anomalies.length > 0 && (
                        <div className="mt-1">
                          <div className="text-slate-400">Anomalies (|z| ≥ 3):</div>
                          <ul className="list-disc list-inside text-slate-300">
                            {col.numeric.anomalies.map((a: any, i: number) => (
                              <li key={i}>Row {a.i + 1}: {a.v} (z={a.z.toFixed(2)})</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AILab: React.FC = () => {
  const [openSettings, setOpenSettings] = useState(false);
  const [mode, setMode] = useState<Mode>('local');
  const [provider, setProvider] = useState<Provider>(getStoredProvider() || 'gemini');
  const [retrieval, setRetrieval] = useState<RetrievalMode>('tfidf');

  return (
    <section id="ai-lab" className="py-16 container-padding">
      <div className="mb-6">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-600/20 text-primary-300 text-xs font-semibold mb-2">
          <Sparkles size={14} className="mr-1"/> AI Lab (Local & Optional API)
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-3xl font-bold text-white">Interactive AI Demos</h2>
            <p className="mt-1 text-slate-300 max-w-3xl">Runs locally by default. You can also use your own API key (stored in this browser) to enhance answers.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setMode('local')}
                className={`px-3 py-2 text-sm ${mode === 'local' ? 'bg-primary-600 text-white' : 'text-slate-300'}`}
              >Local</button>
              <button
                onClick={() => setMode('api')}
                className={`px-3 py-2 text-sm border-l border-slate-700 ${mode === 'api' ? 'bg-primary-600 text-white' : 'text-slate-300'}`}
              >API</button>
            </div>
            {mode === 'api' && (
              <select
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                value={provider}
                onChange={(e) => setProvider(e.target.value as Provider)}
              >
                <option value="gemini">Gemini</option>
                <option value="groq">Groq</option>
                <option value="openrouter">OpenRouter</option>
                <option value="ollama">Ollama</option>
              </select>
            )}
            {mode === 'api' && provider === 'ollama' && typeof window !== 'undefined' && window.location.protocol === 'https:' && getOllamaBase().startsWith('http://') && (
              <div className="text-xs text-amber-300 bg-amber-900/30 border border-amber-700 rounded px-2 py-1">
                HTTPS page cannot call an http:// Ollama server. Run the site locally (npm run preview) or set an HTTPS base URL/proxy for Ollama.
              </div>
            )}
            <button
              className="inline-flex items-center px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-sm"
              onClick={() => setOpenSettings(true)}
              title="API Keys & default provider"
            >
              <SettingsIcon size={16} className="mr-1"/> Settings
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card title="Resume Q&A (RAG)" icon={<Bot size={18}/> }>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-xs text-slate-400">Retrieval:</span>
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
              <button onClick={() => setRetrieval('tfidf')} className={`px-2 py-1 text-xs ${retrieval === 'tfidf' ? 'bg-primary-600 text-white' : 'text-slate-300'}`}>TF‑IDF</button>
              <button onClick={() => setRetrieval('semantic')} className={`px-2 py-1 text-xs border-l border-slate-700 ${retrieval === 'semantic' ? 'bg-primary-600 text-white' : 'text-slate-300'}`}>Semantic (beta)</button>
            </div>
          </div>
          <ResumeQA mode={mode} provider={provider} retrieval={retrieval} onMissingKey={() => setOpenSettings(true)} />
        </Card>
        <Card title="CSV Insights Analyzer" icon={<Database size={18}/> }>
          <CSVInsights/>
        </Card>
      </div>

      <SettingsModal open={openSettings} onClose={() => setOpenSettings(false)} onSaved={() => {
        // sync provider from saved default if user updated it
        const p = getStoredProvider();
        if (p) setProvider(p);
      }} />
    </section>
  );
};

export default AILab;
