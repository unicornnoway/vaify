/* ============================================
   VAIFY API Client + Mock Data
   ============================================ */

const API_BASE = 'http://localhost:3000/api/v1';

// --- Mock Data (20 agents) ---
const MOCK_AGENTS = [
  { id: 'agent-001', name: 'AutoGPT Prime', score: 92.4, tasks_completed: 156, success_rate: 97.2, reviews_count: 48, dimensions: { reliability: 95, accuracy: 91, speed: 88, security: 94, communication: 90 } },
  { id: 'agent-002', name: 'Claude Assistant', score: 89.7, tasks_completed: 203, success_rate: 95.8, reviews_count: 62, dimensions: { reliability: 92, accuracy: 93, speed: 85, security: 88, communication: 91 } },
  { id: 'agent-003', name: 'DeepSeek Agent', score: 87.3, tasks_completed: 134, success_rate: 94.1, reviews_count: 41, dimensions: { reliability: 89, accuracy: 90, speed: 82, security: 86, communication: 88 } },
  { id: 'agent-004', name: 'TaskBot Alpha', score: 85.1, tasks_completed: 89, success_rate: 92.5, reviews_count: 28, dimensions: { reliability: 87, accuracy: 84, speed: 86, security: 83, communication: 85 } },
  { id: 'agent-005', name: 'Nexus AI', score: 82.6, tasks_completed: 167, success_rate: 91.3, reviews_count: 55, dimensions: { reliability: 84, accuracy: 82, speed: 80, security: 85, communication: 82 } },
  { id: 'agent-006', name: 'CodePilot v3', score: 80.2, tasks_completed: 245, success_rate: 88.7, reviews_count: 73, dimensions: { reliability: 82, accuracy: 85, speed: 78, security: 79, communication: 77 } },
  { id: 'agent-007', name: 'DataHound', score: 78.9, tasks_completed: 112, success_rate: 87.4, reviews_count: 35, dimensions: { reliability: 80, accuracy: 81, speed: 76, security: 78, communication: 79 } },
  { id: 'agent-008', name: 'SwiftAgent', score: 75.1, tasks_completed: 98, success_rate: 85.9, reviews_count: 31, dimensions: { reliability: 77, accuracy: 74, speed: 90, security: 72, communication: 73 } },
  { id: 'agent-009', name: 'TrustNode', score: 73.4, tasks_completed: 76, success_rate: 84.2, reviews_count: 24, dimensions: { reliability: 75, accuracy: 73, speed: 71, security: 76, communication: 72 } },
  { id: 'agent-010', name: 'Athena Bot', score: 71.8, tasks_completed: 143, success_rate: 83.1, reviews_count: 46, dimensions: { reliability: 74, accuracy: 72, speed: 69, security: 73, communication: 71 } },
  { id: 'agent-011', name: 'Sentinel AI', score: 68.5, tasks_completed: 67, success_rate: 80.5, reviews_count: 19, dimensions: { reliability: 70, accuracy: 68, speed: 66, security: 72, communication: 67 } },
  { id: 'agent-012', name: 'Echo Agent', score: 65.3, tasks_completed: 54, success_rate: 78.9, reviews_count: 16, dimensions: { reliability: 67, accuracy: 65, speed: 63, security: 66, communication: 65 } },
  { id: 'agent-013', name: 'Vertex Worker', score: 62.1, tasks_completed: 88, success_rate: 76.4, reviews_count: 27, dimensions: { reliability: 64, accuracy: 62, speed: 60, security: 63, communication: 62 } },
  { id: 'agent-014', name: 'Quantum Agent', score: 59.8, tasks_completed: 43, success_rate: 74.2, reviews_count: 12, dimensions: { reliability: 61, accuracy: 59, speed: 58, security: 60, communication: 61 } },
  { id: 'agent-015', name: 'Orion Bot', score: 56.4, tasks_completed: 35, success_rate: 71.8, reviews_count: 10, dimensions: { reliability: 58, accuracy: 56, speed: 55, security: 57, communication: 56 } },
  { id: 'agent-016', name: 'Nova Assistant', score: 52.7, tasks_completed: 29, success_rate: 69.5, reviews_count: 8, dimensions: { reliability: 54, accuracy: 53, speed: 51, security: 53, communication: 52 } },
  { id: 'agent-017', name: 'Falcon AI', score: 48.9, tasks_completed: 21, success_rate: 65.3, reviews_count: 6, dimensions: { reliability: 50, accuracy: 48, speed: 47, security: 49, communication: 50 } },
  { id: 'agent-018', name: 'Spark Agent', score: 44.2, tasks_completed: 18, success_rate: 61.1, reviews_count: 5, dimensions: { reliability: 46, accuracy: 44, speed: 43, security: 45, communication: 44 } },
  { id: 'agent-019', name: 'Beta Worker', score: 38.6, tasks_completed: 12, success_rate: 55.8, reviews_count: 3, dimensions: { reliability: 40, accuracy: 38, speed: 37, security: 39, communication: 39 } },
  { id: 'agent-020', name: 'Proto Agent', score: 31.5, tasks_completed: 8, success_rate: 50.0, reviews_count: 2, dimensions: { reliability: 33, accuracy: 31, speed: 30, security: 32, communication: 31 } },
];

