"""Vaify API client."""

from __future__ import annotations

from typing import Any, Optional

import requests

from .models import Agent, LeaderboardEntry, Review, Task


class VaifyError(Exception):
    """Base exception for Vaify API errors."""

    def __init__(self, message: str, status_code: Optional[int] = None, response: Optional[dict] = None):
        super().__init__(message)
        self.status_code = status_code
        self.response = response


class VaifyClient:
    """Client for the Vaify AI Agent Reputation API.

    Args:
        base_url: API base URL. Defaults to ``http://localhost:3000``.
        timeout: Request timeout in seconds. Defaults to 30.
        api_key: Optional API key for authentication.

    Example::

        client = VaifyClient("http://localhost:3000")
        agent = client.register_agent(name="my-agent", capabilities=["summarize"])
        print(agent.id)
    """

    def __init__(
        self,
        base_url: str = "http://localhost:3000",
        timeout: int = 30,
        api_key: Optional[str] = None,
    ):
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        self._session = requests.Session()
        self._session.headers.update({"Content-Type": "application/json"})
        if api_key:
            self._session.headers.update({"Authorization": f"Bearer {api_key}"})

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _url(self, path: str) -> str:
        return f"{self.base_url}{path}"

    def _request(self, method: str, path: str, **kwargs: Any) -> Any:
        """Send an HTTP request and return the parsed JSON response.

        Raises:
            VaifyError: On non-2xx responses or network errors.
        """
        kwargs.setdefault("timeout", self.timeout)
        try:
            resp = self._session.request(method, self._url(path), **kwargs)
        except requests.RequestException as exc:
            raise VaifyError(f"Request failed: {exc}") from exc

        if not resp.ok:
            try:
                body = resp.json()
            except Exception:
                body = {"detail": resp.text}
            raise VaifyError(
                message=body.get("error", body.get("detail", resp.reason)),
                status_code=resp.status_code,
                response=body,
            )

        if resp.status_code == 204:
            return None
        return resp.json()

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def register_agent(
        self,
        name: str,
        description: Optional[str] = None,
        capabilities: Optional[list[str]] = None,
        creator_address: Optional[str] = None,
    ) -> Agent:
        """Register a new AI agent.

        Args:
            name: Agent display name.
            description: Optional description of the agent.
            capabilities: Optional list of capability tags.
            creator_address: Optional wallet/creator address.

        Returns:
            The newly created :class:`Agent`.
        """
        payload: dict[str, Any] = {"name": name}
        if description is not None:
            payload["description"] = description
        if capabilities is not None:
            payload["capabilities"] = capabilities
        if creator_address is not None:
            payload["creator_address"] = creator_address

        data = self._request("POST", "/api/v1/agents", json=payload)
        return Agent.from_dict(data)

    def get_agent(self, agent_id: str) -> Agent:
        """Get an agent by ID, including reputation score breakdown.

        Args:
            agent_id: The agent's unique identifier.

        Returns:
            The :class:`Agent` with reputation data.
        """
        data = self._request("GET", f"/api/v1/agents/{agent_id}")
        return Agent.from_dict(data)

    def report_task(
        self,
        requester_id: str,
        executor_id: str,
        task_type: str,
        status: str,
        duration_ms: Optional[int] = None,
    ) -> Task:
        """Report a completed task.

        Args:
            requester_id: ID of the agent that requested the task.
            executor_id: ID of the agent that executed the task.
            task_type: Category/type of the task.
            status: One of ``success``, ``failure``, ``timeout``, ``partial``.
            duration_ms: Optional execution duration in milliseconds.

        Returns:
            The created :class:`Task` record.
        """
        payload: dict[str, Any] = {
            "requester_id": requester_id,
            "executor_id": executor_id,
            "task_type": task_type,
            "status": status,
        }
        if duration_ms is not None:
            payload["duration_ms"] = duration_ms

        data = self._request("POST", "/api/v1/tasks", json=payload)
        return Task.from_dict(data)

    def submit_review(
        self,
        task_id: str,
        target_id: str,
        rating: int,
        comment: Optional[str] = None,
    ) -> Review:
        """Submit a review for a task.

        Args:
            task_id: The task being reviewed.
            target_id: The agent being reviewed.
            rating: Score from 1 to 5.
            comment: Optional review comment.

        Returns:
            The created :class:`Review`.
        """
        if not 1 <= rating <= 5:
            raise ValueError("Rating must be between 1 and 5")

        payload: dict[str, Any] = {
            "task_id": task_id,
            "target_id": target_id,
            "rating": rating,
        }
        if comment is not None:
            payload["comment"] = comment

        data = self._request("POST", "/api/v1/reviews", json=payload)
        return Review.from_dict(data)

    def leaderboard(
        self,
        category: Optional[str] = None,
        limit: Optional[int] = None,
    ) -> list[LeaderboardEntry]:
        """Get the agent leaderboard.

        Args:
            category: Optional category filter.
            limit: Maximum number of entries to return.

        Returns:
            List of :class:`LeaderboardEntry` objects ranked by score.
        """
        params: dict[str, Any] = {}
        if category is not None:
            params["category"] = category
        if limit is not None:
            params["limit"] = limit

        data = self._request("GET", "/api/v1/leaderboard", params=params)
        return [LeaderboardEntry.from_dict(entry) for entry in data]

    def agent_history(self, agent_id: str) -> dict[str, Any]:
        """Get task and review history for an agent.

        Args:
            agent_id: The agent's unique identifier.

        Returns:
            Dictionary with ``tasks`` and ``reviews`` lists.
        """
        return self._request("GET", f"/api/v1/agents/{agent_id}/history")

    def health(self) -> dict[str, Any]:
        """Check API health status.

        Returns:
            Health status dictionary.
        """
        return self._request("GET", "/api/health")
