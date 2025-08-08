import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Bot, Upload, Mic, MicOff, Sparkles, Database, Settings as SettingsIcon } from 'lucide-react';
import SettingsModal from './SettingsModal';
import { Provider, getStoredKey, getStoredProvider, callProvider } from '../utils/aiProviders';

// ---- Simple Local RAG (TF-IDF) utilities ----

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

const ResumeQA: React.FC<{ mode?: Mode; provider?: Provider; onMissingKey?: () => void }> = ({ mode = 'local', provider = 'gemini', onMissingKey }) => {
  const [query, setQuery] = useState('What are your top cybersecurity achievements?');
  const [answer, setAnswer] = useState<string>('');
  const [sources, setSources] = useState<{ section: string; text: string; score: number }[]>([]);
  const [loading, setLoading] = useState(false);

  const dataset = useMemo(() => extractPortfolioChunks(), []);
  const index = useMemo(() => buildTfidfIndex(dataset), [dataset]);

  const run = useCallback(async () => {
    setLoading(true);
    try {
      const top = index.topK(query, 4);
      setSources(top.map((x) => ({ section: x.chunk.section, text: x.chunk.text, score: x.score })));

      if (mode === 'api') {
        const key = getStoredKey(provider);
        if (!key) {
          setAnswer('No API key found for selected provider. Open Settings to add a key.');
          onMissingKey?.();
          return;
        }
        const context = top.map((x, i) => `[${i + 1} | ${x.chunk.section}] ${x.chunk.text}`).join('\n');
        const system = 'You are a concise executive AI assistant. Answer clearly and tie responses to resume context. If unsure, say you need more info.';
        const prompt = `Question: ${query}\n\nUse the resume context below to answer. Cite sections inline when relevant.\n\nContext:\n${context}`;
        const apiAnswer = await callProvider({ provider, apiKey: key, prompt, system });
        setAnswer(apiAnswer.trim());
      } else {
        const bullets = top.map((x) => `- ${x.chunk.text}`).join('\n');
        const draft = `Here are the most relevant points from my portfolio related to your question:\n\n${bullets}\n\nSummary: I have hands-on leadership in security governance, audits, and risk reduction with measurable outcomes. If you'd like specifics, ask about any section (e.g., SOX, NIST, Zero Trust, incident response).`;
        setAnswer(draft);
      }
    } finally {
      setLoading(false);
    }
  }, [index, query]);

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

      {answer && (
        <div className="mt-4">
          <div className="prose prose-invert max-w-none text-slate-200 whitespace-pre-wrap">{answer}</div>
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

  const handleText = (text: string) => {
    const { headers, rows } = parseCSV(text);
    setHeaders(headers);
    setRows(rows);
    setProfile(profileCSV(headers, rows));
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

const VoiceQA: React.FC = () => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const recognitionRef = useRef<any>(null);

  const dataset = useMemo(() => extractPortfolioChunks(), []);
  const index = useMemo(() => buildTfidfIndex(dataset), [dataset]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utt = new SpeechSynthesisUtterance(text);
      utt.rate = 1.05;
      window.speechSynthesis.speak(utt);
    }
  };

  const process = (q: string) => {
    if (!q.trim()) return;
    const top = index.topK(q, 3);
    const bullets = top.map((x) => x.chunk.text).join(' ');
    const ans = `From my portfolio: ${bullets}`;
    setResponse(ans);
    speak(ans);
  };

  const start = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser.');
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang = 'en-US';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      setTranscript(text);
      process(text);
    };
    rec.onend = () => setListening(false);
    rec.start();
    recognitionRef.current = rec;
    setListening(true);
  };

  const stop = () => {
    recognitionRef.current?.stop?.();
    setListening(false);
  };

  const supported = typeof window !== 'undefined' && (('SpeechRecognition' in window) || ('webkitSpeechRecognition' in window));

  return (
    <div>
      <div className="flex items-center gap-2">
        <button
          onClick={listening ? stop : start}
          className={`px-4 py-2 rounded-lg text-white ${listening ? 'bg-primary-700' : 'bg-primary-600 hover:bg-primary-700'}`}
        >
          {listening ? (
            <span className="inline-flex items-center"><MicOff size={16} className="mr-2"/> Stop</span>
          ) : (
            <span className="inline-flex items-center"><Mic size={16} className="mr-2"/> Ask by Voice</span>
          )}
        </button>
        {!supported && <div className="text-sm text-slate-400">Speech APIs not supported in this browser.</div>}
      </div>

      {transcript && (
        <div className="mt-3 text-slate-300"><span className="text-slate-400">You said:</span> {transcript}</div>
      )}
      {response && (
        <div className="mt-2 text-slate-200">{response}</div>
      )}
    </div>
  );
};

const AILab: React.FC = () => {
  const [openSettings, setOpenSettings] = useState(false);
  const [mode, setMode] = useState<Mode>('local');
  const [provider, setProvider] = useState<Provider>(getStoredProvider() || 'gemini');

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
              </select>
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
          <ResumeQA mode={mode} provider={provider} onMissingKey={() => setOpenSettings(true)} />
        </Card>
        <Card title="CSV Insights Analyzer" icon={<Database size={18}/> }>
          <CSVInsights/>
        </Card>
        <Card title="Voice Q&A" icon={<Mic size={18}/> }>
          <VoiceQA/>
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
