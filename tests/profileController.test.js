import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPlayerProfile, getPlayerProfile } from "../src/services/profileService.js";
import { createProfile, getProfile } from "../src/controllers/profileController.js";

vi.mock("../src/services/profileService.js", () => ({
    createPlayerProfile: vi.fn(),
    getPlayerProfile: vi.fn()
}));

function createResponse() {
    const res = {};

    res.status = vi.fn(() => res);
    res.json = vi.fn(() => res);

    return res;
}

describe("profileController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should create a player profile for the authenticated user", async () => {
        const player = {
            id: "player-1",
            userId: "user-1",
            name: "Gabriel",
            avatarId: "avatar-2"
        };

        createPlayerProfile.mockResolvedValue(player);

        const req = {
            session: {
                userId: "user-1"
            },

            body: {
                name: "Gabriel",
                avatarId: "avatar-2"
            }
        };

        const res = createResponse();

        await createProfile(req, res);

        expect(
            createPlayerProfile
        ).toHaveBeenCalledWith(
            "user-1",
            "Gabriel",
            "avatar-2"
        );

        expect(res.status).toHaveBeenCalledWith(201);

        expect(res.json).toHaveBeenCalledWith({
            player
        });
    });
})