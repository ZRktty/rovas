export { transliterate } from './transliterate.js'
export { reverse } from './reverse.js'
export { isRovas, isLatin, toCodePoints, convertNumber } from './utils.js'
export { VOWELS, CONSONANTS, NUMBERS, PUNCTUATION, PHONEME_MAP } from './alphabet.js'
export type { TransliterateOptions, TransliterateResult } from './types.js'

import { transliterate } from './transliterate.js'
import { reverse } from './reverse.js'
import type { TransliterateOptions } from './types.js'

export const toRovas = (input: string, options?: TransliterateOptions): string =>
  transliterate(input, options).rovas

export const toLatin = reverse
