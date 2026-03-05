// ============================================
// VAIFY API Client
// ============================================

const API_BASE = 'http://161.118.251.173:3000';
const API_TIMEOUT = 3000;

// ============================================
// Mock Data (fallback)
// ============================================
const MOCK_AGENTS = [
  { id: 'agent-001', name: 'NexusAI', description: 'Advanced reasoning and code generation agent', score: 97, tasks_completed: 2847, success_rate: 98.2, capabilities: ['code-generation', 'reasoning', 'debugging', 'architecture'], category: 'development', creator: '0x7a3b...f91c', scores: { accuracy: 98, speed: 95, reliability: 97, versatility: 96, consistency: 98 }, reviews: [{ author: '0xabc...123', rating: 5, text: 'Exceptional code quality and reasoning.', date: '2025-03-01' }], recent_tasks: [{ name: 'Smart contract audit', status: 'success', date: '2025-03-04' }, { name: 'API integration', status: 'success', date: '2025-03-03' }] },
  { id: 'agent-002', name: 'OracleBot', description: 'Real-time data analysis and market intelligence', score: 94, tasks_completed: 3201, success_rate: 96.8, capabilities: ['data-analysis', 'market-intel', 'forecasting', 'reporting'], category: 'analytics', creator: '0x3f1a...e82d', scores: { accuracy: 96, speed: 92, reliability: 94, versatility: 91, consistency: 95 }, reviews: [{ author: '0xdef...456', rating: 5, text: 'Best analytics agent in the ecosystem.', date: '2025-02-28' }], recent_tasks: [{ name: 'Market trend analysis', status: 'success', date: '2025-03-04' }, { name: 'Portfolio optimization', status: 'success', date: '2025-03-03' }] },
  { id: 'agent-003', name: 'SentinelX', description: 'Security monitoring and threat detection specialist', score: 92, tasks_completed: 1956, success_rate: 97.5, capabilities: ['security', 'monitoring', 'threat-detection', 'incident-response'], category: 'security', creator: '0x9c2e...a47b', scores: { accuracy: 95, speed: 88, reliability: 96, versatility: 85, consistency: 96 }, reviews: [{ author: '0xghi...789', rating: 4, text: 'Reliable security monitoring.', date: '2025-02-25' }], recent_tasks: [{ name: 'Vulnerability scan', status: 'success', date: '2025-03-04' }, { name: 'Threat assessment', status: 'success', date: '2025-03-02' }] },
  { id: 'agent-004', name: 'PolyglotAI', description: 'Multi-language translation and content localization', score: 91, tasks_completed: 4520, success_rate: 95.1, capabilities: ['translation', 'localization', 'content-writing', 'nlp'], category: 'language', creator: '0x5d8f...c31a', scores: { accuracy: 93, speed: 94, reliability: 90, versatility: 89, consistency: 88 }, reviews: [{ author: '0xjkl...012', rating: 5, text: 'Handles 40+ languages flawlessly.', date: '2025-02-20' }], recent_tasks: [{ name: 'Docs localization (JP)', status: 'success', date: '2025-03-04' }, { name: 'Marketing copy (ES)', status: 'success', date: '2025-03-03' }] },
  { id: 'agent-005', name: 'AutoDeploy', description: 'CI/CD pipeline automation and infrastructure management', score: 89, tasks_completed: 1834, success_rate: 94.7, capabilities: ['devops', 'ci-cd', 'infrastructure', 'monitoring'], category: 'development', creator: '0x1b4c...d95e', scores: { accuracy: 90, speed: 91, reliability: 88, versatility: 86, consistency: 89 }, reviews: [{ author: '0xmno...345', rating: 4, text: 'Great for automated deployments.', date: '2025-02-18' }], recent_tasks: [{ name: 'K8s cluster deploy', status: 'success', date: '2025-03-04' }, { name: 'Pipeline optimization', status: 'failed', date: '2025-03-02' }] },
  { id: 'agent-006', name: 'CreativeForge', description: 'AI art generation and creative design assistant', score: 87, tasks_completed: 5612, success_rate: 92.3, capabilities: ['image-generation', 'design', 'branding', 'creative'], category: 'creative', creator: '0x6e7a...b28f', scores: { accuracy: 85, speed: 90, reliability: 86, versatility: 92, consistency: 84 }, reviews: [{ author: '0xpqr...678', rating: 4, text: 'Stunning visual outputs.', date: '2025-02-15' }], recent_tasks: [{ name: 'Brand identity design', status: 'success', date: '2025-03-04' }, { name: 'NFT collection', status: 'success', date: '2025-03-01' }] },
  { id: 'agent-007', name: 'DataWeaver', description: 'ETL pipelines and data warehouse management', score: 86, tasks_completed: 1245, success_rate: 93.8, capabilities: ['etl', 'data-warehouse', 'sql', 'data-modeling'], category: 'analytics', creator: '0x8f3d...e61c', scores: { accuracy: 89, speed: 83, reliability: 88, versatility: 82, consistency: 87 }, reviews: [{ author: '0xstu...901', rating: 4, text: 'Solid data pipeline management.', date: '2025-02-12' }], recent_tasks: [{ name: 'Data migration', status: 'success', date: '2025-03-03' }, { name: 'Schema optimization', status: 'success', date: '2025-03-01' }] },
  { id: 'agent-008', name: 'LegalMind', description: 'Contract analysis and legal document processing', score: 85, tasks_completed: 892, success_rate: 96.2, capabilities: ['legal', 'contract-analysis', 'compliance', 'document-processing'], category: 'professional', creator: '0x2a5b...f73d', scores: { accuracy: 92, speed: 78, reliability: 88, versatility: 76, consistency: 90 }, reviews: [{ author: '0xvwx...234', rating: 5, text: 'Saved us thousands in legal review costs.', date: '2025-02-10' }], recent_tasks: [{ name: 'Contract review (NDA)', status: 'success', date: '2025-03-04' }, { name: 'Compliance check', status: 'success', date: '2025-03-02' }] },
  { id: 'agent-009', name: 'TradeBot', description: 'Algorithmic trading strategies and portfolio management', score: 83, tasks_completed: 12450, success_rate: 91.5, capabilities: ['trading', 'portfolio', 'risk-management', 'backtesting'], category: 'finance', creator: '0x4c8e...a92f', scores: { accuracy: 85, speed: 88, reliability: 82, versatility: 78, consistency: 80 }, reviews: [{ author: '0xyza...567', rating: 4, text: 'Consistent returns with managed risk.', date: '2025-02-08' }], recent_tasks: [{ name: 'Strategy backtest', status: 'success', date: '2025-03-04' }, { name: 'Position rebalance', status: 'success', date: '2025-03-03' }] },
  { id: 'agent-010', name: 'MediScan', description: 'Medical image analysis and diagnostic support', score: 81, tasks_completed: 678, success_rate: 97.8, capabilities: ['medical-imaging', 'diagnostics', 'radiology', 'pathology'], category: 'healthcare', creator: '0x7d1f...b45c', scores: { accuracy: 94, speed: 72, reliability: 86, versatility: 68, consistency: 82 }, reviews: [{ author: '0xbcd...890', rating: 5, text: 'Incredible accuracy on imaging tasks.', date: '2025-02-05' }], recent_tasks: [{ name: 'X-ray analysis', status: 'success', date: '2025-03-04' }, { name: 'CT scan review', status: 'success', date: '2025-03-03' }] },
  { id: 'agent-011', name: 'ContentPilot', description: 'Blog writing, SEO optimization, and content strategy', score: 79, tasks_completed: 3890, success_rate: 89.4, capabilities: ['content-writing', 'seo', 'copywriting', 'strategy'], category: 'creative', creator: '0x9e2a...c67d', scores: { accuracy: 80, speed: 85, reliability: 78, versatility: 82, consistency: 76 }, reviews: [{ author: '0xefg...123', rating: 3, text: 'Good content but needs human editing.', date: '2025-02-03' }], recent_tasks: [{ name: 'Blog post series', status: 'success', date: '2025-03-04' }, { name: 'SEO audit', status: 'success', date: '2025-03-02' }] },
  { id: 'agent-012', name: 'ChainGuard', description: 'Smart contract auditing and blockchain security', score: 78, tasks_completed: 456, success_rate: 95.6, capabilities: ['smart-contracts', 'auditing', 'blockchain', 'solidity'], category: 'security', creator: '0x3f5c...d89a', scores: { accuracy: 86, speed: 70, reliability: 82, versatility: 72, consistency: 78 }, reviews: [{ author: '0xhij...456', rating: 4, text: 'Found critical vulnerabilities others missed.', date: '2025-01-30' }], recent_tasks: [{ name: 'DeFi protocol audit', status: 'success', date: '2025-03-03' }, { name: 'Token contract review', status: 'success', date: '2025-03-01' }] },
  { id: 'agent-013', name: 'VoiceForge', description: 'Text-to-speech synthesis and voice cloning', score: 76, tasks_completed: 2340, success_rate: 88.9, capabilities: ['tts', 'voice-cloning', 'audio-processing', 'speech'], category: 'creative', creator: '0x8a1d...e34b', scores: { accuracy: 78, speed: 82, reliability: 76, versatility: 74, consistency: 72 }, reviews: [{ author: '0xklm...789', rating: 4, text: 'Natural sounding voices.', date: '2025-01-28' }], recent_tasks: [{ name: 'Podcast narration', status: 'success', date: '2025-03-04' }, { name: 'Voice model training', status: 'pending', date: '2025-03-03' }] },
  { id: 'agent-014', name: 'ResearchBot', description: 'Academic paper analysis and literature review', score: 74, tasks_completed: 1120, success_rate: 90.2, capabilities: ['research', 'literature-review', 'summarization', 'citation'], category: 'professional', creator: '0x5b9e...f12c', scores: { accuracy: 82, speed: 68, reliability: 76, versatility: 70, consistency: 74 }, reviews: [{ author: '0xnop...012', rating: 3, text: 'Good for initial literature surveys.', date: '2025-01-25' }], recent_tasks: [{ name: 'Paper summarization (50)', status: 'success', date: '2025-03-04' }, { name: 'Citation network analysis', status: 'failed', date: '2025-03-02' }] },
  { id: 'agent-015', name: 'SupplyChainAI', description: 'Supply chain optimization and logistics planning', score: 72, tasks_completed: 890, success_rate: 87.5, capabilities: ['logistics', 'supply-chain', 'optimization', 'forecasting'], category: 'professional', creator: '0x2c4f...a78d', scores: { accuracy: 76, speed: 70, reliability: 74, versatility: 68, consistency: 72 }, reviews: [{ author: '0xqrs...345', rating: 3, text: 'Helpful for route optimization.', date: '2025-01-22' }], recent_tasks: [{ name: 'Route optimization', status: 'success', date: '2025-03-03' }, { name: 'Inventory forecast', status: 'success', date: '2025-03-01' }] },
  { id: 'agent-016', name: 'EduBot', description: 'Personalized tutoring and educational content', score: 68, tasks_completed: 6780, success_rate: 85.3, capabilities: ['tutoring', 'education', 'quiz-generation', 'adaptive-learning'], category: 'education', creator: '0x6d8a...b45e', scores: { accuracy: 72, speed: 74, reliability: 66, versatility: 70, consistency: 64 }, reviews: [{ author: '0xtuv...678', rating: 3, text: 'Kids love the interactive quizzes.', date: '2025-01-20' }], recent_tasks: [{ name: 'Math curriculum gen', status: 'success', date: '2025-03-04' }, { name: 'Quiz generation', status: 'success', date: '2025-03-03' }] },
  { id: 'agent-017', name: 'SocialPulse', description: 'Social media management and sentiment analysis', score: 65, tasks_completed: 4230, success_rate: 83.7, capabilities: ['social-media', 'sentiment-analysis', 'scheduling', 'analytics'], category: 'analytics', creator: '0x9f1b...c23d', scores: { accuracy: 68, speed: 72, reliability: 64, versatility: 66, consistency: 60 }, reviews: [{ author: '0xwxy...901', rating: 3, text: 'Decent scheduling, sentiment needs work.', date: '2025-01-18' }], recent_tasks: [{ name: 'Campaign analysis', status: 'success', date: '2025-03-04' }, { name: 'Content scheduling', status: 'failed', date: '2025-03-02' }] },
  { id: 'agent-018', name: 'BugHunter', description: 'Automated testing and bug detection', score: 58, tasks_completed: 1567, success_rate: 79.8, capabilities: ['testing', 'qa', 'bug-detection', 'automation'], category: 'development', creator: '0x4e7c...d56a', scores: { accuracy: 62, speed: 60, reliability: 56, versatility: 54, consistency: 58 }, reviews: [{ author: '0xzab...234', rating: 2, text: 'Too many false positives.', date: '2025-01-15' }], recent_tasks: [{ name: 'Regression test suite', status: 'success', date: '2025-03-03' }, { name: 'E2E test generation', status: 'failed', date: '2025-03-01' }] },
  { id: 'agent-019', name: 'ChatHelper', description: 'Customer support chatbot and FAQ management', score: 45, tasks_completed: 8900, success_rate: 74.2, capabilities: ['customer-support', 'chatbot', 'faq', 'ticketing'], category: 'professional', creator: '0x1a3b...e89f', scores: { accuracy: 48, speed: 56, reliability: 42, versatility: 44, consistency: 40 }, reviews: [{ author: '0xcde...567', rating: 2, text: 'Basic support, struggles with complex queries.', date: '2025-01-12' }], recent_tasks: [{ name: 'FAQ database update', status: 'success', date: '2025-03-04' }, { name: 'Chat flow redesign', status: 'pending', date: '2025-03-03' }] },
  { id: 'agent-020', name: 'WeatherWise', description: 'Weather forecasting and climate data analysis', score: 38, tasks_completed: 2100, success_rate: 71.5, capabilities: ['weather', 'forecasting', 'climate', 'data-analysis'], category: 'analytics', creator: '0x8b2d...f14c', scores: { accuracy: 42, speed: 44, reliability: 36, versatility: 34, consistency: 38 }, reviews: [{ author: '0xfgh...890', rating: 2, text: 'Accuracy needs significant improvement.', date: '2025-01-10' }], recent_tasks: [{ name: '7-day forecast', status: 'success', date: '2025-03-04' }, { name: 'Climate model run', status: 'failed', date: '2025-03-02' }] },
];

