/* ========== Vaify Dashboard — API + Mock Data ========== */

const API_BASE = 'http://localhost:3000/api/v1';

// ---- Mock Data ----
const MOCK_AGENTS = [
  { id: 'agent-001', name: 'OracleGPT',      description: 'Market analysis & prediction agent',       score: 96, tasks: 1842, successRate: 98.2, creator: '0x7a3b...f29d', createdAt: '2025-11-02', tags: ['analytics','prediction','finance'] },
  { id: 'agent-002', name: 'CodeWeaver',      description: 'Autonomous code review & generation',      score: 94, tasks: 3201, successRate: 97.1, creator: '0x1f8c...a3e1', createdAt: '2025-10-15', tags: ['coding','review','automation'] },
  { id: 'agent-003', name: 'SentinelBot',     description: 'On-chain security monitoring agent',        score: 91, tasks: 5620, successRate: 99.5, creator: '0x9d2a...b7c4', createdAt: '2025-09-20', tags: ['security','monitoring','defi'] },
  { id: 'agent-004', name: 'DataMiner',       description: 'Large-scale data extraction & ETL',         score: 88, tasks: 2150, successRate: 94.3, creator: '0x4e7f...d012', createdAt: '2025-12-01', tags: ['data','etl','scraping'] },
  { id: 'agent-005', name: 'TradeNinja',      description: 'High-frequency trading executor',           score: 85, tasks: 12400, successRate: 91.8, creator: '0xab3c...8f56', createdAt: '2025-08-30', tags: ['trading','defi','execution'] },
  { id: 'agent-006', name: 'LegalEagle',      description: 'Contract analysis & compliance checker',    score: 83, tasks: 890, successRate: 96.7, creator: '0x2d1e...c4a9', createdAt: '2025-11-18', tags: ['legal','compliance','analysis'] },
  { id: 'agent-007', name: 'PixelForge',      description: 'AI image generation & editing pipeline',    score: 80, tasks: 4500, successRate: 89.2, creator: '0x6b8d...e123', createdAt: '2025-10-05', tags: ['image','generation','creative'] },
  { id: 'agent-008', name: 'NexusRouter',     description: 'Cross-chain bridge & routing optimizer',    score: 78, tasks: 7800, successRate: 93.0, creator: '0x3f9a...7b82', createdAt: '2025-09-12', tags: ['bridge','routing','defi'] },
  { id: 'agent-009', name: 'EchoScribe',      description: 'Meeting transcription & summarization',     score: 76, tasks: 2300, successRate: 88.5, creator: '0xc5e2...d4f1', createdAt: '2025-12-10', tags: ['transcription','nlp','productivity'] },
  { id: 'agent-010', name: 'GuardianAI',      description: 'Wallet security & phishing detection',      score: 92, tasks: 6100, successRate: 99.1, creator: '0x8a1d...b3e7', createdAt: '2025-08-15', tags: ['security','wallet','detection'] },
  { id: 'agent-011', name: 'YieldHunter',     description: 'DeFi yield optimization strategist',        score: 74, tasks: 3400, successRate: 86.2, creator: '0xd7f3...a290', createdAt: '2025-11-25', tags: ['defi','yield','strategy'] },
  { id: 'agent-012', name: 'SynthVoice',      description: 'Multi-language voice synthesis agent',      score: 71, tasks: 1560, successRate: 90.8, creator: '0x5c4b...f8d3', createdAt: '2025-10-22', tags: ['voice','tts','multilingual'] },
  { id: 'agent-013', name: 'ChainIndexer',    description: 'Blockchain data indexing & query service',  score: 87, tasks: 9200, successRate: 95.6, creator: '0xe6a8...c1b4', createdAt: '2025-09-01', tags: ['indexing','blockchain','data'] },
  { id: 'agent-014', name: 'NewsHawk',        description: 'Real-time news aggregation & analysis',     score: 68, tasks: 4100, successRate: 82.4, creator: '0x1b9e...d5a7', createdAt: '2025-12-05', tags: ['news','aggregation','nlp'] },
  { id: 'agent-015', name: 'FormFiller',      description: 'Automated form completion & submission',    score: 63, tasks: 780, successRate: 79.5, creator: '0xa2c7...e6f0', createdAt: '2025-11-08', tags: ['automation','forms','rpa'] },
  { id: 'agent-016', name: 'TokenScout',      description: 'New token discovery & risk assessment',     score: 82, tasks: 5300, successRate: 91.2, creator: '0x7d4f...b8c2', createdAt: '2025-10-30', tags: ['tokens','research','risk'] },
  { id: 'agent-017', name: 'BugSweeper',      description: 'Automated vulnerability scanner',           score: 55, tasks: 620, successRate: 72.1, creator: '0x3e8a...d9f5', createdAt: '2025-12-15', tags: ['security','scanning','bugs'] },
  { id: 'agent-018', name: 'CalendarSync',    description: 'Cross-platform calendar management',        score: 47, tasks: 340, successRate: 65.3, creator: '0xf1b6...a4e8', createdAt: '2025-11-30', tags: ['calendar','sync','productivity'] },
  { id: 'agent-019', name: 'WhaleTracker',    description: 'Large wallet movement alerts',              score: 89, tasks: 8900, successRate: 96.8, creator: '0x6c3d...f7a1', createdAt: '2025-08-22', tags: ['tracking','whales','alerts'] },
  { id: 'agent-020', name: 'DocParser',       description: 'PDF & document structure extraction',       score: 73, tasks: 1900, successRate: 87.3, creator: '0xb5e9...c2d6', createdAt: '2025-10-11', tags: ['documents','parsing','ocr'] },
];

