import { XP_COHERENCE_BONUS } from "../config/gameConfig.js";

export class TaskDefinition {
    constructor(
        id,
        title,
        description,
        role,
        mandatory,
        difficulty,
        staminaCost,
        timeCost,
        baseXp,
        floor,
        sourceType,
        sourceId,
        requirements = {},
        choices = []
    ) {
        this.id = id;
        this.title = title;
        this.description = description;

        this.role = role;
        this.mandatory = mandatory;
        this.difficulty = difficulty;

        this.staminaCost = staminaCost;
        this.timeCost = timeCost;
        this.baseXp = baseXp;

        this.floor = floor;
        this.sourceType = sourceType;
        this.sourceId = sourceId;

        this.requirements = requirements;
        this.choices = choices;
    }

    getChoice(choiceId) {
        const choice = this.choices.find(
            currentChoice => currentChoice.id === choiceId
        );

        if (!choice) {
            throw new Error("Invalid task choice");
        }

        return choice;
    }

    calculateXp(choiceId, dominantBadges) {
        const choice = this.getChoice(choiceId);

        const choiceBadges = Object.keys(choice.badgeImpact);

        const matches = choiceBadges.filter(
            badge => dominantBadges.includes(badge)
        ).length;

        let bonus = 0;

        if (matches === 1) {
            bonus = XP_COHERENCE_BONUS.ONE_MATCH;
        }

        if (matches >= 2) {
            bonus = XP_COHERENCE_BONUS.TWO_MATCHES;
        }

        return Math.round(
            this.baseXp * (1 + bonus)
        );
    }
}