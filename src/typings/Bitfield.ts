/**
 * Data that can be resolved to give a bitfield. This can be:
 * * A bit number (this can be a number literal or a value taken from {@link BitField.Flags})
 * * A string bit number
 * * An instance of BitField
 * * An Array of BitFieldResolvable
 */
export type BitFieldResolvable =
  | bigint
  | string
  | BitField
  | BitFieldResolvable[];

/**
 * Data structure that makes it easy to interact with a bitfield.
 * @class

 */
class BitField {
  /**
   * Numeric bitfield of the packed bits
   * @type {bigint}
   */
  bitfield: bigint;

  /**
   * Numeric bitfield flags.
   * <info>Defined in extension classes</info>
   * @type {Object}
   * @memberof BitField
   * @abstract
   */
  static Flags = {};

  /**
   * @type {bigint}
   * @memberof BitField
   * @private
   */
  static DefaultBit = BigInt(0);

  /**
   * @param {BitFieldResolvable} [bits] Bit(s) to read from
   */
  constructor(bits: BitFieldResolvable) {
    /**
     * Bitfield of the packed bits
     * @type {number|bigint}
     */
    if (!bits) bits = (this.constructor as typeof BitField).DefaultBit;
    this.bitfield = (this.constructor as typeof BitField).resolve(bits);
  }

  /**
   * Checks whether the bitfield has a bit, or any of multiple bits.
   * @param {BitFieldResolvable} bit Bit(s) to check for
   * @returns {boolean}
   */
  any(bit: BitFieldResolvable) {
    return (
      (this.bitfield & (this.constructor as typeof BitField).resolve(bit)) !==
      (this.constructor as typeof BitField).DefaultBit
    );
  }

  /**
   * Checks if this bitfield equals another
   * @param {BitFieldResolvable} bit Bit(s) to check for
   * @returns {boolean}
   */
  equals(bit: BitFieldResolvable) {
    return this.bitfield === (this.constructor as typeof BitField).resolve(bit);
  }

  /**
   * Checks whether the bitfield has a bit, or multiple bits.
   * @param {BitFieldResolvable} bit Bit(s) to check for
   * @returns {boolean}
   */
  has(bit: BitFieldResolvable) {
    bit = (this.constructor as typeof BitField).resolve(bit);
    return (this.bitfield & bit) === bit;
  }

  /**
   * Gets all given bits that are missing from the bitfield.
   * @param {BitFieldResolvable} bits Bit(s) to check for
   * @param {...*} hasParams Additional parameters for the has method, if any
   * @returns {string[]}
   */
  missing(bits: BitFieldResolvable, ...hasParams: [unknown]) {
    return new (this.constructor as typeof BitField)(bits)
      .remove(this)
      .toArray(...hasParams);
  }

  /**
   * Freezes these bits, making them immutable.
   * @returns {Readonly<BitField>}
   */
  freeze() {
    return Object.freeze(this);
  }

  /**
   * Adds bits to these ones.
   * @param {...BitFieldResolvable[]} [bits] Bits to add
   * @returns {BitField} These bits or new BitField if the instance is frozen.
   */
  add(...bits: BitFieldResolvable[]) {
    let total = (this.constructor as typeof BitField).DefaultBit;
    for (const bit of bits) {
      total |= (this.constructor as typeof BitField).resolve(bit);
    }
    if (Object.isFrozen(this))
      return new (this.constructor as typeof BitField)(this.bitfield | total);
    this.bitfield |= total;
    return this;
  }

  /**
   * Removes bits from these.
   * @param {...BitFieldResolvable} [bits] Bits to remove
   * @returns {BitField} These bits or new BitField if the instance is frozen.
   */
  remove(...bits: BitFieldResolvable[]) {
    let total = (this.constructor as typeof BitField).DefaultBit;
    for (const bit of bits) {
      total |= (this.constructor as typeof BitField).resolve(bit);
    }
    if (Object.isFrozen(this))
      return new (this.constructor as typeof BitField)(this.bitfield & ~total);
    this.bitfield &= ~total;
    return this;
  }

  /**
   * Gets an object mapping field names to a {@link boolean} indicating whether the
   * bit is available.
   * @returns {Object}
   */
  serialize() {
    const serialized = {};
    for (const [flag, bit] of Object.entries(
      (this.constructor as typeof BitField).Flags
    ))
      serialized[flag] = this.has(bit);
    return serialized;
  }

  /**
   * Gets an {@link Array} of bitfield names based on the bits available.
   * @param {...*} hasParams Additional parameters for the has method, if any
   * @returns {string[]}
   */
  toArray(...hasParams: [unknown]) {
    return [...this[Symbol.iterator](...hasParams)];
  }

  toJSON() {
    return typeof this.bitfield === "number"
      ? this.bitfield
      : this.bitfield.toString();
  }

  valueOf() {
    return this.bitfield;
  }

  *[Symbol.iterator](...hasParams: [unknown]) {
    for (const bitName of Object.keys(
      (this.constructor as typeof BitField).Flags
    )) {
      // @ts-expect-error Implemented for classes extending BitField
      if (this.has(bitName, ...hasParams)) yield bitName;
    }
  }

  /**
   * Resolves bitfields to their numeric form.
   * @param {BitFieldResolvable} [bit] bit(s) to resolve
   * @returns {bigint}
   */
  static resolve(bit: BitFieldResolvable): bigint {
    const { DefaultBit } = this;
    if (typeof bit === "undefined") return DefaultBit;
    if (typeof bit === "number") bit = BigInt(bit);
    if (typeof DefaultBit === typeof bit && (bit as bigint) >= DefaultBit)
      return bit as bigint;
    if (bit instanceof BitField) return bit.bitfield;
    if (Array.isArray(bit))
      return bit
        .map((p) => this.resolve(p))
        .reduce((prev, p) => prev | p, DefaultBit);
    if (typeof bit === "string") {
      if (typeof this.Flags[bit] !== "undefined") return this.Flags[bit];
      const resolved = BigInt(bit);
      if (typeof DefaultBit === typeof resolved && resolved >= DefaultBit)
        return resolved;
    }
    throw new RangeError("Invalid BitField " + bit);
  }
}

export { BitField };
