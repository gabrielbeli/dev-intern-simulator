export const BADGES = {
  COMMUNICATION: "communication",
  INCLUSION: "inclusion",
  IMPACT: "impact",
  DELIVERY: "delivery"
};

export const XP_COHERENCE_BONUS = {
  ONE_MATCH: 0.10,
  TWO_MATCHES: 0.20
};

export const ROLES = {
  INTERN: {
    name: "Intern",
    xpRequired: 350,
    totalTasks: 12,
    nextRole: "Intern Bronze"
  },

  INTERN_BRONZE: {
    name: "Intern Bronze",
    xpRequired: 850,
    totalTasks: 13,
    nextRole: "Intern Silver"
  },

  INTERN_SILVER: {
    name: "Intern Silver",
    xpRequired: 1450,
    totalTasks: 14,
    nextRole: "Intern Gold"
  },

  INTERN_GOLD: {
    name: "Intern Gold",
    xpRequired: 2200,
    totalTasks: 16,
    nextRole: "Junior"
  },

  JUNIOR: {
    name: "Junior",
    xpRequired: null,
    totalTasks: 0,
    nextRole: null
  }
};