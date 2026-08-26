import React, { useState } from 'react';
import { 
  X, Play, Copy, Check, Download, Maximize2, RefreshCw, 
  Code, Eye, CheckCircle2 
} from 'lucide-react';
import { Artifact } from './types';

interface ArtifactCanvasProps {
  artifact: Artifact | null;
  onClose: () => void;
}

export const ArtifactCanvas: React.FC<ArtifactCanvasProps> = ({ artifact, onClose }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);
  const [key, setKey] = useState(0);

  if (!artifact) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(artifact.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([artifact.code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${artifact.title.toLowerCase().replace(/\s+/g, '-')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full md:w-1/2 h-full bg-slate-900 border-l border-slate-800 flex flex-col shadow-2xl z-20">
      {/* Header Bar */}
      <div className="h-14 px-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Code className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-white truncate max-w-[200px]">
              {artifact.title}
            </h3>
            <span className="text-[10px] text-slate-400 uppercase font-mono">{artifact.type} Artifact</span>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-800/80 p-1 rounded-lg border border-slate-700/60 text-xs">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'preview'
                  ? 'bg-blue-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'code'
                  ? 'bg-blue-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" /> Source
            </button>
          </div>

          <button
            onClick={() => setKey(prev => prev + 1)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Reload Preview"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleCopyCode}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Copy Code"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Download File"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Close Canvas"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div className="flex-1 bg-slate-950 overflow-hidden relative">
        {activeTab === 'preview' ? (
          <iframe
            key={key}
            srcDoc={artifact.code}
            title={artifact.title}
            className="w-full h-full border-0 bg-slate-950"
            sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
          />
        ) : (
          <div className="h-full overflow-auto p-4 font-mono text-xs text-slate-300 bg-slate-950 leading-relaxed">
            <pre>
              <code>{artifact.code}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};