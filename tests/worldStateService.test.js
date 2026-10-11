import { describe, it, expect } from "vitest";
import { createDailyWorldState } from "../src/services/worldStateService.js";

describe("createDailyWorldState", () => {
    it("should create world state for the current player day", () => {
        const player = {
            id: "player-1",
            day: 3
        };

        const worldState = createDailyWorldState(
            player,
            () => 0
        );

        expect(worldState.playerId).toBe("player-1");
        expect(worldState.day).toBe(3);

        expect(
            worldState.getNpcFloor("alex")
        ).toBe(1);
    });

    it("should select another allowed floor based on random value", () => {
        const player = {
            id: "player-1",
            day: 3
        };

        const worldState = createDailyWorldState(
            player,
            () => 0.9
        );

        expect(
            worldState.getNpcFloor("alex")
        ).toBe(2);
    });
});