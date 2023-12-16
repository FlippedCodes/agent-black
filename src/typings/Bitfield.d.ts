import { BitFieldResolvable } from 'discord.js';
import { StaffFlags } from './StaffFlags';

export class BitField<S extends string, N extends number | bigint = number> {
  public constructor(bits?: BitFieldResolvable<S, N>);
  public bitfield: N;
  public add(...bits: BitFieldResolvable<S, N>[]): BitField<S, N>;
  public any(bit: BitFieldResolvable<S, N>): boolean;
  public equals(bit: BitFieldResolvable<S, N>): boolean;
  public freeze(): Readonly<BitField<S, N>>;
  public has(bit: BitFieldResolvable<S, N>): boolean;
  public missing(bits: BitFieldResolvable<S, N>, ...hasParams: readonly unknown[]): S[];
  public remove(...bits: BitFieldResolvable<S, N>[]): BitField<S, N>;
  public serialize(...hasParams: readonly unknown[]): Record<S, boolean>;
  public toArray(...hasParams: readonly unknown[]): S[];
  public toJSON(): N extends number ? number : string;
  public valueOf(): N;
  public [Symbol.iterator](): IterableIterator<S>;
  public static Flags: EnumLike<unknown, number | bigint>;
  public static resolve(bit?: BitFieldResolvable<string, number | bigint>): number | bigint;
}
export type StaffFlagsString = keyof typeof StaffFlags;
export type StaffFlagResolvable = BitFieldResolvable<StaffFlagsString, bigint>;
export class StaffFlagsBitField extends BitField<StaffFlagsString, bigint> {
  public any(StaffFlag: StaffFlagResolvable, checkAdmin?: boolean): boolean;
  public has(StaffFlag: StaffFlagResolvable, checkAdmin?: boolean): boolean;
  public missing(bits: BitFieldResolvable<StaffFlagsString, bigint>, checkAdmin?: boolean): StaffFlagsString[];
  public serialize(checkAdmin?: boolean): Record<StaffFlagsString, boolean>;
  public toArray(): StaffFlagsString[];

  public static All: bigint;
  public static Default: bigint;
  public static StageModerator: bigint;
  public static Flags: typeof StaffFlagBits;
  public static resolve(StaffFlag?: StaffFlagResolvable): bigint;
}
