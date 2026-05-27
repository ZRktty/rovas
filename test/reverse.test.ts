import { describe, it, expect } from 'vitest'
import { transliterate } from '../src/transliterate.js'
import { reverse } from '../src/reverse.js'

describe('reverse — basic round-trips', () => {
  /**
   * For words without vowel omission, transliterate → reverse should be lossless.
   * The output is always lowercase (rovás has no case distinction in phoneme value).
   */

  const roundtripWords = [
    'magyar',
    'budapest',
    'pécs',
    'győr',
    'szép',
    'öröm',
    'egészség',
  ]

  for (const word of roundtripWords) {
    it(`round-trip: "${word}" → rovas → "${word}"`, () => {
      const rovas = transliterate(word).rovas
      const backToLatin = reverse(rovas)
      expect(backToLatin).toBe(word)
    })
  }
})

describe('reverse — digraphs', () => {
  it('cs digraph survives round-trip', () => {
    const { rovas } = transliterate('cs')
    expect(reverse(rovas)).toBe('cs')
  })

  it('sz digraph survives round-trip', () => {
    expect(reverse(transliterate('sz').rovas)).toBe('sz')
  })

  it('dzs survives round-trip', () => {
    expect(reverse(transliterate('dzs').rovas)).toBe('dzs')
  })

  it('dz survives round-trip', () => {
    expect(reverse(transliterate('dz').rovas)).toBe('dz')
  })
})

describe('reverse — spaces preserved', () => {
  it('spaces are preserved through reverse', () => {
    const { rovas } = transliterate('egy két')
    const result = reverse(rovas)
    expect(result).toContain(' ')
    expect(result).toBe('egy két')
  })
})

describe('reverse — vowel omission is lossy', () => {
  it('with vowelOmission:true, reverse cannot recover vowels', () => {
    const consonantsOnly = transliterate('magyar', { vowelOmission: true }).rovas
    const recovered = reverse(consonantsOnly)
    // Should NOT equal 'magyar' — vowels are gone
    expect(recovered).not.toBe('magyar')
    // But should contain the consonants m, gy, r
    expect(recovered).toContain('m')
    expect(recovered).toContain('r')
  })
})
