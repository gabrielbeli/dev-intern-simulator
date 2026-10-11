import { describe, it, expect, vi, beforeEach } from "vitest";
import { findPlayerById } from "../src/repositories/playerRepository.js";
import { findDailyWorldState, saveDailyWorldState } from "../src/repositories/dailyWorldStateRepository.js";
import { getOrCreateDailyWorldState } from "../src/services/worldStateActionService.js";

vi.mock("../src/repositories/playerRepository.js", () => ({
    findPlayerById: vi.fn()
}));

vi.mock("../src/repositories/dailyWorldStateRepository.js", () => ({
    findDailyWorldState: vi.fn(),
    saveDailyWorldState: vi.fn()
}));

describe("getOrCreateDailyWorldState", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        saveDailyWorldState.mockResolvedValue(undefined);
    });

    it("should return the existing world state for the current day", async () => {
        const player = {
            id: "player-1",
            day: 3
        };

        const existingWorldState = {
            id: "world-1",
            playerId: "player-1",
            day: 3,

            npcLocations: {
                alex: 2
            }
        };

        findPlayerById.mockResolvedValue(player);

        findDailyWorldState.mockResolvedValue(
            existingWorldState
        );

        const result =
            await getOrCreateDailyWorldState(
                "player-1"
            );

        expect(result).toBe(existingWorldState);

        expect(
            findDailyWorldState
        ).toHaveBeenCalledWith(
            "player-1",
            3
        );

        expect(
            saveDailyWorldState
        ).not.toHaveBeenCalled();
    });

    it("should create and persist a world state when none exists", async () => {
        const player = {
            id: "player-1",
            day: 4
        };

        findPlayerById.mockResolvedValue(player);
        findDailyWorldState.mockResolvedValue(null);

        const result =
            await getOrCreateDailyWorldState(
                "player-1",
                () => 0
            );

        expect(result.playerId).toBe("player-1");
        expect(result.day).toBe(4);

        expect(
            result.getNpcFloor("alex")
        ).toBe(1);

        expect(
            saveDailyWorldState
        ).toHaveBeenCalledWith(result);
    });

    it("should reject when player does not exist", async () => {
        findPlayerById.mockResolvedValue(null);

        await expect(
            getOrCreateDailyWorldState(
                "player-999"
            )
        ).rejects.toThrow("Player not found");

        expect(
            findDailyWorldState
        ).not.toHaveBeenCalled();

        expect(
            saveDailyWorldState
        ).not.toHaveBeenCalled();
    });
});