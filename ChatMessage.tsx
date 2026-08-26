import React, { useState } from 'react';
import { 
  Bot, User, Sparkles, Copy, Check, RotateCcw, 
  Volume2, VolumeX, Eye, Globe, ChevronDown, ChevronRight,
  Code, Sparkle, ExternalLink, Paperclip
} from 'lucide-react';
import { ChatMessage as ChatMessageType, AIModelId, Artifact } from './types';
import { AI_MODELS } from './mockAi';

interface ChatMessageProps {
  message: ChatMessageType;
  onRetry?: () => void;
  onOpenArtifact?: (artifact: Artifact) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onRetry, onOpenArtifact }) => {
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [showThinking, setShowThinking] = useState(true);

  const isUser = message.role === 'user';
  const modelInfo = AI_MODELS.find(m => m.id === message.modelUsed);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      if (speaking) {
        window.speechSynthesis.cancel();
        setSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(message.content.replace(/```[\s\S]*?```/g, 'code snippet'));
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Simple Markdown renderer helper for clean display
  const renderFormattedText = (text: string) => {
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: text.substring(lastIndex, match.index) });
      }
      parts.push({ type: 'code', lang: match[1] || 'plaintext', content: match[2] });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push({ type: 'text', content: text.substring(lastIndex) });
    }

    return parts.map((part, idx) => {
      if (part.type === 'code') {
        return (
          <div key={idx} className="my-3 rounded-lg overflow-hidden border border-slate-800 bg-slate-900 shadow-lg font-mono text-xs">
            <div className="bg-slate-800/80 px-4 py-1.5 flex items-center justify-between text-slate-400 border-b border-slate-700/50">
              <span className="text-blue-400 font-semibold">{part.lang}</span>
              <button
                onClick={() => navigator.clipboard.writeText(part.content)}
                className="hover:text-white flex items-center gap-1 transition-colors text-[11px]"
              >
                <Copy className="w-3 h-3" /> Copy
              </button>
            </div>
            <pre className="p-4 overflow-x-auto text-slate-200 leading-relaxed">
              <code>{part.content}</code>
            </pre>
          </div>
        );
      }

      // Regular formatted inline markdown (bold, lists, headers)
      const lines = part.content.split('\n');
      return (
        <div key={idx} className="space-y-2">
          {lines.map((line, lIdx) => {
            if (line.startsWith('### ')) {
              return <h3 key={lIdx} className="text-base font-bold text-slate-100 mt-3 mb-1">{line.replace('### ', '')}</h3>;
            }
            if (line.startsWith('## ')) {
              return <h2 key={lIdx} className="text-lg font-bold text-white mt-4 mb-2 border-b border-slate-800 pb-1">{line.replace('## ', '')}</h2>;
            }
            if (line.startsWith('- ')) {
              return (
                <div key={lIdx} className="flex gap-2 items-start ml-2 text-slate-300">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>{formatInline(line.substring(2))}</span>
                </div>
              );
            }
            if (line.trim() === '') return <div key={lIdx} className="h-1" />;
            return <p key={lIdx} className="leading-relaxed text-slate-200">{formatInline(line)}</p>;
          })}
        </div>
      );
    });
  };

  const formatInline = (str: string) => {
    const parts = str.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
    return parts.map((chunk, i) => {
      if (chunk.startsWith('**') && chunk.endsWith('**')) {
        return <strong key={i} className="font-semibold text-white">{chunk.slice(2, -2)}</strong>;
      }
      if (chunk.startsWith('`') && chunk.endsWith('`')) {
        return <code key={i} className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-blue-300 font-mono text-xs">{chunk.slice(1, -1)}</code>;
      }
      return chunk;
    });
  };

  return (
    <div className={`py-6 px-4 md:px-8 border-b border-slate-900/60 transition-colors ${
      isUser ? 'bg-slate-950/40' : 'bg-slate-900/30'
    }`}>
      <div className="max-w-4xl mx-auto flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {isUser ? (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <User className="w-5 h-5" />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20 ring-1 ring-white/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
          )}
        </div>

        {/* Body Content */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Header Metadata */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-slate-200">
                {isUser ? 'You' : 'OmniMind AI'}
              </span>
              {!isUser && modelInfo && (
                <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700/80 text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${modelInfo.iconColor}`} />
                  {modelInfo.name}
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-500">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* Attachments rendering */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {message.attachments.map((file) => (
                <div key={file.id} className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-slate-300">
                  <Paperclip className="w-3.5 h-3.5 text-blue-400" />
                  <span className="truncate max-w-[180px] font-medium">{file.name}</span>
                  <span className="text-slate-500 text-[10px]">({(file.size / 1024).toFixed(1)} KB)</span>
                </div>
              ))}
            </div>
          )}

          {/* Reasoning / Thinking Process Breakdown (DeepSeek style) */}
          {message.reasoningContent && (
            <div className="rounded-xl border border-purple-500/20 bg-purple-950/20 overflow-hidden text-xs">
              <button
                onClick={() => setShowThinking(!showThinking)}
                className="w-full px-3.5 py-2 bg-purple-900/30 flex items-center justify-between text-purple-300 hover:text-purple-100 font-medium transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Sparkle className="w-3.5 h-3.5 text-purple-400 animate-spin" />
                  <span>Reasoning Process</span>
                </div>
                {showThinking ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
              {showThinking && (
                <div className="p-3.5 text-purple-200/80 whitespace-pre-wrap font-mono text-[11px] leading-relaxed border-t border-purple-500/10 bg-purple-950/10">
                  {message.reasoningContent}
                </div>
              )}
            </div>
          )}

          {/* Citations / Web search links */}
          {message.citations && message.citations.length > 0 && (
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400">
                <Globe className="w-3.5 h-3.5" /> Sources & Web Citations
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {message.citations.map((cite, idx) => (
                  <a
                    key={idx}
                    href={cite.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 rounded-lg text-xs group transition-all"
                  >
                    <div className="font-medium text-slate-200 truncate group-hover:text-blue-400 flex items-center justify-between">
                      <span>{idx + 1}. {cite.title}</span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">{cite.snippet}</div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="text-slate-200 text-sm leading-relaxed font-sans">
            {renderFormattedText(message.content)}
          </div>

          {/* Artifact Card Banner (If AI generated an interactive canvas piece) */}
          {message.artifact && (
            <div className="mt-4 p-4 rounded-xl border border-blue-500/30 bg-gradient-to-r from-blue-950/40 to-indigo-950/40 flex items-center justify-between group hover:border-blue-500/60 transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  <Code className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                    {message.artifact.title}
                    <span className="text-[10px] px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full font-mono uppercase">
                      {message.artifact.type}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400">Click to view interactive canvas preview</p>
                </div>
              </div>
              <button
                onClick={() => onOpenArtifact && onOpenArtifact(message.artifact!)}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all hover:scale-105"
              >
                <Eye className="w-4 h-4" /> Open Canvas
              </button>
            </div>
          )}

          {/* Action Toolbar */}
          {!isUser && !message.isStreaming && (
            <div className="flex items-center gap-2 pt-2 text-slate-400 text-xs">
              <button
                onClick={handleCopy}
                className="p-1.5 hover:text-white hover:bg-slate-800 rounded-md transition-colors flex items-center gap-1"
                title="Copy response"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleSpeak}
                className={`p-1.5 hover:text-white hover:bg-slate-800 rounded-md transition-colors flex items-center gap-1 ${
                  speaking ? 'text-blue-400 font-medium' : ''
                }`}
                title="Read aloud"
              >
                {speaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{speaking ? 'Stop' : 'Read'}</span>
              </button>

              {onRetry && (
                <button
                  onClick={onRetry}
                  className="p-1.5 hover:text-white hover:bg-slate-800 rounded-md transition-colors flex items-center gap-1"
                  title="Regenerate response"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Regenerate</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};