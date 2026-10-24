import { describe, it, expect, vi, beforeEach } from "vitest";
import { Player } from "../src/models/Player.js";
import { BADGES } from "../src/config/gameConfig.js";
import { findPlayerById, savePlayer } from "../src/repositories/playerRepository.js";
import { completeCampaignForPlayer, completeSecretEndingForPlayer } from "../src/services/endingActionService.js";

vi.mock("../src/repositories/playerRepository.js", () => ({
    findPlayerById: vi.fn(),
    savePlayer: vi.fn()
}));

describe("endingActionService", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        savePlayer.mockResolvedValue(undefined);
    });

    it("should complete and persist the main campaign ending", async () => {
        const player = new Player(
            "player-1",
            null,
            "Gabriel",
            "avatar-1"
        );

        player.role = "Junior";

        player.addBadgePoints(
            BADGES.COMMUNICATION,
            10
        );

        player.addBadgePoints(
            BADGES.INCLUSION,
            8
        );

        player.addBadgePoints(
            BADGES.IMPACT,
            6
        );

        findPlayerById.mockResolvedValue(player);

        const result =
            await completeCampaignForPlayer(
                "player-1"
            );

        expect(result.player.postGame).toBe(true);

        expect(result.player.ending).toBe(
            "communication_inclusion_impact"
        );

        expect(savePlayer).toHaveBeenCalledWith(
            player
        );
    });

    it("should complete and persist the secret ending", async () => {
        const player = new Player(
            "player-1",
            null,
            "Gabriel",
            "avatar-1"
        );

        player.postGame = true;
        player.ending =
            "communication_inclusion_impact";

        player.addBadgePoints(
            BADGES.COMMUNICATION,
            15
        );

        player.addBadgePoints(
            BADGES.INCLUSION,
            15
        );

        player.addBadgePoints(
            BADGES.IMPACT,
            15
        );

        player.addBadgePoints(
            BADGES.DELIVERY,
            15
        );

        findPlayerById.mockResolvedValue(player);

        const result =
            await completeSecretEndingForPlayer(
                "player-1"
            );

        expect(result.player.secretEnding).toBe(
            "all_badges_mastered"
        );

        expect(
            result.player.unlockedAvatarIds
        ).toContain("avatar-5");

        expect(result.player.ending).toBe(
            "communication_inclusion_impact"
        );

        expect(savePlayer).toHaveBeenCalledWith(
            player
        );
    });

    it("should reject when player does not exist", async () => {
        findPlayerById.mockResolvedValue(null);

        await expect(
            completeCampaignForPlayer("player-999")
        ).rejects.toThrow("Player not found");

        expect(savePlayer).not.toHaveBeenCalled();
    });
});