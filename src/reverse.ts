import { buildReverseMap } from './alphabet.js'

// DZ and DZS are multi-codepoint — handle explicitly
const DZ_ROVAS  = '\u{10CC7}\u{10CEF}'   // D + Z
const DZS_ROVAS = '\u{10CC7}\u{10CF0}'   // D + ZS

const reverseMap = buildReverseMap()

/**
 * Convert a rovásírás Unicode string back to Latin Hungarian.
 *
 * ⚠️  This is a best-effort reverse operation. If the input was created with
 * `vowelOmission: true`, the vowels are permanently lost and cannot be recovered.
 * The output in that case will be consonant-only, readable by fluent speakers
 * but not by the library.
 *
 * Surrogate pairs (SMP codepoints) are handled via Array.from / codePointAt
 * so a single rovás letter always counts as one character regardless of its
 * UTF-16 encoding width.
 */
export function reverse(rovas: string): string {
  const chars = Array.from(rovas) // correctly splits surrogate pairs
  const result: string[] = []
  let i = 0

  while (i < chars.length) {
    // Try 2-char sequences first (DZS = D + ZS, DZ = D + Z)
    const twoChar = (chars[i] ?? '') + (chars[i + 1] ?? '')

    if (twoChar === DZS_ROVAS) {
      result.push('dzs')
      i += 2
      continue
    }
    if (twoChar === DZ_ROVAS) {
      result.push('dz')
      i += 2
      continue
    }

    const ch = chars[i]!
    const latin = reverseMap.get(ch)

    if (latin) {
      result.push(latin)
    } else {
      // Pass-through: spaces, punctuation, unknown chars
      result.push(ch)
    }
    i++
  }

  return result.join('')
}
