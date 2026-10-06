import { COFFEE } from "../config/gameConfig.js";

export function hasCoffeeOverusePenalty(player) {
    return player.coffeeCount > COFFEE.DAILY_LIMIT;
}

export function drinkCoffee(player) {
    if (player.stamina >= player.maxStamina) {
        throw new Error("Stamina is already full");
    }

    player.spendXp(COFFEE.XP_COST);

    player.stamina = Math.min(
        player.stamina + COFFEE.STAMINA_RECOVERY,
        player.maxStamina
    );

    player.coffeeCount += 1;

    return {
        player,
        overusePenalty: hasCoffeeOverusePenalty(player)
    };
}

export function applyCoffeeXpModifier(player, xp) {
  if (!hasCoffeeOverusePenalty(player)) {
    return xp;
  }

  return Math.round(
    xp * COFFEE.OVERUSE_XP_MULTIPLIER
  );
}