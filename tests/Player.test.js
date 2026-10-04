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