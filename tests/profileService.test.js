import { describe, it, expect, vi, beforeEach } from "vitest";
import { findPlayerByUserId, savePlayer } from "../src/repositories/playerRepository.js";
import { createPlayerProfile, getPlayerProfile, changePlayerAvatar } from "../src/services/profileService.js";

vi.mock("../src/repositories/playerRepository.js", () => ({
    findPlayerByUserId: vi.fn(),
    savePlayer: vi.fn()
}));

describe("createPlayerProfile", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        savePlayer.mockResolvedValue(undefined);
    });

    it("should create a new player profile", async () => {
        findPlayerByUserId.mockResolvedValue(null);

        const player = await createPlayerProfile(
            "user-1",
            "  Gabriel  ",
            "avatar-2"
        );

        expect(player.userId).toBe("user-1");
        expect(player.name).toBe("Gabriel");
        expect(player.avatarId).toBe("avatar-2");

        expect(player.role).toBe("Intern");
        expect(player.xp).toBe(0);
        expect(player.stamina).toBe(100);
        expect(player.day).toBe(1);

        expect(savePlayer).toHaveBeenCalledWith(
            player
        );
    });

    it("should reject a locked starting avatar", async () => {
        await expect(
            createPlayerProfile(
                "user-1",
                "Gabriel",
                "avatar-5"
            )
        ).rejects.toThrow(
            "Invalid starting avatar"
        );

        expect(
            findPlayerByUserId
        ).not.toHaveBeenCalled();

        expect(savePlayer).not.toHaveBeenCalled();
    });

    it("should reject an empty player name", async () => {
        await expect(
            createPlayerProfile(
                "user-1",
                "   ",
                "avatar-1"
            )
        ).rejects.toThrow(
            "Player name is required"
        );

        expect(
            findPlayerByUserId
        ).not.toHaveBeenCalled();

        expect(savePlayer).not.toHaveBeenCalled();
    });
});

describe("getPlayerProfile", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return the player profile for the user", async () => {
        const player = {
            id: "player-1",
            userId: "user-1",
            name: "Gabriel",
            avatarId: "avatar-2",
            role: "Intern",
            xp: 0,
            day: 1
        };

        findPlayerByUserId.mockResolvedValue(player);

        const result = await getPlayerProfile(
            "user-1"
        );

        expect(result).toBe(player);

        expect(
            findPlayerByUserId
        ).toHaveBeenCalledWith(
            "user-1"
        );
    });

    it("should reject when the user has no player profile", async () => {
        findPlayerByUserId.mockResolvedValue(null);

        await expect(
            getPlayerProfile("user-1")
        ).rejects.toThrow(
            "Player profile not found"
        );
    });
});

describe("changePlayerAvatar", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        savePlayer.mockResolvedValue(undefined);
    });

    it("should change and persist an unlocked avatar", async () => {
        const player = {
            avatarId: "avatar-1",

            unlockedAvatarIds: [
                "avatar-1",
                "avatar-2",
                "avatar-3",
                "avatar-4"
            ],

            changeAvatar(avatarId) {
                if (!this.unlockedAvatarIds.includes(avatarId)) {
                    throw new Error("Avatar is not unlocked");
                }

                this.avatarId = avatarId;
            }
        };

        findPlayerByUserId.mockResolvedValue(player);

        const result = await changePlayerAvatar(
            "user-1",
            "avatar-3"
        );

        expect(result.avatarId).toBe("avatar-3");

        expect(
            findPlayerByUserId
        ).toHaveBeenCalledWith("user-1");

        expect(savePlayer).toHaveBeenCalledWith(
            player
        );
    });

    it("should reject changing to a locked avatar", async () => {
        const player = {
            avatarId: "avatar-1",

            unlockedAvatarIds: [
                "avatar-1",
                "avatar-2",
                "avatar-3",
                "avatar-4"
            ],

            changeAvatar(avatarId) {
                if (!this.unlockedAvatarIds.includes(avatarId)) {
                    throw new Error("Avatar is not unlocked");
                }

                this.avatarId = avatarId;
            }
        };

        findPlayerByUserId.mockResolvedValue(player);

        await expect(
            changePlayerAvatar(
                "user-1",
                "avatar-5"
            )
        ).rejects.toThrow(
            "Avatar is not unlocked"
        );

        expect(player.avatarId).toBe("avatar-1");
        expect(savePlayer).not.toHaveBeenCalled();
    });

    it("should reject when the user has no player profile", async () => {
        findPlayerByUserId.mockResolvedValue(null);

        await expect(
            changePlayerAvatar(
                "user-1",
                "avatar-2"
            )
        ).rejects.toThrow(
            "Player profile not found"
        );

        expect(savePlayer).not.toHaveBeenCalled();
    });
});