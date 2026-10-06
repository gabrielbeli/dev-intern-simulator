import { describe, it, expect, vi, beforeEach } from "vitest";
import { findPlayerById, savePlayer } from "../src/repositories/playerRepository.js";
import { confirmForcedDayEnd, confirmVoluntaryDayEnd } from "../src/services/dayTransitionService.js";

vi.mock("../src/repositories/playerRepository.js", () => ({
    findPlayerById: vi.fn(),
    savePlayer: vi.fn()
}));

describe("confirmForcedDayEnd", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        savePlayer.mockResolvedValue(undefined);
    });

    it("should start a new exhausted day when player has zero stamina", async () => {
        const player = {
            id: "player-1",
            day: 3,
            stamina: 0,
            usedTimeBlocks: 7,
            coffeeCount: 2,
            exhausted: false
        };

        findPlayerById.mockResolvedValue(player);

        const result = await confirmForcedDayEnd(
            "player-1"
        );

        expect(result.player.day).toBe(4);
        expect(result.player.stamina).toBe(70);
        expect(result.player.usedTimeBlocks).toBe(0);
        expect(result.player.coffeeCount).toBe(0);
        expect(result.player.exhausted).toBe(true);

        expect(result.dayTransition).toEqual({
            from: 3,
            to: 4,
            forced: true
        });

        expect(savePlayer).toHaveBeenCalledWith(player);
    });

    it("should reject forced day end when player still has stamina", async () => {
        const player = {
            id: "player-1",
            day: 3,
            stamina: 20,
            usedTimeBlocks: 7,
            coffeeCount: 1,
            exhausted: false
        };

        findPlayerById.mockResolvedValue(player);

        await expect(
            confirmForcedDayEnd("player-1")
        ).rejects.toThrow(
            "Player is not exhausted"
        );

        expect(player.day).toBe(3);
        expect(savePlayer).not.toHaveBeenCalled();
    });

    it("should reject when player does not exist", async () => {
        findPlayerById.mockResolvedValue(null);

        await expect(
            confirmForcedDayEnd("player-999")
        ).rejects.toThrow("Player not found");

        expect(savePlayer).not.toHaveBeenCalled();
    });

    it("should start a new normal day after voluntary day end", async () => {
        const player = {
            id: "player-1",
            day: 4,
            stamina: 35,
            usedTimeBlocks: 9,
            coffeeCount: 2,
            exhausted: true
        };

        findPlayerById.mockResolvedValue(player);

        const result = await confirmVoluntaryDayEnd(
            "player-1"
        );

        expect(result.player.day).toBe(5);
        expect(result.player.stamina).toBe(100);
        expect(result.player.usedTimeBlocks).toBe(0);
        expect(result.player.coffeeCount).toBe(0);
        expect(result.player.exhausted).toBe(false);

        expect(result.dayTransition).toEqual({
            from: 4,
            to: 5,
            forced: false
        });

        expect(savePlayer).toHaveBeenCalledWith(player);
    });

    it("should reject voluntary day end before normal work hours are completed", async () => {
        const player = {
            id: "player-1",
            day: 4,
            stamina: 60,
            usedTimeBlocks: 6,
            coffeeCount: 1,
            exhausted: false
        };

        findPlayerById.mockResolvedValue(player);

        await expect(
            confirmVoluntaryDayEnd("player-1")
        ).rejects.toThrow(
            "Workday is not finished yet"
        );

        expect(player.day).toBe(4);
        expect(player.stamina).toBe(60);
        expect(savePlayer).not.toHaveBeenCalled();
    });
});