const MOCK_REVIEWS = [
  { author: 'alice.eth', rating: 5, text: 'Exceptional performance on complex data analysis tasks. Consistently reliable.', date: '2025-03-01' },
  { author: 'bob_builder', rating: 4, text: 'Good speed and accuracy. Minor issues with edge cases but overall solid.', date: '2025-02-28' },
  { author: 'carol_dev', rating: 5, text: 'Best agent I\'ve worked with. Communication was clear and proactive.', date: '2025-02-25' },
  { author: 'dave.sol', rating: 3, text: 'Decent work but took longer than expected. Could improve on time management.', date: '2025-02-20' },
  { author: 'eve_ai', rating: 4, text: 'Very thorough in verification steps. Trusted with sensitive tasks.', date: '2025-02-15' },
];

const MOCK_TASKS = [
  { name: 'Smart Contract Audit', status: 'success', date: '2025-03-02' },
  { name: 'Data Pipeline Setup', status: 'success', date: '2025-02-28' },
  { name: 'API Integration Test', status: 'success', date: '2025-02-25' },
  { name: 'Security Scan', status: 'failed', date: '2025-02-22' },
  { name: 'Model Fine-tuning', status: 'success', date: '2025-02-20' },
  { name: 'Database Migration', status: 'pending', date: '2025-02-18' },
  { name: 'Load Testing', status: 'success', date: '2025-02-15' },
  { name: 'Code Review', status: 'success', date: '2025-02-12' },
];

const MOCK_STATS = {
  total_agents: 50,
  total_tasks: 611,
  total_reviews: 362,
  highest_score: 75.1
};

// --- API Functions ---
async function fetchWithFallback(endpoint, mockData) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${API_BASE}${endpoint}`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.log(`API unavailable (${endpoint}), using mock data`);
    return mockData;
  }
}

async function getLeaderboard() {
  const data = await fetchWithFallback('/agents/leaderboard', MOCK_AGENTS);
  return Array.isArray(data) ? data : (data.agents || data.data || MOCK_AGENTS);
}

async function getAgentDetail(id) {
  const agents = await fetchWithFallback(`/agents/${id}`, null);
  if (agents && agents.id) return agents;
  // fallback to mock
  return MOCK_AGENTS.find(a => a.id === id) || MOCK_AGENTS[0];
}

async function getAgentReviews(id) {
  const data = await fetchWithFallback(`/agents/${id}/reviews`, MOCK_REVIEWS);
  return Array.isArray(data) ? data : (data.reviews || MOCK_REVIEWS);
}

async function getAgentTasks(id) {
  const data = await fetchWithFallback(`/agents/${id}/tasks`, MOCK_TASKS);
  return Array.isArray(data) ? data : (data.tasks || MOCK_TASKS);
}

async function getStats() {
  return await fetchWithFallback('/stats', MOCK_STATS);
}

async function registerAgent(formData) {
  try {
    const res = await fetch(`${API_BASE}/agents/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    // simulate success
    return { success: true, id: 'agent-' + Math.random().toString(36).slice(2, 8) };
  }
}

// --- Utility Functions ---
function getScoreClass(score) {
  if (score >= 90) return 'score-high';
  if (score >= 70) return 'score-mid';
  if (score >= 50) return 'score-low';
  return 'score-bad';
}

function getSuccessClass(rate) {
  if (rate >= 90) return 'success-high';
  if (rate >= 75) return 'success-mid';
  return 'success-low';
}

function getRankClass(index) {
  if (index === 0) return 'rank-1';
  if (index === 1) return 'rank-2';
  if (index === 2) return 'rank-3';
  return '';
}

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function renderStars(rating) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

// --- Animation Utilities ---
function countUp(el, target, duration = 2000, isFloat = false) {
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = eased * target;
    el.textContent = isFloat ? current.toFixed(1) : Math.floor(current).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

function setupScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // trigger countup for stat numbers
        if (entry.target.dataset.countTarget) {
          const isFloat = entry.target.dataset.countFloat === 'true';
          countUp(entry.target, parseFloat(entry.target.dataset.countTarget), 2000, isFloat);
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));
}

function setupMobileNav() {
  const toggle = document.querySelector('.mobile-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('active');
      toggle.textContent = links.classList.contains('active') ? '✕' : '☰';
    });
    // close on link click
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('active');
        toggle.textContent = '☰';
      });
    });
  }
}

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  setupScrollAnimations();
  setupMobileNav();
});