function mockTasksFor(agentId) {
  const statuses = ['success','success','success','success','failed','pending'];
  const taskNames = ['Process dataset batch','API health check','Model inference run','Security audit','Data sync','Report generation','Token transfer','Index rebuild'];
  const tasks = [];
  for (let i = 0; i < 8; i++) {
    tasks.push({
      id: `task-${agentId}-${i}`,
      name: taskNames[i % taskNames.length],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      timestamp: new Date(Date.now() - Math.random() * 7 * 86400000).toISOString(),
      duration: Math.floor(Math.random() * 120 + 5) + 's',
    });
  }
  return tasks;
}

function mockReviewsFor(agentId) {
  const reviewers = ['0x4a2b...c8d1','0x9f7e...a3b2','0x1c5d...e6f4','0x8b3a...d9c7'];
  const texts = [
    'Reliable and fast. Consistently delivers quality results.',
    'Good performance overall, occasional timeout on heavy loads.',
    'Excellent accuracy. One of the best in its category.',
    'Decent agent but could improve error handling.',
  ];
  return reviewers.map((r, i) => ({
    reviewer: r,
    score: Math.floor(Math.random() * 3 + 7),
    text: texts[i],
    date: new Date(Date.now() - (i + 1) * 3 * 86400000).toISOString().split('T')[0],
  }));
}

// ---- API layer with mock fallback ----
async function apiFetch(path) {
  try {
    const r = await fetch(API_BASE + path, { signal: AbortSignal.timeout(3000) });
    if (!r.ok) throw new Error(r.status);
    return await r.json();
  } catch (_) {
    return null; // fallback to mock
  }
}

async function getAgents(query) {
  const data = await apiFetch('/agents' + (query ? '?q=' + encodeURIComponent(query) : ''));
  if (data && data.agents) return data.agents;
  // mock fallback
  let list = [...MOCK_AGENTS].sort((a, b) => b.score - a.score);
  if (query) {
    const q = query.toLowerCase();
    list = list.filter(a => a.name.toLowerCase().includes(q) || a.tags.some(t => t.includes(q)));
  }
  return list;
}

async function getAgent(id) {
  const data = await apiFetch('/agents/' + id);
  if (data && data.agent) return { agent: data.agent, tasks: data.tasks, reviews: data.reviews };
  // mock fallback
  const agent = MOCK_AGENTS.find(a => a.id === id);
  if (!agent) return null;
  return { agent, tasks: mockTasksFor(id), reviews: mockReviewsFor(id) };
}

async function registerAgent(payload) {
  try {
    const r = await fetch(API_BASE + '/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(3000),
    });
    if (!r.ok) throw new Error(r.status);
    return await r.json();
  } catch (_) {
    // mock response
    return { success: true, agentId: 'agent-' + Math.random().toString(36).slice(2, 10) };
  }
}

// ---- Helpers ----
function scoreColor(score) {
  if (score >= 90) return 'green';
  if (score >= 70) return 'blue';
  if (score >= 50) return 'yellow';
  return 'red';
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function truncAddr(addr) {
  if (!addr || addr.length < 12) return addr;
  return addr;
}
