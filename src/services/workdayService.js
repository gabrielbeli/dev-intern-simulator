import { WORKDAY } from "../config/gameConfig.js";

export function isOvertime(player) {
    return player.usedTimeBlocks >= WORKDAY.NORMAL_TIME_BLOCKS;
}

export function canGoHome(player) {
    return isOvertime(player);
}

export function goHome(player) {
    if (!canGoHome(player)) {
        throw new Error("Workday is not finished yet");
    }

    player.day += 1;

    player.stamina = WORKDAY.NORMAL_NEXT_DAY_STAMINA;
    player.usedTimeBlocks = 0;
    player.coffeeCount = 0;
    player.exhausted = false;

    return player;
}

export function shouldForceGoHome(player) {
    return player.stamina === 0;
}

export function forcedGoHome(player) {
    if (!shouldForceGoHome(player)) {
        throw new Error("Player is not exhausted");
    }

    player.day += 1;

    player.stamina = WORKDAY.EXHAUSTED_NEXT_DAY_STAMINA;
    player.usedTimeBlocks = 0;
    player.coffeeCount = 0;
    player.exhausted = true;

    return player;
}