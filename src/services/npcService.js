import { NPCS } from "../config/gameConfig.js";

export function getNpcConfig(npcId) {
    const npc = Object.values(NPCS).find(
        currentNpc => currentNpc.id === npcId
    );

    if (!npc) {
        throw new Error("Invalid NPC");
    }

    return npc;
}