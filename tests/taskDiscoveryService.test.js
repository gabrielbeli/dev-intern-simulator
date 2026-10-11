import { describe, it, expect, vi, beforeEach } from "vitest";
import { findPlayerById } from "../src/repositories/playerRepository.js";
import { findTaskDefinitionsByRole } from "../src/repositories/taskDefinitionRepository.js";
import { findTaskProgressByPlayer } from "../src/repositories/taskProgressRepository.js";
import { getAvailableTasksForPlayer } from "../src/services/taskDiscoveryService.js";

vi.mock("../src/repositories/playerRepository.js", () => ({
    findPlayerById: vi.fn()
}));

vi.mock("../src/repositories/taskDefinitionRepository.js", () => ({
    findTaskDefinitionsByRole: vi.fn()
}));

vi.mock("../src/repositories/taskProgressRepository.js", () => ({
    findTaskProgressByPlayer: vi.fn()
}));

describe("getAvailableTasksForPlayer", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return unlocked tasks with their start availability", async () => {
        const player = {
            id: "player-1",
            role: "Intern",
            stamina: 20,

            badgeScores: {
                communication: 5,
                inclusion: 0,
                impact: 0,
                delivery: 0
            }
        };

        const tasks = [
            {
                id: "task-1",
                role: "Intern",
                staminaCost: 15,
                requirements: {}
            },

            {
                id: "task-2",
                role: "Intern",
                staminaCost: 25,

                requirements: {
                    badgeScores: {
                        communication: 5
                    }
                }
            },

            {
                id: "task-3",
                role: "Intern",
                staminaCost: 15,

                requirements: {
                    badgeScores: {
                        delivery: 5
                    }
                }
            }
        ];

        findPlayerById.mockResolvedValue(player);
        findTaskDefinitionsByRole.mockResolvedValue(tasks);
        findTaskProgressByPlayer.mockResolvedValue([]);

        const result = await getAvailableTasksForPlayer(
            "player-1"
        );

        expect(result).toHaveLength(2);

        expect(result[0]).toEqual({
            task: tasks[0],
            canStart: true
        });

        expect(result[1]).toEqual({
            task: tasks[1],
            canStart: false
        });
    });

    it("should reject when player does not exist", async () => {
        findPlayerById.mockResolvedValue(null);

        await expect(
            getAvailableTasksForPlayer("player-999")
        ).rejects.toThrow("Player not found");

        expect(
            findTaskDefinitionsByRole
        ).not.toHaveBeenCalled();

        expect(
            findTaskProgressByPlayer
        ).not.toHaveBeenCalled();
    });
});