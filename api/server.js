const express = require('express');
const cors = require('cors');
const path = require('path');
const { getDb, initDb } = require('./db');
const { calculateScore } = require('./scoring');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve dashboard
app.use(express.static(path.join(__dirname, '..', 'dashboard')));

// ─── POST /api/v1/agents ─── Register agent
app.post('/api/v1/agents', (req, res) => {
  const { name, description, capabilities, creator_address } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });

  const db = getDb();
  try {
    const caps = JSON.stringify(capabilities || []);
    const result = db.prepare(
      'INSERT INTO agents (name, description, capabilities, creator_address) VALUES (?, ?, ?, ?)'
    ).run(name, description || '', caps, creator_address || '');

    const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(agent);
  } finally {
    db.close();
  }
});

// ─── GET /api/v1/agents/:id ─── Get agent with score
app.get('/api/v1/agents/:id', (req, res) => {
  const db = getDb();
  try {
    const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(req.params.id);
    if (!agent) return res.status(404).json({ error: 'Agent not found' });

    const score = calculateScore(agent.id);
    const taskCount = db.prepare('SELECT COUNT(*) as count FROM tasks WHERE executor_id = ?').get(agent.id);
    const reviewCount = db.prepare('SELECT COUNT(*) as count FROM reviews WHERE target_id = ?').get(agent.id);

    res.json({
      ...agent,
      capabilities: JSON.parse(agent.capabilities || '[]'),
      score_breakdown: score,
      task_count: taskCount.count,
      review_count: reviewCount.count
    });
  } finally {
    db.close();
  }
});

// ─── POST /api/v1/tasks ─── Report task result
app.post('/api/v1/tasks', (req, res) => {
  const { requester_id, executor_id, task_type, status, duration_ms } = req.body;
  if (!requester_id || !executor_id || !task_type || !status) {
    return res.status(400).json({ error: 'requester_id, executor_id, task_type, status are required' });
  }

  const db = getDb();
  try {
    const result = db.prepare(
      'INSERT INTO tasks (requester_id, executor_id, task_type, status, duration_ms) VALUES (?, ?, ?, ?, ?)'
    ).run(requester_id, executor_id, task_type, status, duration_ms || 0);

    // Recalculate executor score
    calculateScore(executor_id);

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(task);
  } finally {
    db.close();
  }
});

// ─── POST /api/v1/reviews ─── Submit review
app.post('/api/v1/reviews', (req, res) => {
  const { task_id, target_id, rating, comment } = req.body;
  if (!task_id || !target_id || !rating) {
    return res.status(400).json({ error: 'task_id, target_id, rating are required' });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'rating must be 1-5' });
  }

  const db = getDb();
  try {
    // Get reviewer from task
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(task_id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const reviewer_id = task.requester_id === target_id ? task.executor_id : task.requester_id;

    const result = db.prepare(
      'INSERT INTO reviews (task_id, reviewer_id, target_id, rating, comment) VALUES (?, ?, ?, ?, ?)'
    ).run(task_id, reviewer_id, target_id, rating, comment || '');

    calculateScore(target_id);

    const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(review);
  } finally {
    db.close();
  }
});

// ─── GET /api/v1/leaderboard ─── Leaderboard
app.get('/api/v1/leaderboard', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const category = req.query.category;

  const db = getDb();
  try {
    let agents;
    if (category) {
      agents = db.prepare(
        `SELECT * FROM agents WHERE capabilities LIKE ? ORDER BY reputation_score DESC LIMIT ?`
      ).all(`%${category}%`, limit);
    } else {
      agents = db.prepare(
        'SELECT * FROM agents ORDER BY reputation_score DESC LIMIT ?'
      ).all(limit);
    }

    res.json(agents.map((a, i) => ({
      rank: i + 1,
      ...a,
      capabilities: JSON.parse(a.capabilities || '[]')
    })));
  } finally {
    db.close();
  }
});

// ─── GET /api/v1/agents/:id/history ─── Agent history
app.get('/api/v1/agents/:id/history', (req, res) => {
  const db = getDb();
  try {
    const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(req.params.id);
    if (!agent) return res.status(404).json({ error: 'Agent not found' });

    const tasks = db.prepare(
      `SELECT t.*, 
        req.name as requester_name, 
        exe.name as executor_name
       FROM tasks t
       LEFT JOIN agents req ON t.requester_id = req.id
       LEFT JOIN agents exe ON t.executor_id = exe.id
       WHERE t.executor_id = ? OR t.requester_id = ?
       ORDER BY t.created_at DESC LIMIT 100`
    ).all(req.params.id, req.params.id);

    const reviews = db.prepare(
      `SELECT r.*, rev.name as reviewer_name
       FROM reviews r
       LEFT JOIN agents rev ON r.reviewer_id = rev.id
       WHERE r.target_id = ?
       ORDER BY r.created_at DESC LIMIT 50`
    ).all(req.params.id);

    res.json({ tasks, reviews });
  } finally {
    db.close();
  }
});

// ─── Health check ───
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '0.1.0' });
});

// Init DB and start
initDb();
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🟣 Vaify API running on http://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/index.html`);
});
