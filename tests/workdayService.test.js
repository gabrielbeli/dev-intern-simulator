import { describe, it, expect } from "vitest";
import { isOvertime, canGoHome, goHome, shouldForceGoHome, forcedGoHome } from "../src/services/workdayService.js";

describe("isOvertime", () => {
    it("should return false during normal work hours", () => {
        const player = {
            usedTimeBlocks: 7
        };

        expect(isOvertime(player)).toBe(false);
    });

    it("should return true when normal work hours are completed", () => {
        const player = {
            usedTimeBlocks: 8
        };

        expect(isOvertime(player)).toBe(true);
    });

    it("should remain true after working additional blocks", () => {
        const player = {
            usedTimeBlocks: 11
        };

        expect(isOvertime(player)).toBe(true);
    });
});

describe("canGoHome", () => {
  it("should allow the player to go home after normal work hours", () => {
    const player = {
      usedTimeBlocks: 8
    };

    expect(canGoHome(player)).toBe(true);
  });

  it("should not allow the player to go home before normal work hours end", () => {
    const player = {
      usedTimeBlocks: 6
    };

    expect(canGoHome(player)).toBe(false);
  });
});

describe("goHome", () => {
  it("should start a new day and restore the player", () => {
    const player = {
      day: 1,
      stamina: 40,
      usedTimeBlocks: 9,
      coffeeCount: 2,
      exhausted: false
    };

    const result = goHome(player);

    expect(result.day).toBe(2);
    expect(result.stamina).toBe(100);
    expect(result.usedTimeBlocks).toBe(0);
    expect(result.coffeeCount).toBe(0);
    expect(result.exhausted).toBe(false);
  });

  it("should reject going home before the workday is finished", () => {
    const player = {
      day: 1,
      stamina: 80,
      usedTimeBlocks: 5,
      coffeeCount: 0,
      exhausted: false
    };

    expect(() => {
      goHome(player);
    }).toThrow("Workday is not finished yet");

    expect(player.day).toBe(1);
    expect(player.stamina).toBe(80);
  });
});

describe("shouldForceGoHome", () => {
  it("should return true when stamina reaches zero", () => {
    const player = {
      stamina: 0
    };

    expect(shouldForceGoHome(player)).toBe(true);
  });

  it("should return false while the player still has stamina", () => {
    const player = {
      stamina: 1
    };

    expect(shouldForceGoHome(player)).toBe(false);
  });
});

describe("forcedGoHome", () => {
  it("should start a new day with exhaustion consequences", () => {
    const player = {
      day: 2,
      stamina: 0,
      usedTimeBlocks: 6,
      coffeeCount: 3,
      exhausted: false
    };

    const result = forcedGoHome(player);

    expect(result.day).toBe(3);
    expect(result.stamina).toBe(70);
    expect(result.usedTimeBlocks).toBe(0);
    expect(result.coffeeCount).toBe(0);
    expect(result.exhausted).toBe(true);
  });

  it("should reject forced home when the player still has stamina", () => {
    const player = {
      day: 2,
      stamina: 20,
      usedTimeBlocks: 6,
      coffeeCount: 1,
      exhausted: false
    };

    expect(() => {
      forcedGoHome(player);
    }).toThrow("Player is not exhausted");

    expect(player.day).toBe(2);
    expect(player.stamina).toBe(20);
  });
});