import { describe, it, expect, vi, beforeEach } from "vitest";
import { Player } from "../src/models/Player.js";
import { TaskDefinition } from "../src/models/TaskDefinition.js";
import { BADGES } from "../src/config/gameConfig.js";
import { findPlayerById, savePlayer } from "../src/repositories/playerRepository.js";
import { findTaskDefinitionById, findTaskDefinitionsByRole } from "../src/repositories/taskDefinitionRepository.js";
import { findTaskProgress, saveTaskProgress, findTaskProgressByPlayer } from "../src/repositories/taskProgressRepository.js";
import { completeTaskForPlayer } from "../src/services/gameTaskService.js";
import { getDatabaseClient } from "../src/config/database.js";

vi.mock("../src/repositories/playerRepository.js", () => ({
    findPlayerById: vi.fn(),
    savePlayer: vi.fn()
}));

vi.mock("../src/repositories/taskDefinitionRepository.js", () => ({
    findTaskDefinitionById: vi.fn(),
    findTaskDefinitionsByRole: vi.fn()
}));

vi.mock("../src/repositories/taskProgressRepository.js", () => ({
    findTaskProgress: vi.fn(),
    findTaskProgressByPlayer: vi.fn(),
    saveTaskProgress: vi.fn()
}));

vi.mock("../src/config/database.js", () => ({
    getDatabaseClient: vi.fn()
}));

function createTask() {
    return new TaskDefinition(
        "task-1",
        "Unexpected Production Issue",
        "A problem was detected shortly before a release.",
        "Intern",
        true,
        "medium",
        25,
        2,
        50,
        null,
        "npc",
        "alex",
        {},
        [
            {
                id: "A",
                text: "Gather the team and clarify what happened.",
                badgeImpact: {
                    [BADGES.COMMUNICATION]: 2,
                    [BADGES.INCLUSION]: 1
                }
            }
        ]
    );

}

describe("completeTaskForPlayer", () => {

    const session = {
        withTransaction: vi.fn(async callback => {
            await callback();
        }),
        endSession: vi.fn()
    };

    const client = {
        startSession: vi.fn(() => session)
    };

    beforeEach(() => {
        vi.clearAllMocks();

        getDatabaseClient.mockReturnValue(client);
    });

    it("should complete a new task and persist player and progress", async () => {
        const player = new Player(
            "player-1",
            null,
            "Gabriel",
            "avatar-1"
        );

        const task = createTask();

        findTaskProgress.mockResolvedValue(null);
        findPlayerById.mockResolvedValue(player);
        findTaskDefinitionById.mockResolvedValue(task);
        findTaskDefinitionsByRole.mockResolvedValue([task]);

        findTaskProgressByPlayer.mockResolvedValue([
            {
                taskId: "task-1"
            }
        ]);

        const result = await completeTaskForPlayer(
            "player-1",
            "task-1",
            "A"
        );

        expect(result.player.xp).toBe(50);
        expect(result.player.stamina).toBe(75);
        expect(result.player.usedTimeBlocks).toBe(2);

        expect(result.player.badgeScores.communication).toBe(2);
        expect(result.player.badgeScores.inclusion).toBe(1);

        expect(result.promotion).toEqual({
            available: false,
            nextRole: null
        });

        expect(savePlayer).toHaveBeenCalledWith(player, session);
        expect(saveTaskProgress).toHaveBeenCalledWith(result.progress, session);

        expect(client.startSession).toHaveBeenCalled();

        expect(session.withTransaction).toHaveBeenCalled();

        expect(session.endSession).toHaveBeenCalled();
    });

    it("should reject a task already completed by the player", async () => {
        findTaskProgress.mockResolvedValue({
            id: "progress-1"
        });

        await expect(
            completeTaskForPlayer(
                "player-1",
                "task-1",
                "A"
            )
        ).rejects.toThrow("Task already completed by player");

        expect(findPlayerById).not.toHaveBeenCalled();
        expect(findTaskDefinitionById).not.toHaveBeenCalled();
        expect(savePlayer).not.toHaveBeenCalled();
        expect(saveTaskProgress).not.toHaveBeenCalled();
    });

    it("should reject when player does not exist", async () => {
        findTaskProgress.mockResolvedValue(null);
        findPlayerById.mockResolvedValue(null);

        await expect(
            completeTaskForPlayer(
                "player-999",
                "task-1",
                "A"
            )
        ).rejects.toThrow("Player not found");

        expect(findTaskDefinitionById).not.toHaveBeenCalled();
        expect(savePlayer).not.toHaveBeenCalled();
        expect(saveTaskProgress).not.toHaveBeenCalled();
    });

    it("should reject when task does not exist", async () => {
        const player = new Player(
            "player-1",
            null,
            "Gabriel",
            "avatar-1"
        );

        findTaskProgress.mockResolvedValue(null);
        findPlayerById.mockResolvedValue(player);
        findTaskDefinitionById.mockResolvedValue(null);

        await expect(
            completeTaskForPlayer(
                "player-1",
                "task-999",
                "A"
            )
        ).rejects.toThrow("Task not found");

        expect(savePlayer).not.toHaveBeenCalled();
        expect(saveTaskProgress).not.toHaveBeenCalled();
    });

    it("should report promotion when the completed task meets all requirements", async () => {
        const player = new Player(
            "player-1",
            null,
            "Gabriel",
            "avatar-1"
        );

        player.xp = 300;

        const task = createTask();

        findTaskProgress.mockResolvedValue(null);
        findPlayerById.mockResolvedValue(player);
        findTaskDefinitionById.mockResolvedValue(task);

        findTaskDefinitionsByRole.mockResolvedValue([
            task
        ]);

        findTaskProgressByPlayer.mockResolvedValue([
            {
                taskId: "task-1"
            }
        ]);

        const result = await completeTaskForPlayer(
            "player-1",
            "task-1",
            "A"
        );

        expect(result.player.xp).toBe(350);

        expect(result.promotion).toEqual({
            available: true,
            nextRole: "Intern Bronze"
        });

        expect(result.player.role).toBe("Intern");
    });

    it("should fail the transaction when task progress cannot be saved", async () => {
        const player = new Player(
            "player-1",
            null,
            "Gabriel",
            "avatar-1"
        );

        const task = createTask();

        findTaskProgress.mockResolvedValue(null);
        findPlayerById.mockResolvedValue(player);
        findTaskDefinitionById.mockResolvedValue(task);

        saveTaskProgress.mockRejectedValue(
            new Error("Database error")
        );

        await expect(
            completeTaskForPlayer(
                "player-1",
                "task-1",
                "A"
            )
        ).rejects.toThrow("Database error");

        expect(savePlayer).toHaveBeenCalledWith(
            player,
            session
        );

        expect(saveTaskProgress).toHaveBeenCalledWith(
            expect.anything(),
            session
        );

        expect(session.endSession).toHaveBeenCalled();
    });

})

