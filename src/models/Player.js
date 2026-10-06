import { BADGES } from "../config/gameConfig.js";

export class Player {
    constructor(
        id,
        userId,
        name,
        avatarId,
        role = "Intern",
        xp = 0,
        stamina = 100,
        maxStamina = 100,
        exhausted = false,
        day = 1,
        usedTimeBlocks = 0,
        coffeeCount = 0,
        badgeScores = {
            communication: 0,
            inclusion: 0,
            impact: 0,
            delivery: 0
        },
        badgeRecency = [],
        ending = null,
        postGame = false,

        currentFloor = 1,
        position = {
            row: 1,
            col: 1
        }
    ) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.avatarId = avatarId;
        this.role = role;
        this.xp = xp;

        this.stamina = stamina;
        this.maxStamina = maxStamina;
        this.exhausted = exhausted;

        this.day = day;
        this.usedTimeBlocks = usedTimeBlocks;
        this.coffeeCount = coffeeCount;

        this.badgeScores = badgeScores;
        this.badgeRecency = badgeRecency;

        this.ending = ending;
        this.postGame = postGame;

        this.currentFloor = currentFloor;
        this.position = position;
    }

    addBadgePoints(badge, amount) {
        const validBadges = Object.values(BADGES);

        if (!validBadges.includes(badge)) {
            throw new Error("Invalid badge");
        }

        if (amount <= 0) {
            throw new Error("Badge points must be greater than zero");
        }

        this.badgeScores[badge] += amount;

        this.badgeRecency = [
            badge,
            ...this.badgeRecency.filter(
                currentBadge => currentBadge !== badge
            )
        ];
    }

    getDominantBadges(limit = 3) {

        return Object.entries(this.badgeScores)
            .filter(([, score]) => score > 0)
            .sort(([badgeA, scoreA], [badgeB, scoreB]) => {

                if (scoreA !== scoreB) {
                    return scoreB - scoreA;
                }

                const indexA = this.badgeRecency.indexOf(badgeA);
                const indexB = this.badgeRecency.indexOf(badgeB);

                return indexA - indexB;
            })
            .slice(0, limit)
            .map(([badge]) => badge);
    }

    addXp(amount) {
        if (amount <= 0) {
            throw new Error("XP amount must be greater than zero");
        }

        this.xp += amount;
    }

    spendXp(amount) {
        if (amount <= 0) {
            throw new Error("XP cost must be greater than zero");
        }

        if (amount > this.xp) {
            throw new Error("Not enough XP");
        }

        this.xp -= amount;
    }

    spendStamina(amount) {
        if (amount <= 0) {
            throw new Error("Stamina cost must be greater than zero");
        }

        if (amount > this.stamina) {
            throw new Error("Not enough stamina");
        }

        this.stamina -= amount;
    }

    useTimeBlocks(amount) {
        if (!Number.isInteger(amount) || amount <= 0) {
            throw new Error("Time blocks must be a positive integer");
        }

        this.usedTimeBlocks += amount;
    }
}

