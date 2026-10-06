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

export const WORKDAY = {
  NORMAL_TIME_BLOCKS: 8,

  MAX_STAMINA: 100,

  NORMAL_NEXT_DAY_STAMINA: 100,
  EXHAUSTED_NEXT_DAY_STAMINA: 70
};

export const COFFEE = {
  STAMINA_RECOVERY: 20,
  XP_COST: 5,
  DAILY_LIMIT: 5,
  OVERUSE_XP_MULTIPLIER: 0.75
};