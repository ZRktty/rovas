import { NUMBERS } from './alphabet.js'

const ROVAS_RANGE_START = 0x10C80
const ROVAS_RANGE_END   = 0x10CFF

/**
 * Returns true if the string contains at least one Old Hungarian Unicode codepoint.
 */
export function isRovas(text: string): boolean {
  for (const ch of text) {
    const cp = ch.codePointAt(0) ?? 0
    if (cp >= ROVAS_RANGE_START && cp <= ROVAS_RANGE_END) return true
  }
  return false
}

/**
 * Returns true if the string contains no Old Hungarian codepoints
 * (i.e. it's plain Latin / other script).
 */
export function isLatin(text: string): boolean {
  return !isRovas(text)
}

/**
 * Returns an array of Unicode code point strings for each character.
 * Useful for debugging or educational display.
 *
 * @example
 * toCodePoints('𐳀𐳁') // → ['U+10CC0', 'U+10CC1']
 */
export function toCodePoints(text: string): string[] {
  return Array.from(text).map(ch => {
    const cp = ch.codePointAt(0) ?? 0
    return `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`
  })
}

/**
 * Convert an Arabic numeral to its rovásírás representation.
 * Uses a quasi-Roman additive system: the number is broken down into
 * the standard denominations (1000, 100, 50, 10, 5, 1) and each
 * denomination is repeated as many times as needed.
 *
 * @example
 * convertNumber(1995) // → '𐳿𐳾𐳾𐳾𐳾𐳾𐳽𐳼𐳼𐳼𐳼𐳻'
 */
export function convertNumber(n: number): string {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError('convertNumber only accepts non-negative integers')
  }
  if (n === 0) return NUMBERS['1']! // convention: 0 has no glyph, render as 1 placeholder

  const denominations = [1000, 100, 50, 10, 5, 1] as const
  let remaining = n
  let result = ''

  for (const denom of denominations) {
    const count = Math.floor(remaining / denom)
    if (count > 0) {
      result += NUMBERS[String(denom)]!.repeat(count)
      remaining -= count * denom
    }
  }

  return result
}
