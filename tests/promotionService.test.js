import { describe, it, expect, vi, beforeEach } from "vitest";
import { findPlayerById, savePlayer } from "../src/repositories/playerRepository.js";
import { findTaskDefinitionsByRole } from "../src/repositories/taskDefinitionRepository.js";
import { findTaskProgressByPlayer } from "../src/repositories/taskProgressRepository.js";
import { confirmPromotion } from "../src/services/promotionService.js";

vi.mock("../src/repositories/playerRepository.js", () => ({
    findPlayerById: vi.fn(),
    savePlayer: vi.fn()
}));

vi.mock("../src/repositories/taskDefinitionRepository.js", () => ({
    findTaskDefinitionsByRole: vi.fn()
}));

vi.mock("../src/repositories/taskProgressRepository.js", () => ({
    findTaskProgressByPlayer: vi.fn()
}));

describe("confirmPromotion", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should confirm an eligible promotion and persist the player", async () => {
        const player = {
            id: "player-1",
            role: "Intern",
            xp: 400
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

        findPlayerById.mockResolvedValue(player);
        findTaskDefinitionsByRole.mockResolvedValue(tasks);
        findTaskProgressByPlayer.mockResolvedValue(progress);

        const result = await confirmPromotion(
            "player-1"
        );

        expect(result.player.role).toBe(
            "Intern Bronze"
        );

        expect(result.promotion).toEqual({
            from: "Intern",
            to: "Intern Bronze"
        });

        expect(savePlayer).toHaveBeenCalledWith(
            player
        );
    });

    it("should reject promotion when requirements are not met", async () => {
        const player = {
            id: "player-1",
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

        findPlayerById.mockResolvedValue(player);
        findTaskDefinitionsByRole.mockResolvedValue(tasks);
        findTaskProgressByPlayer.mockResolvedValue(progress);

        await expect(
            confirmPromotion("player-1")
        ).rejects.toThrow(
            "Player is not eligible for promotion"
        );

        expect(player.role).toBe("Intern");

        expect(savePlayer).not.toHaveBeenCalled();
    });

    it("should reject when player does not exist", async () => {
        findPlayerById.mockResolvedValue(null);

        await expect(
            confirmPromotion("player-999")
        ).rejects.toThrow("Player not found");

        expect(
            findTaskDefinitionsByRole
        ).not.toHaveBeenCalled();

        expect(
            findTaskProgressByPlayer
        ).not.toHaveBeenCalled();

        expect(savePlayer).not.toHaveBeenCalled();
    });
}); 