export type Chunk = { id: string; section: string; text: string };

// ----- Tokenization -----
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

// ----- TF-IDF index -----
export function buildTfidfIndex(chunks: Chunk[]) {
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

// ----- Semantic embeddings (lazy, via Transformers.js CDN) -----
let embedderPromise: Promise<any> | null = null;
async function getEmbedder() {
  if (!embedderPromise) {
    embedderPromise = (async () => {
      // Use ESM CDN for browser-friendly dynamic import
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const mod = await import('https://esm.sh/@xenova/transformers');
      const pipeline = (mod as any).pipeline;
      const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      return extractor;
    })();
  }
  return embedderPromise;
}

export async function buildSemanticIndex(chunks: Chunk[]) {
  const extractor = await getEmbedder();
  // Compute embeddings for each chunk (mean pooled)
  const vectors = [] as number[][];
  for (const c of chunks) {
    const output = await extractor(c.text, { pooling: 'mean', normalize: true });
    const data = Array.from(output.data as Float32Array);
    vectors.push(data);
  }

  function embed(text: string) {
    return extractor(text, { pooling: 'mean', normalize: true }).then((out: any) => Array.from(out.data as Float32Array) as number[]);
  }

  function cosineSim(a: number[], b: number[]) {
    let dot = 0;
    let a2 = 0;
    let b2 = 0;
    const len = Math.min(a.length, b.length);
    for (let i = 0; i < len; i++) {
      dot += a[i] * b[i];
      a2 += a[i] * a[i];
      b2 += b[i] * b[i];
    }
    const denom = Math.sqrt(a2) * Math.sqrt(b2);
    return denom ? dot / denom : 0;
  }

  async function topK(query: string, k = 3) {
    const q = await embed(query);
    const scored = vectors.map((v, i) => ({ i, score: cosineSim(q, v) }));
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, k).map(({ i, score }) => ({ chunk: chunks[i], score }));
  }

  return { topK };
}
