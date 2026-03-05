const { getDb } = require('./db');

/**
 * Vaify Reputation Scoring Algorithm
 *
 * Weights:
 *   - Task completion rate:   30%
 *   - Avg response speed:     15%
 *   - Error rate:             25%
 *   - Peer reviews:           20%
 *   - Account age:            10%
 *
 * Time decay (applied to tasks/reviews):
 *   - Last 30 days:   weight 0.6
 *   - 30-90 days:     weight 0.3
 *   - 90+ days:       weight 0.1
 */

function timeDecayWeight(createdAt) {
  const now = Date.now();
  const created = new Date(createdAt + 'Z').getTime();
  const daysAgo = (now - created) / (1000 * 60 * 60 * 24);
  if (daysAgo <= 30) return 0.6;
  if (daysAgo <= 90) return 0.3;
  return 0.1;
}

function calculateScore(agentId) {
  const db = getDb();

  const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(agentId);
  if (!agent) { db.close(); return null; }

  // --- Tasks where this agent was executor ---
  const tasks = db.prepare('SELECT * FROM tasks WHERE executor_id = ?').all(agentId);

  let completionScore = 50; // default if no tasks
  let speedScore = 50;
  let errorScore = 50;

  if (tasks.length > 0) {
    // Weighted completion rate
    let successWeight = 0, totalWeight = 0;
    let speedSum = 0, speedWeightSum = 0;
    let errorWeight = 0;

    for (const t of tasks) {
      const w = timeDecayWeight(t.created_at);
      totalWeight += w;
      if (t.status === 'success') {
        successWeight += w;
      }
      if (t.status === 'failure' || t.status === 'timeout') {
        errorWeight += w;
      }
      if (t.duration_ms > 0) {
        speedSum += t.duration_ms * w;
        speedWeightSum += w;
      }
    }

    // Completion rate → 0-100
    completionScore = totalWeight > 0 ? (successWeight / totalWeight) * 100 : 50;

    // Error rate → inverted (lower error = higher score)
    const errorRate = totalWeight > 0 ? errorWeight / totalWeight : 0;
    errorScore = (1 - errorRate) * 100;

    // Speed score: faster = better. Baseline 10s = 50, 1s = 100, 60s = 0
    if (speedWeightSum > 0) {
      const avgMs = speedSum / speedWeightSum;
      // Map: 0ms→100, 10000ms→50, 60000ms→0
      speedScore = Math.max(0, Math.min(100, 100 - (avgMs / 600)));
    }
  }

  // --- Peer reviews ---
  const reviews = db.prepare('SELECT * FROM reviews WHERE target_id = ?').all(agentId);
  let reviewScore = 50;
  if (reviews.length > 0) {
    let weightedSum = 0, weightSum = 0;
    for (const r of reviews) {
      const w = timeDecayWeight(r.created_at);
      weightedSum += (r.rating / 5) * 100 * w;
      weightSum += w;
    }
    reviewScore = weightSum > 0 ? weightedSum / weightSum : 50;
  }

  // --- Account age score ---
  const createdDate = new Date(agent.created_at + 'Z');
  const ageDays = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
  // 0 days→20, 30 days→60, 180+ days→100
  const ageScore = Math.min(100, 20 + (ageDays / 180) * 80);

  // --- Final weighted score ---
  const finalScore = (
    completionScore * 0.30 +
    speedScore * 0.15 +
    errorScore * 0.25 +
    reviewScore * 0.20 +
    ageScore * 0.10
  );

  const breakdown = {
    completion: Math.round(completionScore * 10) / 10,
    speed: Math.round(speedScore * 10) / 10,
    error_resilience: Math.round(errorScore * 10) / 10,
    peer_review: Math.round(reviewScore * 10) / 10,
    account_age: Math.round(ageScore * 10) / 10,
    total: Math.round(finalScore * 10) / 10
  };

  // Update stored score
  db.prepare("UPDATE agents SET reputation_score = ?, updated_at = datetime('now') WHERE id = ?")
    .run(breakdown.total, agentId);

  db.close();
  return breakdown;
}

module.exports = { calculateScore };
