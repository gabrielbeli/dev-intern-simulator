import { describe, it, expect } from "vitest";
import { getRoleConfig, canPromotePlayer, promotePlayer } from "../src/services/roleProgressionService.js";

describe("getRoleConfig", () => {
    it("should return the configuration for a valid role", () => {
        const role = getRoleConfig("Intern");

        expect(role.name).toBe("Intern");
        expect(role.xpRequired).toBe(350);
        expect(role.nextRole).toBe("Intern Bronze");
    });

    it("should reject an invalid role", () => {
        expect(() => {
            getRoleConfig("CEO of Everything");
        }).toThrow("Invalid role");
    });
});

describe("canPromotePlayer", () => {
    it("should not promote when a mandatory task is missing", () => {
        const player = {
            role: "Intern",
            xp: 400
        };

        const tasks = [
            {
                id: "task-1",
                role: "Intern",
                mandatory: true
            },
            {
                id: "task-2",
                role: "Intern",
                mandatory: true
            }
        ];

        const progress = [
            {
                taskId: "task-1"
            }
        ];

        expect(
            canPromotePlayer(player, tasks, progress)
        ).toBe(false);
    });

    it("should not promote when XP is insufficient", () => {
        const player = {
            role: "Intern",
            xp: 300
        };

        const tasks = [
            {
                id: "task-1",
                role: "Intern",
                mandatory: true
            }
        ];

        const progress = [
            {
                taskId: "task-1"
            }
        ];

        expect(
            canPromotePlayer(player, tasks, progress)
        ).toBe(false);
    });

    it("should promote when XP and mandatory tasks requirements are met", () => {
        const player = {
            role: "Intern",
            xp: 400
        };

        const tasks = [
            {
                id: "task-1",
                role: "Intern",
                mandatory: true
            },
            {
                id: "task-2",
                role: "Intern",
                mandatory: true
            },
            {
                id: "task-3",
                role: "Intern",
                mandatory: false
            }
        ];

        const progress = [
            {
                taskId: "task-1"
            },
            {
                taskId: "task-2"
            }
        ];

        expect(
            canPromotePlayer(player, tasks, progress)
        ).toBe(true);
    });
})

describe("promotePlayer", () => {
    it("should promote an eligible player to the next role", () => {
        const player = {
            role: "Intern",
            xp: 400,
            stamina: 75
        };

        const tasks = [
            {
                id: "task-1",
                role: "Intern",
                mandatory: true
            },
            {
                id: "task-2",
                role: "Intern",
                mandatory: true
            }
        ];

        const progress = [
            {
                taskId: "task-1"
            },
            {
                taskId: "task-2"
            }
        ];

        const promotedPlayer = promotePlayer(
            player,
            tasks,
            progress
        );

        expect(promotedPlayer.role).toBe("Intern Bronze");
        expect(promotedPlayer.xp).toBe(400);
        expect(promotedPlayer.stamina).toBe(75);
    });

    it("should reject promotion when requirements are not met", () => {
        const player = {
            role: "Intern",
            xp: 400
        };

        const tasks = [
            {
                id: "task-1",
                role: "Intern",
                mandatory: true
            },
            {
                id: "task-2",
                role: "Intern",
                mandatory: true
            }
        ];

        const progress = [
            {
                taskId: "task-1"
            }
        ];

        expect(() => {
            promotePlayer(
                player,
                tasks,
                progress
            );
        }).toThrow(
            "Player is not eligible for promotion"
        );

        expect(player.role).toBe("Intern");
    });
})