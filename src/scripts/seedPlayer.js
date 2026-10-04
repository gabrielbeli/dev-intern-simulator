import { connectToDatabase, getDatabase } from "../config/database.js";
import { Player } from "../models/Player.js";
import { savePlayer } from "../repositories/playerRepository.js";

async function seedPlayer() {
    await connectToDatabase();

    const database = getDatabase();
    const players = database.collection("players");

    const existingPlayer = await players.findOne({
        name: "Gabriel",
        userId: null
    });

    if (existingPlayer) {
        console.log("Player already exists:", existingPlayer._id);
        return;
    }

    const player = new Player(
        null,
        null,
        "Gabriel",
        "avatar-1"
    );

    await savePlayer(player);

    console.log("Player created:", player.id);
}

seedPlayer();