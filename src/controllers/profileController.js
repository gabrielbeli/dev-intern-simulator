import { createPlayerProfile, getPlayerProfile } from "../services/profileService.js";

export async function createProfile(req, res) {
    try {
        const { name, avatarId } = req.body;

        const player = await createPlayerProfile(
            req.session.userId,
            name,
            avatarId
        );

        return res.status(201).json({
            player
        });
    } catch (error) {
        if (
            error.message === "Player name is required" ||
            error.message === "Invalid starting avatar"
        ) {
            return res.status(400).json({
                error: error.message
            });
        }

        if (
            error.message ===
            "User already has a player profile"
        ) {
            return res.status(409).json({
                error: error.message
            });
        }

        console.error(error);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
}

export async function getProfile(req, res) {
    try {
        const player = await getPlayerProfile(
            req.session.userId
        );

        return res.status(200).json({
            player
        });
    } catch (error) {
        if (
            error.message ===
            "Player profile not found"
        ) {
            return res.status(404).json({
                error: error.message
            });
        }

        console.error(error);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
}