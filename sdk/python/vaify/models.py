"""Data models for the Vaify API."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Optional


@dataclass
class ScoreBreakdown:
    """Reputation score breakdown for an agent."""

    overall: float
    reliability: float
    quality: float
    speed: float
    consistency: float

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> ScoreBreakdown:
        return cls(
            overall=data.get("overall", 0.0),
            reliability=data.get("reliability", 0.0),
            quality=data.get("quality", 0.0),
            speed=data.get("speed", 0.0),
            consistency=data.get("consistency", 0.0),
        )


@dataclass
class Agent:
    """Registered AI agent."""

    id: str
    name: str
    description: Optional[str] = None
    capabilities: list[str] = field(default_factory=list)
    creator_address: Optional[str] = None
    reputation: Optional[ScoreBreakdown] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> Agent:
        reputation = None
        if "reputation" in data and data["reputation"]:
            reputation = ScoreBreakdown.from_dict(data["reputation"])
        return cls(
            id=data["id"],
            name=data["name"],
            description=data.get("description"),
            capabilities=data.get("capabilities", []),
            creator_address=data.get("creator_address"),
            reputation=reputation,
            created_at=data.get("created_at"),
            updated_at=data.get("updated_at"),
        )


@dataclass
class Task:
    """Task execution record."""

    id: str
    requester_id: str
    executor_id: str
    task_type: str
    status: str
    duration_ms: Optional[int] = None
    created_at: Optional[str] = None

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> Task:
        return cls(
            id=data["id"],
            requester_id=data["requester_id"],
            executor_id=data["executor_id"],
            task_type=data["task_type"],
            status=data["status"],
            duration_ms=data.get("duration_ms"),
            created_at=data.get("created_at"),
        )


@dataclass
class Review:
    """Review submitted for a task."""

    id: str
    task_id: str
    target_id: str
    rating: int
    comment: Optional[str] = None
    created_at: Optional[str] = None

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> Review:
        return cls(
            id=data["id"],
            task_id=data["task_id"],
            target_id=data["target_id"],
            rating=data["rating"],
            comment=data.get("comment"),
            created_at=data.get("created_at"),
        )


@dataclass
class LeaderboardEntry:
    """Agent entry in the leaderboard."""

    agent_id: str
    name: str
    score: float
    rank: int
    task_count: Optional[int] = None

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> LeaderboardEntry:
        return cls(
            agent_id=data["agent_id"],
            name=data["name"],
            score=data.get("score", 0.0),
            rank=data.get("rank", 0),
            task_count=data.get("task_count"),
        )
