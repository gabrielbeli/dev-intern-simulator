import { describe, it, expect } from "vitest";

import { DailyWorldState } from "../src/models/DailyWorldState.js";

describe("DailyWorldState", () => {
    it("should store and return an NPC floor", () => {
        const worldState = new DailyWorldState(
            "world-1",
            "player-1",
            3
        );

        worldState.setNpcFloor("alex", 2);

        expect(
            worldState.getNpcFloor("alex")
        ).toBe(2);
    });

    it("should return null when NPC has no assigned floor", () => {
        const worldState = new DailyWorldState(
            "world-1",
            "player-1",
            3
        );

        expect(
            worldState.getNpcFloor("alex")
        ).toBe(null);
    });

    it("should reject an invalid floor", () => {
        const worldState = new DailyWorldState(
            "world-1",
            "player-1",
            3
        );

        expect(() => {
            worldState.setNpcFloor("alex", 0);
        }).toThrow("Invalid floor");
    });
});