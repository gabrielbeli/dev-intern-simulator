import { ObjectId } from "mongodb";
import { getDatabase } from "../config/database.js";
import { Player } from "../models/Player.js";

function toPlayer(data) {
    if (!data) {
        return null;
    }

    return new Player(
        data._id,
        data.userId,
        data.name,
        data.avatarId,
        data.role,
        data.xp,
        data.stamina,
        data.maxStamina,
        data.exhausted,
        data.day,
        data.usedTimeBlocks,
        data.coffeeCount,
        data.badgeScores,
        data.badgeRecency,
        data.ending,
        data.postGame,
        data.currentFloor,
        data.position
    );
}

export async function findPlayerById(playerId) {
    const database = getDatabase();

    const players = database.collection("players");

    const data = await players.findOne({
        _id: new ObjectId(playerId)
    });

    return toPlayer(data);
}

export async function savePlayer(player) {
    const database = getDatabase();

    const players = database.collection("players");

    const playerData = {
        userId: player.userId,
        name: player.name,
        avatarId: player.avatarId,

        role: player.role,
        xp: player.xp,

        stamina: player.stamina,
        maxStamina: player.maxStamina,

        day: player.day,
        usedTimeBlocks: player.usedTimeBlocks,
        coffeeCount: player.coffeeCount,

        badgeScores: player.badgeScores,
        badgeRecency: player.badgeRecency,

        ending: player.ending,
        postGame: player.postGame,

        currentFloor: player.currentFloor,
        position: player.position,
        exhausted: player.exhausted
    };

    if (!player.id) {
        const result = await players.insertOne(playerData);

        player.id = result.insertedId;

        return player;
    }

    await players.updateOne(
        { _id: player.id },
        {
            $set: playerData
        }
    );

    return player;
}