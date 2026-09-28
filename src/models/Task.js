export class Task {
    constructor(
        id,
        title,
        type,
        difficulty,
        xpReward,
        status = "pending",
        internId = null
  ) {
        this.id = id;
        this.title = title;
        this.type = type;
        this.difficulty = difficulty;
        this.xpReward = xpReward;
        this.status = status;
        this.internId = internId;
    }

    complete() {
        if (this.status === "completed") {
            throw new Error("Task already completed");
        }

        this.status = "completed";
    }

}