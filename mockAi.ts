import { AIModelId, Citation, Artifact, FileAttachment } from './types';

export const AI_MODELS = [
  {
    id: 'gpt-4o' as AIModelId,
    name: 'GPT-4o Omnimodal',
    provider: 'OpenAI',
    description: 'High-speed reasoning, coding, and vision capabilities',
    iconColor: 'bg-emerald-500',
    badge: 'Popular',
    supportsVision: true,
    supportsReasoning: false,
    contextWindow: '128k tokens'
  },
  {
    id: 'claude-3-5-sonnet' as AIModelId,
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    description: 'Unmatched coding precision, nuanced writing & artifact rendering',
    iconColor: 'bg-amber-500',
    badge: 'Best for Code',
    supportsVision: true,
    supportsReasoning: false,
    contextWindow: '200k tokens'
  },
  {
    id: 'deepseek-r1' as AIModelId,
    name: 'DeepSeek R1',
    provider: 'DeepSeek',
    description: 'Open-weights reasoning model with full step-by-step thinking breakdown',
    iconColor: 'bg-purple-500',
    badge: 'Reasoning',
    supportsVision: false,
    supportsReasoning: true,
    contextWindow: '64k tokens'
  },
  {
    id: 'gemini-1-5-pro' as AIModelId,
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    description: 'Massive 2M token context, deep cross-modal document analysis',
    iconColor: 'bg-blue-500',
    badge: '2M Context',
    supportsVision: true,
    supportsReasoning: false,
    contextWindow: '2,000k tokens'
  },
  {
    id: 'llama-3-3' as AIModelId,
    name: 'Llama 3.3 70B',
    provider: 'Meta / Open',
    description: 'Ultra-fast open source LLM optimized for conversational tasks',
    iconColor: 'bg-cyan-500',
    supportsVision: false,
    supportsReasoning: false,
    contextWindow: '128k tokens'
  }
];

export const DEFAULT_PERSONAS = [
  {
    id: 'general',
    name: 'Omni Generalist',
    description: 'Versatile, objective assistant for everyday queries',
    systemPrompt: 'You are OmniMind, a helpful, precise, and articulate AI assistant. Answer clearly with formatting, code snippets, and structured bullet points where helpful.',
    avatarIcon: 'Bot',
    category: 'general' as const
  },
  {
    id: 'architect',
    name: 'Senior Software Architect',
    description: 'Specialist in full-stack code, system design, performance & TypeScript',
    systemPrompt: 'You are a Principal Software Engineer & System Architect (15+ yrs experience). Provide production-grade, clean TypeScript/React code, architect patterns, error handling, and performance advice. Always output code inside standard markdown syntax block with language specified.',
    avatarIcon: 'Code',
    category: 'coding' as const
  },
  {
    id: 'writer',
    name: 'Creative Editor & Copywriter',
    description: 'Helps craft engaging copy, technical docs, blogs, and essays',
    systemPrompt: 'You are an elite copywriter and literary editor. Elevate text with clarity, compelling tone, captivating hooks, and impeccable grammar.',
    avatarIcon: 'Wand2',
    category: 'writing' as const
  },
  {
    id: 'analyst',
    name: 'Data & Financial Analyst',
    description: 'Synthesizes quantitative metrics, business strategy, and projections',
    systemPrompt: 'You are a Senior Strategic & Data Analyst. Break down complex problems step-by-step with structured tables, key takeaways, and quantitative logic.',
    avatarIcon: 'BrainCircuit',
    category: 'analysis' as const
  }
];

