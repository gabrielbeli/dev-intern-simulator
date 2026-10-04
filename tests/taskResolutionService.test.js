import { describe, it, expect } from "vitest";

import { Player } from "../src/models/Player.js";
import { TaskDefinition } from "../src/models/TaskDefinition.js";
import { BADGES } from "../src/config/gameConfig.js";
import { resolveTask } from "../src/services/taskResolutionService.js";

describe("resolveTask", () => {
    it("should resolve a task and apply its consequences to the player", () => {
        const player = new Player(
            "player-1",
            null,
            "Gabriel",
            "avatar-1",
            "Intern",
            50
        );

        player.addBadgePoints(BADGES.COMMUNICATION, 10);
        player.addBadgePoints(BADGES.INCLUSION, 8);
        player.addBadgePoints(BADGES.DELIVERY, 6);

        const task = new TaskDefinition(
            "task-1",
            "Fix deployment issue",
            "A deployment problem needs attention.",
            "Intern",
            true,
            "easy",
            15,
            1,
            30,
            1,
            "npc",
            "alex",
            {},
            [
                {
                    id: "A",
                    text: "Focus on restoring delivery.",
                    badgeImpact: {
                        [BADGES.DELIVERY]: 2,
                        [BADGES.IMPACT]: 1
                    }
                }
            ]
        );

        const result = resolveTask(
            player,
            task,
            "A"
        );

        expect(result.player.xp).toBe(83);
        expect(result.player.stamina).toBe(85);
        expect(result.player.usedTimeBlocks).toBe(1);

        expect(result.player.badgeScores.delivery).toBe(8);
        expect(result.player.badgeScores.impact).toBe(1);

        expect(result.progress.playerId).toBe("player-1");
        expect(result.progress.taskId).toBe("task-1");
        expect(result.progress.choiceId).toBe("A");

        expect(result.progress.xpEarned).toBe(33);
        expect(result.progress.staminaSpent).toBe(15);
        expect(result.progress.timeSpent).toBe(1);

        expect(result.progress.badgeImpact).toEqual({
            delivery: 2,
            impact: 1
        });
    });
});