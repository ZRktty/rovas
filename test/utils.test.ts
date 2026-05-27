import { describe, it, expect } from 'vitest'
import { isRovas, isLatin, toCodePoints, convertNumber } from '../src/utils.js'
import { transliterate } from '../src/transliterate.js'

describe('isRovas', () => {
  it('returns true for a rovásírás string', () => {
    const { rovas } = transliterate('magyar')
    expect(isRovas(rovas)).toBe(true)
  })

  it('returns false for plain Latin text', () => {
    expect(isRovas('hello world')).toBe(false)
  })

  it('returns true for mixed string containing at least one rovas char', () => {
    const { rovas } = transliterate('a')
    expect(isRovas('prefix ' + rovas)).toBe(true)
  })

  it('returns false for empty string', () => {
    expect(isRovas('')).toBe(false)
  })
})

describe('isLatin', () => {
  it('returns true for plain text', () => {
    expect(isLatin('budapest')).toBe(true)
  })

  it('returns false for rovásírás string', () => {
    const { rovas } = transliterate('magyar')
    expect(isLatin(rovas)).toBe(false)
  })
})

describe('toCodePoints', () => {
  it('returns U+10CC0 for the rovás "a" character', () => {
    const { rovas } = transliterate('a')
    expect(toCodePoints(rovas)).toContain('U+10CC0')
  })

  it('returns correct number of entries (one per codepoint, not UTF-16 unit)', () => {
    // 'ab' → 2 rovas chars → 2 codepoints, even though each is a surrogate pair in UTF-16
    const { rovas } = transliterate('ab')
    expect(toCodePoints(rovas)).toHaveLength(2)
  })

  it('formats codepoints as U+XXXXX with uppercase hex', () => {
    const { rovas } = transliterate('a')
    const points = toCodePoints(rovas)
    expect(points[0]).toMatch(/^U\+[0-9A-F]+$/)
  })
})

describe('convertNumber', () => {
  // Source: Old Hungarian number system is quasi-Roman / additive
  // Denominations: 1, 5, 10, 50, 100, 1000
  // Codepoints: U+10CFA (1) through U+10CFF (1000)

  it('1 → single 𐳺 (U+10CFA)', () => {
    const result = convertNumber(1)
    expect(result.codePointAt(0)?.toString(16).toUpperCase()).toBe('10CFA')
  })

  it('5 → single 𐳻 (U+10CFB)', () => {
    const result = convertNumber(5)
    expect(result.codePointAt(0)?.toString(16).toUpperCase()).toBe('10CFB')
  })

  it('2 → two 1-glyphs (𐳺𐳺)', () => {
    const result = convertNumber(2)
    expect([...result]).toHaveLength(2)
  })

  it('10 → single 𐳼 (U+10CFC)', () => {
    const result = convertNumber(10)
    expect(result.codePointAt(0)?.toString(16).toUpperCase()).toBe('10CFC')
  })

  it('11 → 𐳼 + 𐳺 (10 + 1)', () => {
    const result = convertNumber(11)
    const chars = Array.from(result)
    expect(chars).toHaveLength(2)
    expect(chars[0]?.codePointAt(0)?.toString(16).toUpperCase()).toBe('10CFC') // 10
    expect(chars[1]?.codePointAt(0)?.toString(16).toUpperCase()).toBe('10CFA') // 1
  })

  it('1995 → correct decomposition (1000+100×9+50+10×4+5)', () => {
    const result = convertNumber(1995)
    const chars = Array.from(result)
    // 1000: 1×, 100: 9×, 50: 1×, 10: 4×, 5: 1×, 1: 0×  → total 16 glyphs
    expect(chars).toHaveLength(16)
  })

  it('throws RangeError for negative numbers', () => {
    expect(() => convertNumber(-1)).toThrow(RangeError)
  })

  it('throws RangeError for non-integers', () => {
    expect(() => convertNumber(1.5)).toThrow(RangeError)
  })
})
