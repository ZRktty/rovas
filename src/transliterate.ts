import { PHONEME_MAP, VOWELS, PUNCTUATION } from './alphabet.js'
import type { TransliterateOptions, TransliterateResult } from './types.js'

const LONG_TO_SHORT: Record<string, string> = {
  á: 'a', é: 'e', í: 'i', ó: 'o', ő: 'ö', ú: 'u', ű: 'ü',
}

const VOWEL_SET = new Set(Object.keys(VOWELS))

/**
 * Transliterate Latin Hungarian text into rovásírás Unicode.
 *
 * The engine uses a greedy longest-match scan over the lowercased input,
 * consuming digraphs (cs, sz, gy, ny, ly, ty, zs, dz, dzs) before their
 * constituent single letters.
 *
 * The output string is stored left-to-right in memory (as Unicode requires),
 * but should be rendered RTL — wrap it in a `<span dir="rtl">` or apply
 * the CSS `unicode-bidi: bidi-override; direction: rtl` for correct display.
 *
 * @example
 * transliterate('magyar')
 * // { rovas: '𐳞𐳀𐳎𐳀𐳤', latin: 'magyar', tokens: [...] }
 */
export function transliterate(
  input: string,
  options: TransliterateOptions = {},
): TransliterateResult {
  const {
    vowelOmission = false,
    longVowels = 'modern',
    mirrorPunctuation = false,
  } = options

  const normalised = input.toLowerCase()
  const tokens: TransliterateResult['tokens'] = []
  let i = 0

  while (i < normalised.length) {
    const remaining = normalised.slice(i)

    // Whitespace — pass through
    if (remaining[0] === ' ' || remaining[0] === '\n' || remaining[0] === '\t') {
      tokens.push({ latin: remaining[0]!, rovas: remaining[0]! })
      i++
      continue
    }

    // Punctuation
    if (mirrorPunctuation && remaining[0] && PUNCTUATION[remaining[0]]) {
      const ch = remaining[0]!
      tokens.push({ latin: ch, rovas: PUNCTUATION[ch]! })
      i++
      continue
    }

    // Greedy phoneme match (already sorted longest-first)
    let matched = false
    for (const [latin, rovas] of PHONEME_MAP) {
      if (remaining.startsWith(latin)) {
        const isVowel = VOWEL_SET.has(latin)
        const isLongVowel = latin in LONG_TO_SHORT

        // Vowel omission: skip vowels entirely
        if (vowelOmission && isVowel) {
          tokens.push({ latin, rovas: '' })
          i += latin.length
          matched = true
          break
        }

        // Classical long vowels: substitute short codepoint
        let effectiveRovas = rovas
        if (longVowels === 'classical' && isLongVowel) {
          const shortLatin = LONG_TO_SHORT[latin]!
          const shortRovas = PHONEME_MAP.find(([l]) => l === shortLatin)?.[1]
          if (shortRovas) effectiveRovas = shortRovas
        }

        tokens.push({ latin, rovas: effectiveRovas })
        i += latin.length
        matched = true
        break
      }
    }

    // Unknown character — pass through as-is (digits, foreign chars, punctuation)
    if (!matched) {
      tokens.push({ latin: remaining[0]!, rovas: remaining[0]! })
      i++
    }
  }

  return {
    rovas: tokens.map(t => t.rovas).join(''),
    latin: normalised,
    tokens,
  }
}
