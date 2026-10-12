import { describe, it, expect, vi, beforeEach } from "vitest";
import { getOrCreateDailyWorldState } from "../src/services/worldStateActionService.js";
import { getNpcsForFloor } from "../src/services/npcService.js";
import { getTasksForFloor } from "../src/services/taskDiscoveryService.js";
import { getFloorState } from "../src/services/floorStateService.js";

vi.mock("../src/services/worldStateActionService.js", () => ({
    getOrCreateDailyWorldState: vi.fn()
}));

vi.mock("../src/services/npcService.js", () => ({
    getNpcsForFloor: vi.fn()
}));

vi.mock("../src/services/taskDiscoveryService.js", () => ({
    getTasksForFloor: vi.fn()
}));

describe("getFloorState", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return NPCs and tasks for the requested floor", async () => {
        const worldState = {
            id: "world-1"
        };

        const npcs = [
            {
                id: "alex",
                name: "Alex",
                allowedFloors: [1, 2]
            }
        ];

        const tasks = [
            {
                task: {
                    id: "task-1",
                    title: "Unexpected Production Issue"
                },

                canStart: true,

                location: {
                    floor: 2,
                    sourceType: "npc",
                    sourceId: "alex"
                }
            }
        ];

        getOrCreateDailyWorldState.mockResolvedValue(
            worldState
        );

        getNpcsForFloor.mockReturnValue(npcs);

        getTasksForFloor.mockResolvedValue(tasks);

        const result = await getFloorState(
            "player-1",
            2
        );

        expect(result).toEqual({
            floor: 2,
            npcs,
            tasks
        });

        expect(
            getNpcsForFloor
        ).toHaveBeenCalledWith(
            worldState,
            2
        );

        expect(
            getTasksForFloor
        ).toHaveBeenCalledWith(
            "player-1",
            2
        );
    });

    it("should return an empty floor state when there are no NPCs or tasks", async () => {
        const worldState = {
            id: "world-1"
        };

        getOrCreateDailyWorldState.mockResolvedValue(
            worldState
        );

        getNpcsForFloor.mockReturnValue([]);
        getTasksForFloor.mockResolvedValue([]);

        const result = await getFloorState(
            "player-1",
            3
        );

        expect(result).toEqual({
            floor: 3,
            npcs: [],
            tasks: []
        });
    });

    it("should reject an invalid floor", async () => {
        await expect(
            getFloorState(
                "player-1",
                99
            )
        ).rejects.toThrow("Invalid floor");

        expect(
            getOrCreateDailyWorldState
        ).not.toHaveBeenCalled();

        expect(
            getNpcsForFloor
        ).not.toHaveBeenCalled();

        expect(
            getTasksForFloor
        ).not.toHaveBeenCalled();
    });
});