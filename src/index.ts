export { transliterate } from './transliterate.js'
export { reverse } from './reverse.js'
export { isRovas, isLatin, toCodePoints, convertNumber } from './utils.js'
export { VOWELS, CONSONANTS, NUMBERS, PUNCTUATION, PHONEME_MAP } from './alphabet.js'
export type { TransliterateOptions, TransliterateResult } from './types.js'

import { transliterate } from './transliterate.js'
import { reverse } from './reverse.js'
import type { TransliterateOptions } from './types.js'

/**
 * Convert Latin Hungarian text to a rovásírás Unicode string.
 *
 * Short alias for `transliterate(input, options).rovas`.
 * Use `transliterate()` directly when you need the token breakdown or the
 * normalised Latin string.
 *
 * @param input   - Latin Hungarian text (case-insensitive)
 * @param options - Optional transliteration settings (vowelOmission, longVowels, mirrorPunctuation)
 * @returns Rovásírás Unicode string (render RTL)
 *
 * @example
 * toRovas('magyar') // → '𐳞𐳀𐳎𐳀𐳤'
 * toRovas('szép', { longVowels: 'classical' })
 */
export const toRovas = (input: string, options?: TransliterateOptions): string =>
  transliterate(input, options).rovas

/**
 * Convert a rovásírás Unicode string back to Latin Hungarian.
 *
 * Short alias for `reverse()`. Best-effort — vowels omitted during
 * transliteration cannot be recovered.
 *
 * @param rovas - Rovásírás Unicode string produced by `toRovas()` or `transliterate()`
 * @returns Latin Hungarian string (always lowercase)
 *
 * @example
 * toLatin(toRovas('szép')) // → 'szép'
 */
export const toLatin = reverse
