import { StaffFlags } from './StaffFlags.ts';
import { BitField, BitFieldResolvable } from './Bitfield.ts';

/**
 * Data structure that makes it easy to interact with a user flag bitfield.
 * @extends {BitField}
 */
class StaffFlagsBitField extends BitField {
  /**
   * Numeric user flags.
   * @type {StaffFlags}
   * @memberof StaffFlagsBitField
   */
  static Flags = StaffFlags;

  /**
   * Bitfield representing every flag combined
   * @type {bigint}
   * @memberof StaffFlagsBitField
   */
  static All = Object.values(this.Flags)
    .filter((v) => typeof v !== 'string')
    .reduce((all, p) => BigInt(all) | BigInt(p), BigInt(0));

  /**
   * Bitfield representing the default user flags for staff members
   * @type {bigint}
   * @memberof StaffFlagsBitField
   */
  static Default = BigInt(0);

  /**
   * @type {bigint}
   * @memberof StaffFlagsBitField
   * @private
   */
  static DefaultBit = BigInt(0);

  /**
   * Bitfield of the packed bits
   * @type {bigint}
   * @name StaffFlagsBitField#bitfield
   */

  /**
   * @param {BitFieldResolvable} [bits] Bit(s) to read from
   */
  constructor(bits: BitFieldResolvable) {
    super(bits)
  }

  /**
   * Gets all given bits that are missing from the bitfield.
   * @param {BitFieldResolvable[]} bits Bit(s) to check for
   * @param {boolean} [checkAdmin=true] Whether to allow the maintainer flag to override
   * @returns {string[]}
   */
  missing(bits: BitFieldResolvable[], checkAdmin = true): string[] {
    return checkAdmin && super.has(StaffFlags.Maintainer) ? [] : super.missing(bits, null);
  }

  /**
   * Checks whether the bitfield has a flag, or any of multiple flags.
   * @param {BitFieldResolvable} flag Flag(s) to check for
   * @param {boolean} [checkAdmin=true] Whether to allow the maintainer flag to override
   * @returns {boolean}
   */
  any(flag: BitFieldResolvable, checkAdmin = true): boolean {
    return (checkAdmin && super.has(StaffFlags.Maintainer)) || super.any(flag);
  }

  /**
   * Checks whether the bitfield has a flag, or multiple flags.
   * @param {BitFieldResolvable} flag Flag(s) to check for
   * @param {boolean} [checkAdmin=true] Whether to allow the maintainer flag to override
   * @returns {boolean}
   */
  has(flag: BitFieldResolvable, checkAdmin = true): boolean {
    return (checkAdmin && super.has(StaffFlags.Maintainer)) || super.has(flag);
  }

  /**
   * Gets an {@link Array} of bitfield names based on the flags available.
   * @returns {string[]}
   */
  toArray(): string[] {
    return super.toArray(false);
  }
}

export default StaffFlagsBitField;
