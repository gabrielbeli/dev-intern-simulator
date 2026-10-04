import { describe, it, expect } from "vitest";
import { Player } from "../src/models/Player.js";
import { BADGES } from "../src/config/gameConfig.js";

describe("Player", () => {
    it("should add points to a valid badge", () => {
        const player = new Player(
            null,
            null,
            "Gabriel",
            "avatar-1"
        );

        player.addBadgePoints(BADGES.COMMUNICATION, 2);

        expect(player.badgeScores.communication).toBe(2);

    });
});

it("should reject an invalid badge", () => {
    const player = new Player(
        null,
        null,
        "Gabriel",
        "avatar-1"
    );

    expect(() => {
        player.addBadgePoints("banana", 2);
    }).toThrow("Invalid badge");

});

it("should reject badge points equal to or below zero", () => {
    const player = new Player(
        null,
        null,
        "Gabriel",
        "avatar-1"
    );

    expect(() => {
        player.addBadgePoints(BADGES.IMPACT, 0);
    }).toThrow("Badge points must be greater than zero");

});

it("should return the three dominant badges", () => {
    const player = new Player(
        null,
        null,
        "Gabriel",
        "avatar-1"
    );

    player.addBadgePoints(BADGES.COMMUNICATION, 12);
    player.addBadgePoints(BADGES.INCLUSION, 8);
    player.addBadgePoints(BADGES.IMPACT, 15);
    player.addBadgePoints(BADGES.DELIVERY, 10);

    expect(player.getDominantBadges()).toEqual([
        "impact",
        "communication",
        "delivery"
    ]);
});

it("should use recency to break badge score ties", () => {
    const player = new Player(
        null,
        null,
        "Gabriel",
        "avatar-1"
    );

    player.addBadgePoints(BADGES.COMMUNICATION, 10);
    player.addBadgePoints(BADGES.INCLUSION, 10);
    player.addBadgePoints(BADGES.IMPACT, 8);
    player.addBadgePoints(BADGES.DELIVERY, 8);

    player.addBadgePoints(BADGES.DELIVERY, 1);
    player.addBadgePoints(BADGES.IMPACT, 1);

    expect(player.getDominantBadges()).toEqual([
        "inclusion",
        "communication",
        "impact"
    ]);
});

it("should gain XP", () => {
    const player = new Player(
        null,
        null,
        "Gabriel",
        "avatar-1"
    );

    player.addXp(50);

    expect(player.xp).toBe(50);
});

it("should spend stamina", () => {
    const player = new Player(
        null,
        null,
        "Gabriel",
        "avatar-1"
    );

    player.spendStamina(25);

    expect(player.stamina).toBe(75);
});

it("should allow stamina to reach zero", () => {
    const player = new Player(
        null,
        null,
        "Gabriel",
        "avatar-1"
    );

    player.spendStamina(100);

    expect(player.stamina).toBe(0);
});

it("should reject spending more stamina than available", () => {
    const player = new Player(
        null,
        null,
        "Gabriel",
        "avatar-1"
    );

    expect(() => {
        player.spendStamina(101);
    }).toThrow("Not enough stamina");
});

it("should use time blocks even beyond the normal workday", () => {
    const player = new Player(
        null,
        null,
        "Gabriel",
        "avatar-1"
    );

    player.useTimeBlocks(9);

    expect(player.usedTimeBlocks).toBe(9);
});