import { describe, it, expect } from "vitest";
import { getNpcConfig, getNpcsForFloor } from "../src/services/npcService.js";

describe("getNpcConfig", () => {
    it("should return the configuration for a valid NPC", () => {
        const npc = getNpcConfig("alex");

        expect(npc.id).toBe("alex");
        expect(npc.allowedFloors).toEqual([1, 2]);
    });

    it("should reject an invalid NPC", () => {
        expect(() => {
            getNpcConfig("unknown");
        }).toThrow("Invalid NPC");
    });
});

describe("getNpcsForFloor", () => {
    it("should return NPCs assigned to the requested floor", () => {
        const worldState = {
            getNpcFloor(npcId) {
                if (npcId === "alex") {
                    return 2;
                }

                return null;
            }
        };

        const result = getNpcsForFloor(
            worldState,
            2
        );

        expect(result).toHaveLength(1);
        expect(result[0].id).toBe("alex");
        expect(result[0].name).toBe("Alex");
    });

    it("should return an empty list when no NPC is assigned to the floor", () => {
        const worldState = {
            getNpcFloor() {
                return 2;
            }
        };

        const result = getNpcsForFloor(
            worldState,
            3
        );

        expect(result).toEqual([]);
    });
});