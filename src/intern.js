export function welcomeIntern(name) {
    return `Welcome to Dev Corp, ${name}!`;
}

export const intern = {
  name: "Gabriel",
  role: "Intern",
  level: 1,
  xp: 0,
  skills: ["JavaScript"]
};

export function gainXp(amount) {
    intern.xp = intern.xp + amount;

    while (intern.xp >= intern.level * 100) {
        intern.level = intern.level + 1;
    }
}

export function addSkill(skill) {
    intern.skills.push(skill);
}

export function getInternSummary() {
    return `${intern.name} | Level ${intern.level} | XP: ${intern.xp}`;
}

export function getXpToNextLevel() {
    const requiredXP = intern.level * 100;

    return `Faltam ${requiredXP - intern.xp} XP para subir de level!`;
}