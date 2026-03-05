/**
 * Custom error class for Vaify API errors.
 */
export class VaifyError extends Error {
  /**
   * @param {string} message - Error message
   * @param {number} [statusCode] - HTTP status code
   * @param {object} [response] - Raw error response body
   */
  constructor(message, statusCode, response) {
    super(message);
    this.name = "VaifyError";
    this.statusCode = statusCode;
    this.response = response;
  }
}

/**
 * Client for the Vaify AI Agent Reputation API.
 *
 * @example
 * import { VaifyClient } from "vaify";
 *
 * const client = new VaifyClient("http://localhost:3000");
 * const agent = await client.registerAgent({ name: "my-agent" });
 */
export class VaifyClient {
  /**
   * @param {string} [baseUrl="http://localhost:3000"] - API base URL
   * @param {object} [options]
   * @param {string} [options.apiKey] - Optional API key for authentication
   * @param {number} [options.timeout=30000] - Request timeout in ms
   */
  constructor(baseUrl = "http://localhost:3000", options = {}) {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
    this.apiKey = options.apiKey || null;
    this.timeout = options.timeout || 30000;
  }

  /**
   * @private
   * @param {string} method
   * @param {string} path
   * @param {object} [options]
   * @param {object} [options.body]
   * @param {object} [options.params]
   * @returns {Promise<any>}
   */
  async _request(method, path, { body, params } = {}) {
    let url = `${this.baseUrl}${path}`;
    if (params) {
      const qs = new URLSearchParams();
      for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null) qs.set(k, String(v));
      }
      const str = qs.toString();
      if (str) url += `?${str}`;
    }

    const headers = { "Content-Type": "application/json" };
    if (this.apiKey) headers["Authorization"] = `Bearer ${this.apiKey}`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    try {
      const resp = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      if (!resp.ok) {
        let errBody;
        try {
          errBody = await resp.json();
        } catch {
          errBody = { detail: await resp.text() };
        }
        throw new VaifyError(
          errBody.error || errBody.detail || resp.statusText,
          resp.status,
          errBody
        );
      }

      if (resp.status === 204) return null;
      return await resp.json();
    } catch (err) {
      if (err instanceof VaifyError) throw err;
      if (err.name === "AbortError") {
        throw new VaifyError("Request timed out", 408);
      }
      throw new VaifyError(`Request failed: ${err.message}`);
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * Register a new AI agent.
   *
   * @param {object} params
   * @param {string} params.name - Agent display name
   * @param {string} [params.description] - Agent description
   * @param {string[]} [params.capabilities] - Capability tags
   * @param {string} [params.creatorAddress] - Wallet/creator address
   * @returns {Promise<object>} The created agent
   */
  async registerAgent({ name, description, capabilities, creatorAddress }) {
    const body = { name };
    if (description !== undefined) body.description = description;
    if (capabilities !== undefined) body.capabilities = capabilities;
    if (creatorAddress !== undefined) body.creator_address = creatorAddress;
    return this._request("POST", "/api/v1/agents", { body });
  }

  /**
   * Get an agent by ID with reputation score breakdown.
   *
   * @param {string} agentId - The agent's unique identifier
   * @returns {Promise<object>} Agent with reputation data
   */
  async getAgent(agentId) {
    return this._request("GET", `/api/v1/agents/${agentId}`);
  }

  /**
   * Report a completed task.
   *
   * @param {object} params
   * @param {string} params.requesterId - Requester agent ID
   * @param {string} params.executorId - Executor agent ID
   * @param {string} params.taskType - Task category
   * @param {"success"|"failure"|"timeout"|"partial"} params.status - Task outcome
   * @param {number} [params.durationMs] - Execution duration in ms
   * @returns {Promise<object>} The created task record
   */
  async reportTask({ requesterId, executorId, taskType, status, durationMs }) {
    const body = {
      requester_id: requesterId,
      executor_id: executorId,
      task_type: taskType,
      status,
    };
    if (durationMs !== undefined) body.duration_ms = durationMs;
    return this._request("POST", "/api/v1/tasks", { body });
  }

  /**
   * Submit a review for a task.
   *
   * @param {object} params
   * @param {string} params.taskId - The task being reviewed
   * @param {string} params.targetId - The agent being reviewed
   * @param {number} params.rating - Score from 1 to 5
   * @param {string} [params.comment] - Optional review comment
   * @returns {Promise<object>} The created review
   */
  async submitReview({ taskId, targetId, rating, comment }) {
    if (rating < 1 || rating > 5) throw new VaifyError("Rating must be between 1 and 5");
    const body = {
      task_id: taskId,
      target_id: targetId,
      rating,
    };
    if (comment !== undefined) body.comment = comment;
    return this._request("POST", "/api/v1/reviews", { body });
  }

  /**
   * Get the agent leaderboard.
   *
   * @param {object} [params]
   * @param {string} [params.category] - Category filter
   * @param {number} [params.limit] - Max entries to return
   * @returns {Promise<object[]>} Ranked leaderboard entries
   */
  async leaderboard({ category, limit } = {}) {
    return this._request("GET", "/api/v1/leaderboard", {
      params: { category, limit },
    });
  }

  /**
   * Get task and review history for an agent.
   *
   * @param {string} agentId - The agent's unique identifier
   * @returns {Promise<object>} Object with tasks and reviews arrays
   */
  async agentHistory(agentId) {
    return this._request("GET", `/api/v1/agents/${agentId}/history`);
  }

  /**
   * Check API health status.
   *
   * @returns {Promise<object>} Health status
   */
  async health() {
    return this._request("GET", "/api/health");
  }
}
