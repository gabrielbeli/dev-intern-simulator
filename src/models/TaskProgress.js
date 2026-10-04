export class TaskProgress {
    constructor(
        id,
        playerId,
        taskId,
        choiceId,
        xpEarned,
        staminaSpent,
        timeSpent,
        badgeImpact,
        dayCompleted,
        completedAt = new Date()
    ) {
        this.id = id;
        this.playerId = playerId;
        this.taskId = taskId;

        this.choiceId = choiceId;

        this.xpEarned = xpEarned;
        this.staminaSpent = staminaSpent;
        this.timeSpent = timeSpent;
        this.badgeImpact = badgeImpact;

        this.dayCompleted = dayCompleted;
        this.completedAt = completedAt;
    }
}