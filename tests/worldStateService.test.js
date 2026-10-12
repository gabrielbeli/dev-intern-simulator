import { describe, it, expect } from "vitest";
import { createDailyWorldState, resolveTaskFloor } from "../src/services/worldStateService.js";

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

describe("resolveTaskFloor", () => {
    it("should use daily NPC location for an NPC task", () => {
        const worldState = {
            getNpcFloor(npcId) {
                if (npcId === "alex") {
                    return 2;
                }

                return null;
            }
        };

        const task = {
            sourceType: "npc",
            sourceId: "alex",
            floor: null
        };

        expect(
            resolveTaskFloor(
                task,
                worldState
            )
        ).toBe(2);
    });

    it("should use the task floor for a fixed source", () => {
        const worldState = {
            getNpcFloor() {
                return null;
            }
        };

        const task = {
            sourceType: "object",
            sourceId: "server-rack",
            floor: 3
        };

        expect(
            resolveTaskFloor(
                task,
                worldState
            )
        ).toBe(3);
    });
});