/**
 * Types adapted from discord.js's UserFlags class
 * @link {https://github.com/discordjs/discord-api-types/blob/052ceb2d02da4f71cf619511a3eb47b1844237fe/payloads/v10/user.ts}
 */

/**
 * User flags
 */
const StaffFlags = {
  // -- GLOBAL ROLES -- //

  /**
   * Owner
   */
  Owner: BigInt(1 << 0),
  /**
   * Maintainer
   */
  Maintainer: BigInt(1 << 1),
  /**
   * Moderator
   */
  Moderator: BigInt(1 << 2),
  /**
   * Donator
   */
  Donator: BigInt(1 << 5)
} as const;

export { StaffFlags };
