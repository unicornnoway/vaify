const { getDb, initDb } = require('./db');
const { calculateScore } = require('./scoring');

// ─── Seed Data Generator ───

const AGENT_NAMES = [
  'CodeReviewer-X', 'DataPipeline-7', 'SecurityAuditor', 'TestRunner-Pro',
  'DeployBot-3', 'DocWriter-AI', 'BugHunter-9', 'PerformanceMonitor',
  'APIGateway-Bot', 'LogAnalyzer-5', 'ChatAssistant-2', 'TranslationBot',
  'ImageProcessor', 'SentimentAnalyzer', 'RecommendEngine', 'SearchIndexer',
  'CacheManager', 'QueueWorker-8', 'NotificationBot', 'SchedulerAgent',
  'BackupManager', 'MigrationBot', 'LoadBalancer-AI', 'RateLimiter',
  'AuthValidator', 'PaymentProcessor', 'EmailSender-3', 'WebScraper-Pro',
  'DataCleaner', 'ModelTrainer-7', 'FeatureExtractor', 'AnomalyDetector',
  'PredictionBot', 'ClusterManager', 'ResourceAllocator', 'MetricsCollector',
  'AlertManager-2', 'IncidentResponder', 'CapacityPlanner', 'CostOptimizer',
  'ComplianceChecker', 'AccessController', 'AuditLogger', 'ConfigManager',
  'ServiceMesh-Bot', 'TracingAgent', 'ProfilingBot', 'SynthesisEngine',
  'OrchestratorX', 'ValidatorNode-1'
];

const CAPABILITIES = [
  'code-review', 'testing', 'deployment', 'monitoring', 'security',
  'documentation', 'data-processing', 'nlp', 'image-processing',
  'search', 'caching', 'messaging', 'scheduling', 'ml-training',
  'anomaly-detection', 'cost-optimization', 'compliance', 'tracing'
];

const TASK_TYPES = [
  'code_review', 'unit_test', 'integration_test', 'deployment',
  'security_scan', 'data_pipeline', 'api_call', 'model_inference',
  'log_analysis', 'alert_handling', 'backup', 'migration',
  'documentation', 'translation', 'optimization'
];

const REVIEW_COMMENTS = [
  'Fast and reliable execution',
  'Completed task with high accuracy',
  'Response time could be better',
  'Excellent error handling',
  'Needs improvement in edge cases',
  'Very consistent performance',
  'Great at handling concurrent tasks',
  'Sometimes produces unexpected outputs',
  'Top-tier quality results',
  'Adequate but not exceptional',
  'Impressive speed improvements lately',
  'Reliable under heavy load',
  'Documentation could be more detailed',
  'Clean and maintainable output',
  'Occasional timeout issues'
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysBack) {
  const now = new Date();
  const past = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
  const diff = now.getTime() - past.getTime();
  return new Date(past.getTime() + Math.random() * diff).toISOString().replace('T', ' ').slice(0, 19);
}

function randomSubset(arr, min, max) {
  const count = randomInt(min, max);
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function seed() {
  initDb();
  const db = getDb();

  // Clear existing data
  db.exec('DELETE FROM reviews; DELETE FROM tasks; DELETE FROM agents;');
  db.exec('DELETE FROM sqlite_sequence;');

  console.log('🌱 Seeding 50 agents...');

  // Register 50 agents
  const insertAgent = db.prepare(
    'INSERT INTO agents (name, description, capabilities, creator_address, created_at) VALUES (?, ?, ?, ?, ?)'
  );

  const agentIds = [];
  for (let i = 0; i < 50; i++) {
    const name = AGENT_NAMES[i];
    const caps = JSON.stringify(randomSubset(CAPABILITIES, 1, 5));
    const desc = `AI agent specialized in ${randomSubset(CAPABILITIES, 1, 3).join(', ')}`;
    const addr = '0x' + [...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    const createdAt = randomDate(randomInt(7, 180));

    const result = insertAgent.run(name, desc, caps, addr, createdAt);
    agentIds.push(result.lastInsertRowid);
  }

  console.log('📋 Generating tasks...');

  // Generate 500-800 tasks
  const taskCount = randomInt(500, 800);
  const insertTask = db.prepare(
    'INSERT INTO tasks (requester_id, executor_id, task_type, status, duration_ms, created_at) VALUES (?, ?, ?, ?, ?, ?)'
  );

  const taskIds = [];
  const statuses = ['success', 'success', 'success', 'success', 'failure', 'timeout', 'partial'];
  // Bias towards success for more realistic data

  for (let i = 0; i < taskCount; i++) {
    const requester = randomChoice(agentIds);
    let executor = randomChoice(agentIds);
    while (executor === requester) executor = randomChoice(agentIds);

    const status = randomChoice(statuses);
    const duration = status === 'timeout' ? randomInt(30000, 120000) : randomInt(200, 15000);
    const createdAt = randomDate(randomInt(1, 120));

    const result = insertTask.run(
      requester, executor,
      randomChoice(TASK_TYPES),
      status, duration, createdAt
    );
    taskIds.push({ id: result.lastInsertRowid, requester, executor, createdAt });
  }

  console.log(`   Created ${taskCount} tasks`);

  // Generate reviews for ~60% of tasks
  console.log('⭐ Generating reviews...');

  const insertReview = db.prepare(
    'INSERT INTO reviews (task_id, reviewer_id, target_id, rating, comment, created_at) VALUES (?, ?, ?, ?, ?, ?)'
  );

  let reviewCount = 0;
  for (const task of taskIds) {
    if (Math.random() > 0.6) continue;

    const rating = randomInt(1, 5);
    // Bias towards positive reviews
    const adjustedRating = Math.random() > 0.3 ? Math.max(rating, 3) : rating;

    insertReview.run(
      task.id, task.requester,
      task.executor, adjustedRating,
      randomChoice(REVIEW_COMMENTS),
      task.createdAt
    );
    reviewCount++;
  }

  console.log(`   Created ${reviewCount} reviews`);

  // Recalculate all scores
  console.log('🧮 Calculating reputation scores...');
  db.close();

  for (const id of agentIds) {
    calculateScore(id);
  }

  // Print summary
  const db2 = getDb();
  const top10 = db2.prepare('SELECT id, name, reputation_score FROM agents ORDER BY reputation_score DESC LIMIT 10').all();

  console.log('\n🏆 Top 10 Agents:');
  console.log('─'.repeat(50));
  top10.forEach((a, i) => {
    console.log(`  ${(i + 1).toString().padStart(2)}. ${a.name.padEnd(25)} Score: ${a.reputation_score.toFixed(1)}`);
  });

  const total = db2.prepare('SELECT COUNT(*) as c FROM agents').get();
  const totalTasks = db2.prepare('SELECT COUNT(*) as c FROM tasks').get();
  const totalReviews = db2.prepare('SELECT COUNT(*) as c FROM reviews').get();

  console.log(`\n✅ Seed complete: ${total.c} agents, ${totalTasks.c} tasks, ${totalReviews.c} reviews`);
  db2.close();
}

seed();
