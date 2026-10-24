function meetsRequirements(
    player,
    requirements,
    completedTaskIds,
    ignoreBadgeScores = false
) {
    const requiredTasks =
        requirements?.completedTasks ?? [];

    const completedRequiredTasks =
        requiredTasks.every(taskId =>
            completedTaskIds.has(taskId.toString())
        );

    if (!completedRequiredTasks) {
        return false;
    }

    if (ignoreBadgeScores) {
        return true;
    }

    const requiredBadgeScores =
        requirements?.badgeScores ?? {};

    const hasRequiredBadges = Object.entries(
        requiredBadgeScores
    ).every(([badge, minimumScore]) => {
        const playerScore =
            player.badgeScores?.[badge] ?? 0;

        return playerScore >= minimumScore;
    });

    return hasRequiredBadges;
}

export function isTaskUnlocked(
    player,
    task,
    taskProgress
) {
    if (
        !player.postGame &&
        task.role !== player.role
    ) {
        return false;
    }

    const completedTaskIds = new Set(
        taskProgress.map(progress =>
            progress.taskId.toString()
        )
    );

    if (completedTaskIds.has(task.id.toString())) {
        return false;
    }

    if (
        !meetsRequirements(
            player,
            task.requirements,
            completedTaskIds,
            player.postGame
        )
    ) {
        return false;
    }

    const alternativeRequirements =
        task.requirements?.anyOf ?? [];

    if (alternativeRequirements.length > 0) {
        const meetsAnyAlternative =
            alternativeRequirements.some(requirements =>
                meetsRequirements(
                    player,
                    requirements,
                    completedTaskIds,
                    player.postGame
                )
            );

        if (!meetsAnyAlternative) {
            return false;
        }
    }

    return true;

}

export function getAvailableTasks(
    player,
    taskDefinitions,
    taskProgress
) {
    return taskDefinitions.filter(task =>
        isTaskUnlocked(
            player,
            task,
            taskProgress
        )
    );
}

export function canStartTask(player, task) {
    return player.stamina >= task.staminaCost;
}