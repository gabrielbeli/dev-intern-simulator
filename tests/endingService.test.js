import { describe, it, expect } from "vitest";
import { Player } from "../src/models/Player.js";
import { BADGES } from "../src/config/gameConfig.js";
import { determineMainEnding, completeCampaign, hasMasteredAllBadges, completeSecretEnding } from "../src/services/endingService.js";

describe("determineMainEnding", () => {
    it("should determine the ending from the three dominant badges", () => {
        const player = new Player(
            "player-1",
            null,
            "Gabriel",
            "avatar-1"
        );

        player.addBadgePoints(
            BADGES.COMMUNICATION,
            10
        );

        player.addBadgePoints(
            BADGES.IMPACT,
            8
        );

        player.addBadgePoints(
            BADGES.DELIVERY,
            6
        );

        player.addBadgePoints(
            BADGES.INCLUSION,
            2
        );

        const ending =
            determineMainEnding(player);

        expect(ending.id).toBe(
            "communication_impact_delivery"
        );
    });

    it("should return null when the player does not have three dominant badges yet", () => {
        const player = new Player(
            "player-1",
            null,
            "Gabriel",
            "avatar-1"
        );

        player.addBadgePoints(
            BADGES.COMMUNICATION,
            5
        );

        player.addBadgePoints(
            BADGES.IMPACT,
            3
        );

        expect(
            determineMainEnding(player)
        ).toBe(null);
    });
});

describe("completeCampaign", () => {
    it("should complete the campaign for a Junior player", () => {
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
            BADGES.DELIVERY,
            6
        );

        player.addBadgePoints(
            BADGES.IMPACT,
            2
        );

        const result = completeCampaign(player);

        expect(result.ending.id).toBe(
            "communication_inclusion_delivery"
        );

        expect(result.player.ending).toBe(
            "communication_inclusion_delivery"
        );

        expect(result.player.postGame).toBe(true);
    });

    it("should reject campaign completion before Junior role", () => {
        const player = new Player(
            "player-1",
            null,
            "Gabriel",
            "avatar-1"
        );

        player.role = "Intern Gold";

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

        expect(() => {
            completeCampaign(player);
        }).toThrow(
            "Player has not reached Junior role"
        );

        expect(player.ending).toBe(null);
        expect(player.postGame).toBe(false);
    });

    it("should reject completing the campaign more than once", () => {
        const player = new Player(
            "player-1",
            null,
            "Gabriel",
            "avatar-1"
        );

        player.role = "Junior";
        player.postGame = true;
        player.ending =
            "communication_inclusion_impact";

        expect(() => {
            completeCampaign(player);
        }).toThrow(
            "Campaign already completed"
        );
    });
});

describe("hasMasteredAllBadges", () => {
    it("should return true when all badges reach mastery", () => {
        const player = new Player(
            "player-1",
            null,
            "Gabriel",
            "avatar-1"
        );

        player.addBadgePoints(
            BADGES.COMMUNICATION,
            15
        );

        player.addBadgePoints(
            BADGES.INCLUSION,
            16
        );

        player.addBadgePoints(
            BADGES.IMPACT,
            20
        );

        player.addBadgePoints(
            BADGES.DELIVERY,
            15
        );

        expect(
            hasMasteredAllBadges(player)
        ).toBe(true);
    });

    it("should return false when one badge has not reached mastery", () => {
        const player = new Player(
            "player-1",
            null,
            "Gabriel",
            "avatar-1"
        );

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
            14
        );

        expect(
            hasMasteredAllBadges(player)
        ).toBe(false);
    });
});

describe("completeSecretEnding", () => {
    it("should complete the secret ending and unlock avatar 5", () => {
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

        const result =
            completeSecretEnding(player);

        expect(result.player.secretEnding).toBe(
            "all_badges_mastered"
        );

        expect(
            result.player.unlockedAvatarIds
        ).toContain("avatar-5");

        expect(result.secretEnding).toEqual({
            id: "all_badges_mastered",
            unlockedAvatarId: "avatar-5"
        });

        expect(result.player.ending).toBe(
            "communication_inclusion_impact"
        );
    });

    it("should reject the secret ending before post-game", () => {
        const player = new Player(
            "player-1",
            null,
            "Gabriel",
            "avatar-1"
        );

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

        expect(() => {
            completeSecretEnding(player);
        }).toThrow(
            "Secret ending is only available in post-game"
        );

        expect(player.secretEnding).toBe(null);
        expect(
            player.unlockedAvatarIds
        ).not.toContain("avatar-5");
    });

    it("should reject the secret ending when not all badges are mastered", () => {
        const player = new Player(
            "player-1",
            null,
            "Gabriel",
            "avatar-1"
        );

        player.postGame = true;

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
            14
        );

        expect(() => {
            completeSecretEnding(player);
        }).toThrow(
            "Player has not mastered all badges"
        );

        expect(player.secretEnding).toBe(null);
        expect(
            player.unlockedAvatarIds
        ).not.toContain("avatar-5");
    });

    it("should reject completing the secret ending more than once", () => {
        const player = new Player(
            "player-1",
            null,
            "Gabriel",
            "avatar-1"
        );

        player.postGame = true;
        player.secretEnding =
            "all_badges_mastered";

        expect(() => {
            completeSecretEnding(player);
        }).toThrow(
            "Secret ending already completed"
        );
    });
});