// Generator function to simulate real streaming response with optional thinking steps & web search
export async function* simulateStreamResponse(
  userPrompt: string,
  modelId: AIModelId,
  enableWebSearch: boolean,
  attachments: FileAttachment[] = []
): AsyncGenerator<{
  type: 'thinking' | 'search' | 'content' | 'citations' | 'artifact';
  payload: any;
}> {
  const promptLower = userPrompt.toLowerCase();

  // 1. Web Search Simulation step if enabled or asked about current events
  if (enableWebSearch || promptLower.includes('search') || promptLower.includes('latest') || promptLower.includes('news') || promptLower.includes('weather')) {
    yield {
      type: 'search',
      payload: { status: 'Searching global knowledge base & real-time indexes...' }
    };
    await new Promise((r) => setTimeout(r, 900));

    const mockCitations: Citation[] = [
      {
        title: 'TechCrunch: Latest Developments in Modern AI Architecture 2025',
        url: 'https://techcrunch.com/ai-updates-2025',
        snippet: 'DeepSeek R1 and Claude 3.5 Sonnet continue to dominate code benchmarks and autonomous execution tasks.'
      },
      {
        title: 'Official Documentation: Advanced Web Standards & Artifacts',
        url: 'https://developer.mozilla.org/en-US/docs/Web',
        snippet: 'Modern single-page applications leverage web workers, WebAssembly, and dynamic CSS grid structures.'
      },
      {
        title: 'GitHub Trends: Top React & AI Framework Repositories',
        url: 'https://github.com/trending',
        snippet: 'Developer ecosystem shifts toward ultra-fast modular client-side UI frameworks and lightweight LLM tools.'
      }
    ];

    yield {
      type: 'citations',
      payload: mockCitations
    };
  }

  // 2. Reasoning Process for DeepSeek R1 or deep reasoning
  if (modelId === 'deepseek-r1' || promptLower.includes('explain') || promptLower.includes('how to') || promptLower.includes('calculate')) {
    yield {
      type: 'thinking',
      payload: [
        '### Thinking Process:',
        '1. **Analyze user query**: Identify core requirements, technical parameters, and formatting expectations.',
        '2. **Deconstruct problem**: Check for constraints, edge cases, and architectural best practices.',
        '3. **Formulate response**: Organize into clean sections with code, structured tables, or visual artifacts if needed.',
        '4. **Self-Correction check**: Ensure code syntactical validity, modern ES2024 standards, and accessible UI markup.'
      ].join('\n')
    };
    await new Promise((r) => setTimeout(r, 1200));
  }

  // Detect if user asks for interactive code / artifact (e.g. game, dashboard, calculator, design, preview)
  const isArtifactRequest =
    promptLower.includes('component') ||
    promptLower.includes('dashboard') ||
    promptLower.includes('game') ||
    promptLower.includes('calculator') ||
    promptLower.includes('html') ||
    promptLower.includes('app') ||
    promptLower.includes('widget') ||
    promptLower.includes('chart') ||
    promptLower.includes('ui');

  let artifactToCreate: Artifact | null = null;

  if (isArtifactRequest) {
    if (promptLower.includes('game') || promptLower.includes('snake') || promptLower.includes('play')) {
      artifactToCreate = {
        id: 'art-' + Date.now(),
        title: 'Interactive Retro Arcade Snake Game',
        type: 'html',
        code: `<!DOCTYPE html>
<html>
<head>
<style>
  body { background: #0f172a; color: white; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
  canvas { border: 2px solid #3b82f6; border-radius: 8px; background: #020617; box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
  .score { font-size: 20px; margin-bottom: 12px; font-weight: bold; color: #60a5fa; }
  .btn { background: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; margin-top: 10px; }
  .btn:hover { background: #1d4ed8; }
</style>
</head>
<body>
  <div class="score">Score: <span id="score">0</span></div>
  <canvas id="gc" width="400" height="400"></canvas>
  <button class="btn" onclick="resetGame()">Restart Game</button>

<script>
let canvas, ctx;
let px=10, py=10;
let gs=20, tc=20;
let ax=15, ay=15;
let xv=0, yv=0;
let trail=[];
let tail = 4;
let score = 0;
let interval;

window.onload = function() {
    canvas = document.getElementById("gc");
    ctx = canvas.getContext("2d");
    document.addEventListener("keydown", keyPush);
    interval = setInterval(game, 1000/12);
}

function game() {
    px += xv;
    py += yv;
    if(px < 0) px = tc-1;
    if(px > tc-1) px = 0;
    if(py < 0) py = tc-1;
    if(py > tc-1) py = 0;

    ctx.fillStyle="#020617";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle="#3b82f6";
    for(let i=0; i<trail.length; i++) {
        ctx.fillRect(trail[i].x*gs, trail[i].y*gs, gs-2, gs-2);
        if(trail[i].x == px && trail[i].y == py && (xv !== 0 || yv !== 0)) {
            tail = 4;
            score = 0;
            document.getElementById("score").innerText = score;
        }
    }
    trail.push({x:px, y:py});
    while(trail.length > tail) {
        trail.shift();
    }

    if(ax == px && ay == py) {
        tail++;
        score += 10;
        document.getElementById("score").innerText = score;
        ax = Math.floor(Math.random()*tc);
        ay = Math.floor(Math.random()*tc);
    }

    ctx.fillStyle="#ef4444";
    ctx.fillRect(ax*gs, ay*gs, gs-2, gs-2);
}

function keyPush(evt) {
    switch(evt.keyCode) {
        case 37: if(xv!==1) {xv=-1;yv=0;} break;
        case 38: if(yv!==1) {xv=0;yv=-1;} break;
        case 39: if(xv!==-1) {xv=1;yv=0;} break;
        case 40: if(yv!==-1) {xv=0;yv=1;} break;
    }
}

function resetGame() {
    px=10; py=10; xv=0; yv=0; tail=4; score=0;
    document.getElementById("score").innerText = score;
}
</script>
</body>
</html>`
      };
    } else {
      artifactToCreate = {
        id: 'art-' + Date.now(),
        title: 'Modern Analytics Dashboard Concept',
        type: 'html',
        code: `<!DOCTYPE html>
<html>
<head>
<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-900 text-slate-100 p-6 font-sans">
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center justify-between border-b border-slate-800 pb-4">
      <div>
        <h1 class="text-2xl font-bold text-white">System Performance Insights</h1>
        <p class="text-sm text-slate-400">Real-time metrics & automated telemetry overview</p>
      </div>
      <span class="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold rounded-full flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Systems Operational
      </span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl">
        <div class="text-xs font-medium text-slate-400">Total API Requests</div>
        <div class="text-2xl font-extrabold text-white mt-1">2.84M</div>
        <div class="text-xs text-emerald-400 mt-2 font-medium">↑ +14.2% vs last week</div>
      </div>
      <div class="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl">
        <div class="text-xs font-medium text-slate-400">Avg Latency</div>
        <div class="text-2xl font-extrabold text-white mt-1">42ms</div>
        <div class="text-xs text-blue-400 mt-2 font-medium">⚡ Ultra low latency</div>
      </div>
      <div class="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl">
        <div class="text-xs font-medium text-slate-400">Accuracy Rate</div>
        <div class="text-2xl font-extrabold text-white mt-1">99.94%</div>
        <div class="text-xs text-purple-400 mt-2 font-medium">Verified by benchmark</div>
      </div>
    </div>

    <div class="bg-slate-800/60 border border-slate-700/50 p-5 rounded-xl">
      <h3 class="text-sm font-semibold text-slate-200 mb-3">Live Active Nodes</h3>
      <div class="space-y-3">
        <div>
          <div class="flex justify-between text-xs mb-1">
            <span>US-East GPU Cluster (H100)</span>
            <span class="text-slate-400">82% Load</span>
          </div>
          <div class="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
            <div class="bg-blue-500 h-full rounded-full" style="width: 82%"></div>
          </div>
        </div>
        <div>
          <div class="flex justify-between text-xs mb-1">
            <span>EU-Central Inference Hub</span>
            <span class="text-slate-400">45% Load</span>
          </div>
          <div class="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
            <div class="bg-emerald-500 h-full rounded-full" style="width: 45%"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`
      };
    }
  }

  // 3. Generate main text response
  let responseChunks: string[] = [];

  if (attachments.length > 0) {
    responseChunks.push(`I have received and analyzed **${attachments.length} attachment(s)**: \n`);
    attachments.forEach((att) => {
      responseChunks.push(`- 📄 **${att.name}** (${(att.size / 1024).toFixed(1)} KB) - Context parsed successfully.\n`);
    });
    responseChunks.push('\n---\n\n');
  }

  if (artifactToCreate) {
    responseChunks.push('Here is an interactive preview application I crafted for you. You can open and interact with it in the **Canvas Panel** on the right side of your screen!\n\n');
  }

  const modelName = AI_MODELS.find(m => m.id === modelId)?.name || 'AI';

  if (promptLower.includes('hello') || promptLower.includes('hi') || promptLower.includes('hey')) {
    responseChunks.push(`Hello! I'm **OmniMind**, powered by model **${modelName}**. How can I assist you with your projects, code, analysis, or creative tasks today?`);
  } else if (promptLower.includes('code') || promptLower.includes('function') || promptLower.includes('typescript') || promptLower.includes('react')) {
    responseChunks.push([
      'Here is a clean, production-ready solution implementing your request:',
      '',
      '```typescript',
      'interface DataProcessorConfig<T> {',
      '  endpoint: string;',
      '  timeoutMs?: number;',
      '  retryCount?: number;',
      '  onSuccess?: (data: T) => void;',
      '}',
      '',
      'export async function fetchAndTransform<T>(',
      '  config: DataProcessorConfig<T>',
      '): Promise<{ data: T | null; error: string | null }> {',
      '  const { endpoint, timeoutMs = 5000, retryCount = 3 } = config;',
      '  ',
      '  for (let attempt = 1; attempt <= retryCount; attempt++) {',
      '    try {',
      '      const controller = new AbortController();',
      '      const timer = setTimeout(() => controller.abort(), timeoutMs);',
      '      ',
      '      const response = await fetch(endpoint, { signal: controller.signal });',
      '      clearTimeout(timer);',
      '      ',
      '      if (!response.ok) {',
      '        throw new Error("HTTP error status: " + response.status);',
      '      }',
      '      ',
      '      const data = await response.json() as T;',
      '      config.onSuccess?.(data);',
      '      return { data, error: null };',
      '    } catch (err: any) {',
      '      if (attempt === retryCount) {',
      '        return { data: null, error: err?.message || "Unknown network error" };',
      '      }',
      '      // Exponential backoff',
      '      await new Promise(res => setTimeout(res, Math.pow(2, attempt) * 200));',
      '    }',
      '  }',
      '  return { data: null, error: "Max retries exceeded" };',
      '}',
      '```',
      '',
      '### Key Features:',
      '- **Type-safe generic interface** for any data schema `T`.',
      '- **Automatic timeout control** via `AbortController`.',
      '- **Exponential Backoff Retry logic** for high reliability in cloud environments.',
      '- **Error resilience** with failure handling.'
    ].join('\n'));
  } else {
    responseChunks.push([
      'Based on your input, here is a structured breakdown and solution:',
      '',
      '### 1. Executive Summary',
      'Your request highlights key objectives in modern workflow optimization. By applying structured reasoning and modular architecture, we achieve higher efficiency, maintainability, and clarity.',
      '',
      '### 2. Strategic Steps',
      '- **Analysis & Parsing**: Validating input streams and context boundaries.',
      '- **Architectural Design**: Utilizing reusable modules and state persistence patterns.',
      '- **Execution & Validation**: Automated checks and real-time response feedback loops.',
      '',
      '### 3. Key Takeaways',
      '1. **Speed & Flexibility**: Optimized streaming responses deliver near-zero latency.',
      '2. **Context Persistence**: History and session memory remain safe across browser sessions.',
      '3. **Multi-Model Intelligence**: Effortlessly swap AI providers depending on task requirements (e.g. DeepSeek for complex logic, Claude for code generation).',
      '',
      'Let me know if you would like me to expand on any specific section or generate further code or diagrams!'
    ].join('\n'));
  }

  const fullContent = responseChunks.join('');
  const words = fullContent.split(' ');

  // Stream word by word for realistic streaming feel
  for (let i = 0; i < words.length; i++) {
    const chunk = words[i] + (i < words.length - 1 ? ' ' : '');
    yield {
      type: 'content',
      payload: chunk
    };
    await new Promise((r) => setTimeout(r, 20 + Math.random() * 25));
  }

  if (artifactToCreate) {
    yield {
      type: 'artifact',
      payload: artifactToCreate
    };
  }
}