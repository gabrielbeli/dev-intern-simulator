import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPlayerProfile, getPlayerProfile, changePlayerAvatar } from "../src/services/profileService.js";
import { createProfile, getProfile, updateAvatar } from "../src/controllers/profileController.js";

vi.mock("../src/services/profileService.js", () => ({
    createPlayerProfile: vi.fn(),
    getPlayerProfile: vi.fn(),
    changePlayerAvatar: vi.fn()
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

it("should update the authenticated player's avatar", async () => {
    const player = {
        id: "player-1",
        avatarId: "avatar-3"
    };

    changePlayerAvatar.mockResolvedValue(player);

    const req = {
        session: {
            userId: "user-1"
        },

        body: {
            avatarId: "avatar-3"
        }
    };

    const res = createResponse();

    await updateAvatar(req, res);

    expect(
        changePlayerAvatar
    ).toHaveBeenCalledWith(
        "user-1",
        "avatar-3"
    );

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
        player
    });
});

it("should return 403 when the avatar is locked", async () => {
    changePlayerAvatar.mockRejectedValue(
        new Error("Avatar is not unlocked")
    );

    const req = {
        session: {
            userId: "user-1"
        },

        body: {
            avatarId: "avatar-5"
        }
    };

    const res = createResponse();

    await updateAvatar(req, res);

    expect(res.status).toHaveBeenCalledWith(403);

    expect(res.json).toHaveBeenCalledWith({
        error: "Avatar is not unlocked"
    });
});