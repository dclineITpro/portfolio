import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Provider, getStoredKey, setStoredKey, getStoredProvider, setStoredProvider, getOllamaBase, setOllamaBase, getOllamaModel, setOllamaModel, fetchOllamaModels } from '../utils/aiProviders';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

const providers: Provider[] = ['gemini', 'groq', 'openrouter', 'ollama'];

const label: Record<Provider, string> = {
  gemini: 'Google Gemini (AI Studio)',
  groq: 'Groq (Llama/Mixtral)',
  openrouter: 'OpenRouter (Multi‑model)',
  ollama: 'Ollama (Local/Remote)',
};

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onClose, onSaved }) => {
  const [keys, setKeys] = useState<Record<Provider, string>>({ gemini: '', groq: '', openrouter: '', ollama: '' });
  const [defaultProvider, setDefaultProvider] = useState<Provider>('gemini');
  const [ollamaBase, setBase] = useState<string>('http://localhost:11434');
  const [ollamaModel, setModel] = useState<string>('');
  const [ollamaModels, setOllamaModels] = useState<string[]>([]);
  const [modelsLoading, setModelsLoading] = useState<boolean>(false);
  const [modelsError, setModelsError] = useState<string>('');

  useEffect(() => {
    if (!open) return;
    const k: Record<Provider, string> = {
      gemini: getStoredKey('gemini') || '',
      groq: getStoredKey('groq') || '',
      openrouter: getStoredKey('openrouter') || '',
      ollama: getStoredKey('ollama') || '',
    };
    setKeys(k);
    setDefaultProvider(getStoredProvider() || 'gemini');
    setBase(getOllamaBase());
    setModel(getOllamaModel());
    // fetch models on open
    (async () => {
      setModelsError('');
      setModelsLoading(true);
      try {
        const list = await fetchOllamaModels(getOllamaBase(), k.ollama || undefined);
        setOllamaModels(list);
      } catch (e: any) {
        setModelsError('Could not load models');
      } finally {
        setModelsLoading(false);
      }
    })();
  }, [open]);

  const refreshModels = async () => {
    setModelsError('');
    setModelsLoading(true);
    try {
      const list = await fetchOllamaModels(ollamaBase, keys.ollama || undefined);
      setOllamaModels(list);
    } catch (e: any) {
      setModelsError('Could not load models');
    } finally {
      setModelsLoading(false);
    }
  };

  const save = () => {
    providers.forEach((p) => setStoredKey(p, keys[p]));
    setStoredProvider(defaultProvider);
    setOllamaBase(ollamaBase);
    setOllamaModel(ollamaModel);
    onSaved?.();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h3 className="text-white font-semibold">AI Settings</h3>
          <button onClick={onClose} className="text-slate-300 hover:text-white">
            <X size={18} />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Default Provider</label>
            <select
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
              value={defaultProvider}
              onChange={(e) => setDefaultProvider(e.target.value as Provider)}
            >
              {providers.map((p) => (
                <option key={p} value={p}>{label[p]}</option>
              ))}
            </select>
          </div>
          {providers.map((p) => (
            <div key={p}>
              <label className="block text-sm text-slate-300 mb-1">{label[p]} API Key{p === 'ollama' ? ' (optional)' : ''}</label>
              <input
                type="password"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                placeholder={`Enter ${p} API key (stored locally)`}
                value={keys[p]}
                onChange={(e) => setKeys((prev) => ({ ...prev, [p]: e.target.value }))}
              />
            </div>
          ))}
          <div className="pt-2 border-t border-slate-800">
            <div className="text-slate-200 font-medium mb-2">Ollama Settings</div>
            <div className="grid gap-3">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Base URL</label>
                <input
                  type="text"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                  placeholder="http://localhost:11434"
                  value={ollamaBase}
                  onChange={(e) => setBase(e.target.value)}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm text-slate-300">Model</label>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={refreshModels} className="px-2 py-1 text-xs bg-slate-800 border border-slate-700 rounded text-slate-200">Refresh</button>
                    {modelsLoading && <span className="text-xs text-slate-400">Loading…</span>}
                    {!modelsLoading && modelsError && <span className="text-xs text-amber-300">{modelsError}</span>}
                  </div>
                </div>
                <input
                  list="ollama-models"
                  type="text"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                  placeholder="llama3.1:8b-instruct"
                  value={ollamaModel}
                  onChange={(e) => setModel(e.target.value)}
                />
                <datalist id="ollama-models">
                  {ollamaModels.map((m) => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
                {ollamaModels.length === 0 && !modelsLoading && !modelsError && (
                  <div className="text-xs text-slate-400 mt-1">No models found. Make sure Ollama is running and you have pulled at least one model.</div>
                )}
              </div>
              <div className="text-xs text-slate-400">Tip: Ensure the model is pulled in your Ollama server. Example: <code>ollama run llama3.1:8b-instruct</code></div>
            </div>
          </div>
          <div className="text-xs text-slate-400">
            Your keys are stored only in this browser via localStorage and are never sent to any server except the provider you call.
          </div>
        </div>
        <div className="p-4 border-t border-slate-700 flex justify-end gap-2">
          <button className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200" onClick={onClose}>Cancel</button>
          <button className="px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg" onClick={save}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
