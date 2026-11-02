import { describe, it, expect, vi, beforeEach } from "vitest";
import { findPlayerByUserId } from "../src/repositories/playerRepository.js";
import { getFloorState } from "../src/services/floorStateService.js";
import { getFloorStateForUser } from "../src/services/gameplayService.js";

vi.mock("../src/repositories/playerRepository.js", () => ({
    findPlayerByUserId: vi.fn()
}));

vi.mock("../src/services/floorStateService.js", () => ({
    getFloorState: vi.fn()
}));

describe("getFloorStateForUser", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return the floor state for the authenticated user's player", async () => {
        const player = {
            id: {
                toString() {
                    return "player-1";
                }
            }
        };

        const floorState = {
            floor: 2,

            npcs: [
                {
                    id: "alex",
                    name: "Alex"
                }
            ],

            tasks: []
        };

        findPlayerByUserId.mockResolvedValue(player);
        getFloorState.mockResolvedValue(floorState);

        const result = await getFloorStateForUser(
            "user-1",
            2
        );

        expect(
            findPlayerByUserId
        ).toHaveBeenCalledWith(
            "user-1"
        );

        expect(
            getFloorState
        ).toHaveBeenCalledWith(
            "player-1",
            2
        );

        expect(result).toBe(floorState);
    });

    it("should reject when the user has no player profile", async () => {
        findPlayerByUserId.mockResolvedValue(null);

        await expect(
            getFloorStateForUser(
                "user-1",
                2
            )
        ).rejects.toThrow(
            "Player profile not found"
        );

        expect(
            getFloorState
        ).not.toHaveBeenCalled();
    });
}); 