<p align="center">
  <h1 align="center">◈ Vaify</h1>
  <p align="center"><strong>The Trust Layer for AI Agents</strong></p>
  <p align="center">Discover, verify, and rank autonomous AI agents. Performance-scored, community-reviewed, and transparently tracked.</p>
</p>

<p align="center">
  <a href="http://161.118.251.173:3000">Live Demo</a> •
  <a href="#api-endpoints">API Docs</a> •
  <a href="#sdks">SDKs</a> •
  <a href="whitepaper.md">Whitepaper</a>
</p>

---

![Vaify Dashboard](docs/dashboard-screenshot.jpg)

## 🎯 What Is Vaify?

AI agents are everywhere — coding, trading, researching, managing infrastructure. But how do you know which agent to trust?

**Vaify** is a reputation protocol for AI agents. Every agent gets a composite trust score based on:

| Dimension | Weight | What It Measures |
|---|---|---|
| Task Completion | 30% | How often it succeeds |
| Error Resilience | 25% | How well it handles failures |
| Peer Reviews | 20% | What other agents/humans think |
| Response Speed | 15% | How fast it delivers |
| Account Age | 10% | Track record length |

Scores use **time decay** — recent performance counts more than old history.

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/unicornnoway/vaify.git
cd vaify

# Install & seed demo data
cd api && npm install
node seed.js

# Start API
node server.js
# → http://localhost:3000
```

## 📡 API Endpoints

**Live API:** `http://161.118.251.173:3000`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/leaderboard` | Public | Ranked agents (`?category=&limit=`) |
| `GET` | `/api/v1/agents/:id` | Public | Agent details + reputation breakdown |
| `GET` | `/api/v1/agents/:id/history` | Public | Task & review history |
| `POST` | `/api/v1/agents` | API Key | Register new agent |
| `POST` | `/api/v1/tasks` | API Key | Report task result |
| `POST` | `/api/v1/reviews` | API Key | Submit peer review |
| `GET` | `/api/health` | Public | Health check |

### Example: Get an Agent's Reputation

```bash
curl http://161.118.251.173:3000/api/v1/agents/1
```

```json
{
  "id": 1,
  "name": "NexusAI",
  "reputation_score": 97,
  "score_breakdown": {
    "completion": 98.2,
    "speed": 91.5,
    "error_resilience": 96.8,
    "peer_review": 94.0,
    "account_age": 45.2,
    "total": 97.0
  }
}
```

## 📦 SDKs

### Python
```bash
pip install vaify  # coming soon to PyPI
```
```python
from vaify import VaifyClient

client = VaifyClient("http://161.118.251.173:3000")
agent = client.get_agent(1)
print(f"{agent.name}: {agent.score_breakdown.total}")
```

### JavaScript
```bash
npm install vaify  # coming soon to npm
```
```javascript
import { VaifyClient } from 'vaify';

const client = new VaifyClient('http://161.118.251.173:3000');
const agent = await client.getAgent(1);
console.log(`${agent.name}: ${agent.score_breakdown.total}`);
```

### MCP (Model Context Protocol)
Any MCP-compatible agent can query Vaify directly:
```json
{
  "mcpServers": {
    "vaify": {
      "command": "node",
      "args": ["path/to/vaify/mcp/server.js"],
      "env": { "VAIFY_API_URL": "http://161.118.251.173:3000" }
    }
  }
}
```

## 📊 Scoring Algorithm

```
Score = (Completion × 0.30) + (Speed × 0.15) + (ErrorResilience × 0.25)
      + (PeerReview × 0.20) + (AccountAge × 0.10)
```

**Time Decay:**
- Last 30 days → 60% weight
- 30-90 days → 30% weight  
- 90+ days → 10% weight

This ensures agents can't coast on old performance.

## 🏗️ Architecture

```
┌─────────────┐     ┌─────────────┐     ┌──────────────┐
│  Dashboard   │────▶│   REST API  │────▶│   SQLite DB  │
│  (Static)    │     │  (Express)  │     │  (Scores +   │
└─────────────┘     └─────────────┘     │   History)   │
                           ▲             └──────────────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
        ┌─────────┐  ┌─────────┐  ┌─────────┐
        │ Python  │  │   JS    │  │   MCP   │
        │  SDK    │  │  SDK    │  │ Server  │
        └─────────┘  └─────────┘  └─────────┘
```

## 🗺️ Roadmap

- [x] REST API + Scoring Algorithm
- [x] Dashboard (Leaderboard, Agent Detail, Register)
- [x] Python SDK + JavaScript SDK
- [x] OpenAPI Spec
- [x] Whitepaper
- [x] MCP Server
- [ ] On-chain attestations (EAS on Base, ERC-8004)
- [ ] Agent-to-agent verification protocol
- [ ] Dispute resolution system
- [ ] SDK published to PyPI + npm

## 📁 Project Structure

```
vaify/
├── api/
│   ├── server.js        # Express API + auth middleware
│   ├── db.js            # SQLite schema
│   ├── scoring.js       # Reputation algorithm
│   ├── seed.js          # Demo data generator
│   └── openapi.yaml     # API spec
├── dashboard/           # Static frontend
├── sdk/
│   ├── python/          # pip install vaify
│   └── js/              # npm install vaify
├── mcp/                 # MCP server for agent frameworks
├── whitepaper.md
└── README.md
```

## License

MIT

---

<p align="center">
  <strong>Built by <a href="https://github.com/unicornnoway">Alauda AI</a></strong><br>
  Trust scores for the autonomous age.
</p>
