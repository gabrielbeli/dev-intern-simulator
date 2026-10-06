import { describe, it, expect, vi, beforeEach } from "vitest";
import { findPlayerById, savePlayer } from "../src/repositories/playerRepository.js";
import { drinkCoffeeForPlayer } from "../src/services/coffeeActionService.js";

vi.mock("../src/repositories/playerRepository.js", () => ({
    findPlayerById: vi.fn(),
    savePlayer: vi.fn()
}));

describe("drinkCoffeeForPlayer", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        savePlayer.mockResolvedValue(undefined);
    });

    it("should drink coffee and persist the player", async () => {
        const player = {
            id: "player-1",
            xp: 50,
            stamina: 60,
            maxStamina: 100,
            coffeeCount: 0,

            spendXp(amount) {
                if (amount > this.xp) {
                    throw new Error("Not enough XP");
                }

                this.xp -= amount;
            }
        };

        findPlayerById.mockResolvedValue(player);

        const result = await drinkCoffeeForPlayer(
            "player-1"
        );

        expect(result.player.stamina).toBe(80);
        expect(result.player.xp).toBe(45);
        expect(result.player.coffeeCount).toBe(1);
        expect(result.overusePenalty).toBe(false);

        expect(savePlayer).toHaveBeenCalledWith(player);
    });

    it("should reject when player does not exist", async () => {
        findPlayerById.mockResolvedValue(null);

        await expect(
            drinkCoffeeForPlayer("player-999")
        ).rejects.toThrow("Player not found");

        expect(savePlayer).not.toHaveBeenCalled();
    });

    it("should not persist when coffee cannot be consumed", async () => {
        const player = {
            id: "player-1",
            xp: 3,
            stamina: 50,
            maxStamina: 100,
            coffeeCount: 0,

            spendXp() {
                throw new Error("Not enough XP");
            }
        };

        findPlayerById.mockResolvedValue(player);

        await expect(
            drinkCoffeeForPlayer("player-1")
        ).rejects.toThrow("Not enough XP");

        expect(savePlayer).not.toHaveBeenCalled();
    });
});