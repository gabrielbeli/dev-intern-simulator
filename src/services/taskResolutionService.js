import { TaskProgress } from "../models/TaskProgress.js";

export function resolveTask(player, task, choiceId) {
    const choice = task.getChoice(choiceId);

    const dominantBadges = player.getDominantBadges();

    const xpEarned = task.calculateXp(
        choiceId,
        dominantBadges
    );

    player.spendStamina(task.staminaCost);
    player.useTimeBlocks(task.timeCost);
    player.addXp(xpEarned);

    for (const [badge, amount] of Object.entries(choice.badgeImpact)) {
        player.addBadgePoints(badge, amount);
    }

    const progress = new TaskProgress(
        null,
        player.id,
        task.id,
        choice.id,
        xpEarned,
        task.staminaCost,
        task.timeCost,
        choice.badgeImpact,
        player.day
    );

    return {
        player,
        progress
    };
}