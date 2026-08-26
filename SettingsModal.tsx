import React, { useState } from 'react';
import { X, Key, Sliders, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { UserSettings } from './types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [form, setForm] = useState<UserSettings>(settings);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Key className="w-4 h-4 text-blue-400" />
            <span>Preferences & API Configuration</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="p-3 bg-blue-950/40 border border-blue-500/20 rounded-xl text-xs text-blue-300">
            <strong>Note:</strong> OmniMind comes with zero-config smart AI response simulation enabled out-of-the-box. Enter custom API keys below if you want direct API integration!
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              API Keys (Stored locally)
            </h4>

            <div>
              <label className="text-xs text-slate-400 block mb-1">OpenAI API Key</label>
              <input
                type="password"
                placeholder="sk-..."
                value={form.apiKeyOpenAI || ''}
                onChange={(e) => setForm({ ...form, apiKeyOpenAI: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Anthropic API Key</label>
              <input
                type="password"
                placeholder="sk-ant-..."
                value={form.apiKeyAnthropic || ''}
                onChange={(e) => setForm({ ...form, apiKeyAnthropic: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Gemini API Key</label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={form.apiKeyGemini || ''}
                onChange={(e) => setForm({ ...form, apiKeyGemini: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4 space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Generation Parameters
            </h4>

            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Creativity Temperature</span>
                <span className="font-mono text-white">{form.temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={form.temperature}
                onChange={(e) => setForm({ ...form, temperature: parseFloat(e.target.value) })}
                className="w-full accent-blue-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-300">Enable Live Web Search</span>
              <input
                type="checkbox"
                checked={form.enableWebSearch}
                onChange={(e) => setForm({ ...form, enableWebSearch: e.target.checked })}
                className="w-4 h-4 rounded accent-blue-500 bg-slate-950 border-slate-800"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-md shadow-blue-600/20"
            >
              {saved ? <Check className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
              <span>{saved ? 'Saved!' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};