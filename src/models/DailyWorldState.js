export class DailyWorldState {
    constructor(
        id,
        playerId,
        day,
        npcLocations = {}
    ) {
        this.id = id;
        this.playerId = playerId;
        this.day = day;
        this.npcLocations = npcLocations;
    }

    getNpcFloor(npcId) {
        return this.npcLocations[npcId] ?? null;
    }

    setNpcFloor(npcId, floor) {
        if (!npcId) {
            throw new Error("NPC id is required");
        }

        if (!Number.isInteger(floor) || floor < 1) {
            throw new Error("Invalid floor");
        }

        this.npcLocations[npcId] = floor;
    }
}