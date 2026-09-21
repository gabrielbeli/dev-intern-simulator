import { welcomeIntern, intern, gainXp, addSkill, getInternSummary, getXpToNextLevel } from "./intern.js";

const message = welcomeIntern("Gabriel");

console.log(message);
console.log(intern);
console.log(intern.name);
console.log(intern.skills[0]);

gainXp(350);
addSkill("Node.js");

const summary = getInternSummary();
const nextLevel = getXpToNextLevel();

console.log(intern);
console.log(summary);
console.log(nextLevel);
