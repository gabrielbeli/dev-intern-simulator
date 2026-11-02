import { describe, it, expect, vi, beforeEach } from "vitest";
import { getFloorStateForUser } from "../src/services/gameplayService.js";
import { getFloor } from "../src/controllers/gameplayController.js";

vi.mock("../src/services/gameplayService.js", () => ({
    getFloorStateForUser: vi.fn()
}));

function createResponse() {
    const res = {};

    res.status = vi.fn(() => res);
    res.json = vi.fn(() => res);

    return res;
}

describe("gameplayController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return the requested floor state", async () => {
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

        getFloorStateForUser.mockResolvedValue(
            floorState
        );

        const req = {
            session: {
                userId: "user-1"
            },

            params: {
                floor: "2"
            }
        };

        const res = createResponse();

        await getFloor(req, res);

        expect(
            getFloorStateForUser
        ).toHaveBeenCalledWith(
            "user-1",
            2
        );

        expect(res.status).toHaveBeenCalledWith(
            200
        );

        expect(res.json).toHaveBeenCalledWith({
            floorState
        });
    });

    it("should return 400 for an invalid floor", async () => {
        getFloorStateForUser.mockRejectedValue(
            new Error("Invalid floor")
        );

        const req = {
            session: {
                userId: "user-1"
            },

            params: {
                floor: "99"
            }
        };

        const res = createResponse();

        await getFloor(req, res);

        expect(res.status).toHaveBeenCalledWith(
            400
        );

        expect(res.json).toHaveBeenCalledWith({
            error: "Invalid floor"
        });
    });

    it("should return 404 when the user has no player profile", async () => {
        getFloorStateForUser.mockRejectedValue(
            new Error("Player profile not found")
        );

        const req = {
            session: {
                userId: "user-1"
            },

            params: {
                floor: "1"
            }
        };

        const res = createResponse();

        await getFloor(req, res);

        expect(res.status).toHaveBeenCalledWith(
            404
        );
    });
});