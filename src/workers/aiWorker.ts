/* eslint-disable no-restricted-globals */
// Web Worker: TF-IDF retrieval + CSV parsing/profiling

export type WorkerMsg =
  | { type: 'tfidf_build'; chunks: string[] }
  | { type: 'tfidf_topk'; query: string; k?: number; reqId: string }
  | { type: 'csv_parse'; text: string; reqId: string };

export type WorkerResp =
  | { type: 'tfidf_ready' }
  | { type: 'tfidf_topk_result'; reqId: string; items: { index: number; score: number }[] }
  | { type: 'csv_result'; reqId: string; headers: string[]; rows: string[][]; profile: any }
  | { type: 'error'; reqId?: string; message: string };

// ---- TF-IDF internals ----
let idf: Map<string, number> | null = null;
let docVecs: Map<string, number>[] = [];

function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
}

function buildTfidf(chunks: string[]) {
  const docs = chunks.map((c) => tokenize(c));
  const df = new Map<string, number>();
  for (const tokens of docs) {
    const uniq = new Set(tokens);
    uniq.forEach((t) => df.set(t, (df.get(t) || 0) + 1));
  }
  const N = docs.length || 1;
  idf = new Map<string, number>();
  df.forEach((d, term) => idf!.set(term, Math.log((N + 1) / (d + 1)) + 1));

  docVecs = docs.map((tokens) => {
    const tf = new Map<string, number>();
    for (const t of tokens) tf.set(t, (tf.get(t) || 0) + 1);
    const vec = new Map<string, number>();
    tf.forEach((count, term) => {
      const weight = (count / tokens.length) * (idf!.get(term) || 0);
      vec.set(term, weight);
    });
    return vec;
  });
}

function vectorize(text: string) {
  const tokens = tokenize(text);
  const tf = new Map<string, number>();
  for (const t of tokens) tf.set(t, (tf.get(t) || 0) + 1);
  const vec = new Map<string, number>();
  tf.forEach((count, term) => {
    const weight = (count / tokens.length) * (idf!.get(term) || 0);
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

function tfidfTopK(query: string, k = 4) {
  if (!idf || !docVecs.length) return [] as { index: number; score: number }[];
  const q = vectorize(query);
  const scored = docVecs.map((dv, i) => ({ index: i, score: cosineSim(q, dv) }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k);
}

// ---- CSV parsing/profiling ----
function parseCSV(text: string): { headers: string[]; rows: string[][] } {
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
          i++;
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
    rows.push(cells);
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

self.addEventListener('message', (e: MessageEvent<WorkerMsg>) => {
  const msg = e.data;
  try {
    if (msg.type === 'tfidf_build') {
      buildTfidf(msg.chunks);
      (self as any).postMessage({ type: 'tfidf_ready' } as WorkerResp);
      return;
    }
    if (msg.type === 'tfidf_topk') {
      const items = tfidfTopK(msg.query, msg.k ?? 4);
      (self as any).postMessage({ type: 'tfidf_topk_result', reqId: msg.reqId, items } as WorkerResp);
      return;
    }
    if (msg.type === 'csv_parse') {
      const { headers, rows } = parseCSV(msg.text);
      const profile = profileCSV(headers, rows);
      (self as any).postMessage({ type: 'csv_result', reqId: msg.reqId, headers, rows, profile } as WorkerResp);
      return;
    }
  } catch (err: any) {
    (self as any).postMessage({ type: 'error', reqId: (msg as any).reqId, message: err?.message || String(err) } as WorkerResp);
  }
});
