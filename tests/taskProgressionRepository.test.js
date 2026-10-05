import { describe, it, expect, vi, beforeEach } from "vitest";
import { getDatabase } from "../src/config/database.js";
import { saveTaskProgress } from "../src/repositories/taskProgressRepository.js";

vi.mock("../src/config/database.js", () => ({
  getDatabase: vi.fn()
}));

describe("saveTaskProgress", () => {
  const insertOne = vi.fn();

  const collection = {
    insertOne
  };

  const database = {
    collection: vi.fn(() => collection)
  };

  beforeEach(() => {
    vi.clearAllMocks();

    getDatabase.mockReturnValue(database);
  });

    it("should translate duplicate task progress into a domain error", async () => {
    const progress = {
      playerId: "player-1",
      taskId: "task-1",
      choiceId: "A",
      xpEarned: 50,
      staminaSpent: 25,
      timeSpent: 2,
      badgeImpact: {
        communication: 2,
        inclusion: 1
      },
      dayCompleted: 1,
      completedAt: new Date()
    };

    const duplicateError = new Error(
      "E11000 duplicate key error"
    );

    duplicateError.code = 11000;

    duplicateError.keyPattern = {
      playerId: 1,
      taskId: 1
    };

    insertOne.mockRejectedValue(duplicateError);

    await expect(
      saveTaskProgress(progress)
    ).rejects.toThrow(
      "Task already completed by player"
    );
  });

    it("should rethrow non-duplicate database errors", async () => {
    const progress = {
      playerId: "player-1",
      taskId: "task-1",
      choiceId: "A",
      xpEarned: 50,
      staminaSpent: 25,
      timeSpent: 2,
      badgeImpact: {
        communication: 2
      },
      dayCompleted: 1,
      completedAt: new Date()
    };

    insertOne.mockRejectedValue(
      new Error("Database unavailable")
    );

    await expect(
      saveTaskProgress(progress)
    ).rejects.toThrow(
      "Database unavailable"
    );
  });
});