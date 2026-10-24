import { MAIN_ENDINGS, BADGES, BADGE_MASTERY_SCORE, SECRET_ENDING } from "../config/gameConfig.js";

export function determineMainEnding(player) {
    const dominantBadges =
        player.getDominantBadges(3);

    if (dominantBadges.length < 3) {
        return null;
    }

    const ending = MAIN_ENDINGS.find(
        currentEnding =>
            currentEnding.badges.every(
                badge =>
                    dominantBadges.includes(badge)
            )
    );

    return ending ?? null;
}

export function completeCampaign(player) {
    if (player.role !== "Junior") {
        throw new Error(
            "Player has not reached Junior role"
        );
    }

    if (player.postGame) {
        throw new Error(
            "Campaign already completed"
        );
    }

    const ending = determineMainEnding(player);

    if (!ending) {
        throw new Error(
            "Player does not have enough badge progression"
        );
    }

    player.ending = ending.id;
    player.postGame = true;

    return {
        player,
        ending
    };
}

export function hasMasteredAllBadges(player) {
    return Object.values(BADGES).every(
        badge =>
            (player.badgeScores?.[badge] ?? 0) >=
            BADGE_MASTERY_SCORE
    );
}

export function completeSecretEnding(player) {
    if (!player.postGame) {
        throw new Error(
            "Secret ending is only available in post-game"
        );
    }

    if (player.secretEnding) {
        throw new Error(
            "Secret ending already completed"
        );
    }

    if (!hasMasteredAllBadges(player)) {
        throw new Error(
            "Player has not mastered all badges"
        );
    }

    player.secretEnding = SECRET_ENDING.id;

    player.unlockAvatar(
        SECRET_ENDING.unlockAvatarId
    );

    return {
        player,
        secretEnding: {
            id: SECRET_ENDING.id,
            unlockedAvatarId:
                SECRET_ENDING.unlockAvatarId
        }
    };
}