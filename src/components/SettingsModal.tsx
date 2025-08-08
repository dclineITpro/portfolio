import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Provider, getStoredKey, setStoredKey, getStoredProvider, setStoredProvider } from '../utils/aiProviders';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

const providers: Provider[] = ['gemini', 'groq', 'openrouter'];

const label: Record<Provider, string> = {
  gemini: 'Google Gemini (AI Studio)',
  groq: 'Groq (Llama/Mixtral)',
  openrouter: 'OpenRouter (Multi‑model)',
};

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onClose, onSaved }) => {
  const [keys, setKeys] = useState<Record<Provider, string>>({ gemini: '', groq: '', openrouter: '' });
  const [defaultProvider, setDefaultProvider] = useState<Provider>('gemini');

  useEffect(() => {
    if (!open) return;
    const k: Record<Provider, string> = {
      gemini: getStoredKey('gemini') || '',
      groq: getStoredKey('groq') || '',
      openrouter: getStoredKey('openrouter') || '',
    };
    setKeys(k);
    setDefaultProvider(getStoredProvider() || 'gemini');
  }, [open]);

  const save = () => {
    providers.forEach((p) => setStoredKey(p, keys[p]));
    setStoredProvider(defaultProvider);
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
              <label className="block text-sm text-slate-300 mb-1">{label[p]} API Key</label>
              <input
                type="password"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                placeholder={`Enter ${p} API key (stored locally)`}
                value={keys[p]}
                onChange={(e) => setKeys((prev) => ({ ...prev, [p]: e.target.value }))}
              />
            </div>
          ))}
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
