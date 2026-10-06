import { TaskProgress } from "../models/TaskProgress.js";
import { shouldForceGoHome } from "./workdayService.js"
import { applyCoffeeXpModifier } from "./coffeeService.js";

export function resolveTask(player, task, choiceId) {
    const choice = task.getChoice(choiceId);

    const dominantBadges = player.getDominantBadges();

    const coherentXp = task.calculateXp(
        choiceId,
        dominantBadges
    );

    const xpEarned = applyCoffeeXpModifier(
        player,
        coherentXp
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

    const forcedDayEnd = shouldForceGoHome(player);

    return {
        player,
        progress,
        forcedDayEnd
    };
}