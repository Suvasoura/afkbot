import React from 'react';
import { 
  Plus, MessageSquare, Trash2, Settings, Sparkles, 
  Layers, FolderPlus, Bot, ChevronRight, Wand2, Key, Download, X
} from 'lucide-react';
import { ChatSession, Persona, UserSettings, AIModelId } from './types';
import { AI_MODELS } from './mockAi';

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  personas: Persona[];
  activePersonaId: string;
  onSelectPersona: (personaId: string) => void;
  selectedModel: AIModelId;
  onSelectModel: (modelId: AIModelId) => void;
  onOpenSettings: () => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  personas,
  activePersonaId,
  onSelectPersona,
  selectedModel,
  onSelectModel,
  onOpenSettings,
  isOpen,
  onCloseMobile
}) => {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-72 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Brand Header with Close Button */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-white tracking-wide flex items-center gap-1">
              OmniMind <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded-md font-mono">v2 font</span>
            </h1>
            <p className="text-[11px] text-slate-400">AI Assistant Engine</p>
          </div>
        </div>

        {/* Close Button - Mobile Only */}
        <button
          onClick={onCloseMobile}
          className="md:hidden p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" /> Start New Session
        </button>
      </div>

      {/* Model Selector Bar */}
      <div className="px-3 py-2">
        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 px-1">
          Active AI Engine
        </label>
        <div className="space-y-1">
          {AI_MODELS.map((m) => (
            <button
              key={m.id}
              onClick={() => onSelectModel(m.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                selectedModel === m.id
                  ? 'bg-slate-800 border border-slate-700 text-white font-medium'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className={`w-2 h-2 rounded-full ${m.iconColor}`} />
                <span className="truncate">{m.name}</span>
              </div>
              {m.badge && (
                <span className="text-[9px] px-1.5 py-0.5 bg-slate-700/60 text-slate-300 rounded font-mono">
                  {m.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Chats List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 px-1">
          Conversations ({sessions.length})
        </label>
        {sessions.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No chats yet. Start a new session above!
          </div>
        ) : (
          sessions.map((session) => {
            const isActive = session.id === activeSessionId;
            return (
              <div
                key={session.id}
                onClick={() => {
                  onSelectSession(session.id);
                  onCloseMobile();
                }}
                className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-xs transition-all ${
                  isActive
                    ? 'bg-slate-800 border border-slate-700 text-white font-medium'
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate pr-6">
                  <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                  <span className="truncate">{session.title || 'Untitled Conversation'}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition-opacity rounded"
                  title="Delete chat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Footer / Settings Trigger */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        <button
          onClick={onOpenSettings}
          className="w-full py-2 px-3 hover:bg-slate-800/80 rounded-xl text-slate-300 hover:text-white text-xs flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-slate-400" />
            <span className="font-medium">Settings & API Keys</span>
          </div>
          <Key className="w-3.5 h-3.5 text-slate-500" />
        </button>
      </div>
    </aside>
  );
};