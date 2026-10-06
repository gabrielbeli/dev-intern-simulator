import { describe, it, expect } from "vitest";

import { Player } from "../src/models/Player.js";

import { drinkCoffee, hasCoffeeOverusePenalty, applyCoffeeXpModifier } from "../src/services/coffeeService.js";

describe("drinkCoffee", () => {
    it("should recover stamina and spend XP", () => {
        const player = new Player(
            "player-1",
            null,
            "Gabriel",
            "avatar-1"
        );

        player.xp = 50;
        player.stamina = 60;

        const result = drinkCoffee(player);

        expect(result.player.stamina).toBe(80);
        expect(result.player.xp).toBe(45);
        expect(result.player.coffeeCount).toBe(1);
        expect(result.overusePenalty).toBe(false);
    });

    it("should not recover stamina above the maximum", () => {
        const player = new Player(
            "player-1",
            null,
            "Gabriel",
            "avatar-1"
        );

        player.xp = 50;
        player.stamina = 90;

        drinkCoffee(player);

        expect(player.stamina).toBe(100);
        expect(player.xp).toBe(45);
    });

    it("should reject coffee when player does not have enough XP", () => {
        const player = new Player(
            "player-1",
            null,
            "Gabriel",
            "avatar-1"
        );

        player.xp = 3;
        player.stamina = 50;

        expect(() => {
            drinkCoffee(player);
        }).toThrow("Not enough XP");

        expect(player.xp).toBe(3);
        expect(player.stamina).toBe(50);
        expect(player.coffeeCount).toBe(0);
    });

    it("should reject coffee when stamina is already full", () => {
        const player = new Player(
            "player-1",
            null,
            "Gabriel",
            "avatar-1"
        );

        player.xp = 50;

        expect(() => {
            drinkCoffee(player);
        }).toThrow("Stamina is already full");

        expect(player.xp).toBe(50);
        expect(player.coffeeCount).toBe(0);
    });
});

describe("hasCoffeeOverusePenalty", () => {
    it("should not apply penalty up to five coffees", () => {
        const player = {
            coffeeCount: 5
        };

        expect(
            hasCoffeeOverusePenalty(player)
        ).toBe(false);
    });

    it("should apply penalty from the sixth coffee", () => {
        const player = {
            coffeeCount: 6
        };

        expect(
            hasCoffeeOverusePenalty(player)
        ).toBe(true);
    });
});

describe("applyCoffeeXpModifier", () => {
  it("should keep normal XP when coffee limit was not exceeded", () => {
    const player = {
      coffeeCount: 5
    };

    expect(
      applyCoffeeXpModifier(player, 50)
    ).toBe(50);
  });

  it("should reduce XP after coffee overuse", () => {
    const player = {
      coffeeCount: 6
    };

    expect(
      applyCoffeeXpModifier(player, 50)
    ).toBe(38);
  });
});