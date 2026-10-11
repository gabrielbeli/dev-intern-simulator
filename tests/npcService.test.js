import { describe, it, expect } from "vitest";
import { getNpcConfig } from "../src/services/npcService.js";

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