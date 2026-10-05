import { ROLES } from "../config/gameConfig.js";

export function getRoleConfig(roleName) {
  const roleConfig = Object.values(ROLES).find(
    role => role.name === roleName
  );

  if (!roleConfig) {
    throw new Error("Invalid role");
  }

  return roleConfig;
}

export function canPromotePlayer(
  player,
  taskDefinitions,
  taskProgress
) {
  const roleConfig = getRoleConfig(player.role);

  if (!roleConfig.nextRole) {
    return false;
  }

  if (player.xp < roleConfig.xpRequired) {
    return false;
  }

  const mandatoryTasks = taskDefinitions.filter(
    task =>
      task.role === player.role &&
      task.mandatory
  );

  const completedTaskIds = new Set(
    taskProgress.map(progress =>
      progress.taskId.toString()
    )
  );

  const completedAllMandatoryTasks = mandatoryTasks.every(
    task =>
      completedTaskIds.has(task.id.toString())
  );

  return completedAllMandatoryTasks;
}

export function promotePlayer(
  player,
  taskDefinitions,
  taskProgress
) {
  const canPromote = canPromotePlayer(
    player,
    taskDefinitions,
    taskProgress
  );

  if (!canPromote) {
    throw new Error("Player is not eligible for promotion");
  }

  const roleConfig = getRoleConfig(player.role);

  player.role = roleConfig.nextRole;

  return player;
}