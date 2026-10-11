import { ObjectId } from "mongodb";
import { getDatabase } from "../config/database.js";
import { DailyWorldState } from "../models/DailyWorldState.js";

function toDailyWorldState(data) {
    if (!data) {
        return null;
    }

    return new DailyWorldState(
        data._id,
        data.playerId,
        data.day,
        data.npcLocations
    );
}

export async function findDailyWorldState(
    playerId,
    day
) {
    const database = getDatabase();

    const worldStates = database.collection(
        "dailyWorldStates"
    );

    const data = await worldStates.findOne({
        playerId: new ObjectId(playerId),
        day
    });

    return toDailyWorldState(data);
}

export async function saveDailyWorldState(
    worldState
) {
    const database = getDatabase();

    const worldStates = database.collection(
        "dailyWorldStates"
    );

    const worldStateData = {
        playerId: worldState.playerId,
        day: worldState.day,
        npcLocations: worldState.npcLocations
    };

    if (!worldState.id) {
        const result = await worldStates.insertOne(
            worldStateData
        );

        worldState.id = result.insertedId;

        return worldState;
    }

    await worldStates.updateOne(
        {
            _id: worldState.id
        },
        {
            $set: worldStateData
        }
    );

    return worldState;
}