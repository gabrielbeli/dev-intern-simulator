import { describe, it, expect, vi, beforeEach } from "vitest";
import { findPlayerById } from "../src/repositories/playerRepository.js";
import { findTaskDefinitionsByRole } from "../src/repositories/taskDefinitionRepository.js";
import { findTaskProgressByPlayer } from "../src/repositories/taskProgressRepository.js";
import { getAvailableTasksForPlayer, getTasksForFloor } from "../src/services/taskDiscoveryService.js";
import { getOrCreateDailyWorldState } from "../src/services/worldStateActionService.js";

vi.mock("../src/repositories/playerRepository.js", () => ({
    findPlayerById: vi.fn()
}));

vi.mock("../src/repositories/taskDefinitionRepository.js", () => ({
    findTaskDefinitionsByRole: vi.fn()
}));

vi.mock("../src/repositories/taskProgressRepository.js", () => ({
    findTaskProgressByPlayer: vi.fn()
}));

vi.mock("../src/services/worldStateActionService.js", () => ({
    getOrCreateDailyWorldState: vi.fn()
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

                sourceType: "npc",
                sourceId: "alex",
                floor: null,

                requirements: {}
            },

            {
                id: "task-2",
                role: "Intern",
                staminaCost: 25,

                sourceType: "object",
                sourceId: "meeting-room-screen",
                floor: 3,

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

        getOrCreateDailyWorldState.mockResolvedValue({
            getNpcFloor(npcId) {
                if (npcId === "alex") {
                    return 2;
                }

                return null;
            }
        });

        const result = await getAvailableTasksForPlayer(
            "player-1"
        );

        expect(result).toHaveLength(2);

        expect(result[0]).toEqual({
            task: tasks[0],
            canStart: true,

            location: {
                floor: 2,
                sourceType: "npc",
                sourceId: "alex"
            }
        });

        expect(result[1]).toEqual({
            task: tasks[1],
            canStart: false,

            location: {
                floor: 3,
                sourceType: "object",
                sourceId: "meeting-room-screen"
            }
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

        expect(
            getOrCreateDailyWorldState
        ).not.toHaveBeenCalled();
    });

    it("should return only available tasks located on the requested floor", async () => {
        const player = {
            id: "player-1",
            role: "Intern",
            stamina: 50,
            badgeScores: {}
        };

        const tasks = [
            {
                id: "task-1",
                role: "Intern",
                staminaCost: 15,

                sourceType: "npc",
                sourceId: "alex",
                floor: null,

                requirements: {}
            },

            {
                id: "task-2",
                role: "Intern",
                staminaCost: 25,

                sourceType: "object",
                sourceId: "server-rack",
                floor: 3,

                requirements: {}
            }
        ];

        findPlayerById.mockResolvedValue(player);
        findTaskDefinitionsByRole.mockResolvedValue(tasks);
        findTaskProgressByPlayer.mockResolvedValue([]);

        getOrCreateDailyWorldState.mockResolvedValue({
            getNpcFloor(npcId) {
                if (npcId === "alex") {
                    return 2;
                }

                return null;
            }
        });

        const result = await getTasksForFloor(
            "player-1",
            2
        );

        expect(result).toHaveLength(1);

        expect(result[0].task.id).toBe("task-1");

        expect(result[0].location).toEqual({
            floor: 2,
            sourceType: "npc",
            sourceId: "alex"
        });
    });

    it("should return an empty list when no available tasks are on the requested floor", async () => {
        const player = {
            id: "player-1",
            role: "Intern",
            stamina: 50,
            badgeScores: {}
        };

        const tasks = [
            {
                id: "task-1",
                role: "Intern",
                staminaCost: 15,

                sourceType: "npc",
                sourceId: "alex",
                floor: null,

                requirements: {}
            }
        ];

        findPlayerById.mockResolvedValue(player);
        findTaskDefinitionsByRole.mockResolvedValue(tasks);
        findTaskProgressByPlayer.mockResolvedValue([]);

        getOrCreateDailyWorldState.mockResolvedValue({
            getNpcFloor() {
                return 2;
            }
        });

        const result = await getTasksForFloor(
            "player-1",
            3
        );

        expect(result).toEqual([]);
    });
});