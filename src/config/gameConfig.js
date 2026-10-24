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

export const NPCS = {
  ALEX: {
    id: "alex",
    name: "Alex",
    allowedFloors: [1, 2]
  }
};

export const FLOORS = [1, 2, 3];

export const MAIN_ENDINGS = [
  {
    id: "communication_inclusion_impact",
    badges: [
      BADGES.COMMUNICATION,
      BADGES.INCLUSION,
      BADGES.IMPACT
    ]
  },

  {
    id: "communication_inclusion_delivery",
    badges: [
      BADGES.COMMUNICATION,
      BADGES.INCLUSION,
      BADGES.DELIVERY
    ]
  },

  {
    id: "communication_impact_delivery",
    badges: [
      BADGES.COMMUNICATION,
      BADGES.IMPACT,
      BADGES.DELIVERY
    ]
  },

  {
    id: "inclusion_impact_delivery",
    badges: [
      BADGES.INCLUSION,
      BADGES.IMPACT,
      BADGES.DELIVERY
    ]
  }
];

export const BADGE_MASTERY_SCORE = 15;

export const SECRET_ENDING = {
  id: "all_badges_mastered",
  unlockAvatarId: "avatar-5"
};

export const DEFAULT_AVATAR_IDS = [
  "avatar-1",
  "avatar-2",
  "avatar-3",
  "avatar-4"
];