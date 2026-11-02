import { getFloorStateForUser } from "../services/gameplayService.js";

export async function getFloor(req, res) {
    try {
        const floor = Number(req.params.floor);

        const floorState =
            await getFloorStateForUser(
                req.session.userId,
                floor
            );

        return res.status(200).json({
            floorState
        });
    } catch (error) {
        if (
            error.message === "Invalid floor"
        ) {
            return res.status(400).json({
                error: error.message
            });
        }

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