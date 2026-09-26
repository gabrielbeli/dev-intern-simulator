export class Intern {
    
    constructor(name, role = "Intern", level = 1, xp = 0, skills = ["JavaScript"]) {
        this.name = name;
        this.role = role;
        this.level = level;
        this.xp = xp;
        this.skills = skills;
    }

    gainXp(amount) {
        this.xp = this.xp + amount;

        while (this.xp >= this.level * 100) {
            this.level = this.level + 1;
        }
    }

    addSkill(skill) {
        this.skills.push(skill);
    }
}