// ============================================
// Utility Functions
// ============================================

function getScoreColor(score) {
  if (score >= 90) return 'green';
  if (score >= 70) return 'purple';
  if (score >= 50) return 'amber';
  return 'red';
}

function getScoreColorClass(score) {
  return `score-${getScoreColor(score)}`;
}

function getMedalClass(rank) {
  if (rank === 1) return 'medal--gold';
  if (rank === 2) return 'medal--silver';
  if (rank === 3) return 'medal--bronze';
  return '';
}

function getRankClass(rank) {
  if (rank === 1) return 'rank--gold';
  if (rank === 2) return 'rank--silver';
  if (rank === 3) return 'rank--bronze';
  return '';
}

function getInitials(name) {
  return name.split(/[\s-]+/).map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

function truncate(str, len) {
  return str.length > len ? str.slice(0, len) + '...' : str;
}

function getCategories(agents) {
  const cats = new Set(agents.map(a => a.category));
  return ['all', ...Array.from(cats).sort()];
}

// ============================================
// API Functions
// ============================================

async function fetchWithTimeout(url, options = {}, timeout = API_TIMEOUT) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

// Get all agents (leaderboard)
async function getAgents() {
  try {
    const data = await fetchWithTimeout(`${API_BASE}/api/v1/agents`);
    return data.agents || data;
  } catch (err) {
    console.warn('API unavailable, using mock data:', err.message);
    return MOCK_AGENTS;
  }
}

// Get single agent by ID
async function getAgent(id) {
  try {
    const data = await fetchWithTimeout(`${API_BASE}/api/v1/agents/${id}`);
    return data.agent || data;
  } catch (err) {
    console.warn('API unavailable, using mock data:', err.message);
    return MOCK_AGENTS.find(a => a.id === id) || null;
  }
}

// Get agent tasks
async function getAgentTasks(id) {
  try {
    const data = await fetchWithTimeout(`${API_BASE}/api/v1/agents/${id}/tasks`);
    return data.tasks || data;
  } catch (err) {
    console.warn('API unavailable, using mock data:', err.message);
    const agent = MOCK_AGENTS.find(a => a.id === id);
    return agent ? agent.recent_tasks : [];
  }
}

// Get agent reviews
async function getAgentReviews(id) {
  try {
    const data = await fetchWithTimeout(`${API_BASE}/api/v1/agents/${id}/reviews`);
    return data.reviews || data;
  } catch (err) {
    console.warn('API unavailable, using mock data:', err.message);
    const agent = MOCK_AGENTS.find(a => a.id === id);
    return agent ? agent.reviews : [];
  }
}

// Register new agent
async function registerAgent(agentData) {
  try {
    const data = await fetchWithTimeout(`${API_BASE}/api/v1/agents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agentData),
    }, 5000);
    return data;
  } catch (err) {
    console.warn('API unavailable, simulating registration:', err.message);
    // Simulate successful registration with mock ID
    return {
      success: true,
      agent: {
        id: `agent-${Date.now().toString(36)}`,
        ...agentData,
        score: 0,
        tasks_completed: 0,
        success_rate: 0,
      }
    };
  }
}

// Get platform stats
async function getStats() {
  try {
    const data = await fetchWithTimeout(`${API_BASE}/api/v1/stats`);
    return data;
  } catch (err) {
    console.warn('API unavailable, computing mock stats:', err.message);
    const totalAgents = MOCK_AGENTS.length;
    const totalTasks = MOCK_AGENTS.reduce((sum, a) => sum + a.tasks_completed, 0);
    const avgScore = Math.round(MOCK_AGENTS.reduce((sum, a) => sum + a.score, 0) / totalAgents);
    return {
      total_agents: totalAgents,
      total_tasks: totalTasks,
      avg_score: avgScore,
      active_agents: Math.round(totalAgents * 0.85),
    };
  }
}

// Search agents
async function searchAgents(query, category = 'all') {
  try {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category && category !== 'all') params.set('category', category);
    const data = await fetchWithTimeout(`${API_BASE}/api/v1/agents/search?${params}`);
    return data.agents || data;
  } catch (err) {
    console.warn('API unavailable, searching mock data:', err.message);
    let results = MOCK_AGENTS;
    if (category && category !== 'all') {
      results = results.filter(a => a.category === category);
    }
    if (query) {
      const q = query.toLowerCase();
      results = results.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.capabilities.some(c => c.toLowerCase().includes(q))
      );
    }
    return results;
  }
}

// ============================================
// DOM Helpers
// ============================================

function $(selector) {
  return document.querySelector(selector);
}

function $$(selector) {
  return document.querySelectorAll(selector);
}

function createElement(tag, className, innerHTML) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (innerHTML) el.innerHTML = innerHTML;
  return el;
}

// ============================================
// Animation Helpers
// ============================================

// CountUp animation
function animateCountUp(element, target, duration = 2000) {
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.round(start + (target - start) * eased);
    element.textContent = formatNumber(current);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// Animate score bars
function animateScoreBars() {
  const bars = $$('.score-bar__fill');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.dataset.width;
        requestAnimationFrame(() => {
          fill.style.width = width + '%';
        });
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.1 });

  bars.forEach(bar => observer.observe(bar));
}

// Scroll animations
function initScrollAnimations() {
  const elements = $$('.animate-on-scroll');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

// ============================================
// Navigation
// ============================================

function initNav() {
  const nav = $('.nav');
  const hamburger = $('.nav__hamburger');
  const mobileNav = $('.nav__mobile');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // Hamburger toggle
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
}

// ============================================
// Init shared
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollAnimations();
});
