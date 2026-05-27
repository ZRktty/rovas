import { describe, it, expect } from 'vitest'
import { VOWELS, CONSONANTS, PHONEME_MAP, NUMBERS } from '../src/alphabet.js'

describe('alphabet map', () => {
  describe('vowels', () => {
    // Source: Unicode 8.0 block U+10CC0–U+10CED
    // https://unicode.org/charts/PDF/U10C80.pdf

    it('maps all 14 Hungarian vowels (a á e é i í o ó ö ő u ú ü ű)', () => {
      const vowelKeys = Object.keys(VOWELS)
      expect(vowelKeys).toHaveLength(14)
      expect(vowelKeys).toContain('a')
      expect(vowelKeys).toContain('á')
      expect(vowelKeys).toContain('ö')
      expect(vowelKeys).toContain('ő')
      expect(vowelKeys).toContain('ü')
      expect(vowelKeys).toContain('ű')
    })

    it('a → U+10CC0 (OLD HUNGARIAN SMALL LETTER A)', () => {
      expect(VOWELS['a']?.codePointAt(0)?.toString(16).toUpperCase()).toBe('10CC0')
    })

    it('á → U+10CC1 (OLD HUNGARIAN SMALL LETTER AA — long A)', () => {
      expect(VOWELS['á']?.codePointAt(0)?.toString(16).toUpperCase()).toBe('10CC1')
    })

    it('ö → U+10CDD (OLD HUNGARIAN SMALL LETTER NIKOLSBURG OE)', () => {
      expect(VOWELS['ö']?.codePointAt(0)?.toString(16).toUpperCase()).toBe('10CDD')
    })

    it('all vowel codepoints are in the Old Hungarian Unicode block (U+10C80–U+10CFF)', () => {
      for (const [latin, rovas] of Object.entries(VOWELS)) {
        const cp = rovas.codePointAt(0) ?? 0
        expect(cp, `vowel '${latin}' codepoint out of range`).toBeGreaterThanOrEqual(0x10C80)
        expect(cp, `vowel '${latin}' codepoint out of range`).toBeLessThanOrEqual(0x10CFF)
      }
    })
  })

  describe('consonants', () => {
    it('contains all standard Hungarian consonants', () => {
      const required = ['b','c','cs','d','dz','dzs','f','g','gy','h','j','k','l',
                        'ly','m','n','ny','p','r','s','sz','t','ty','v','z','zs']
      for (const c of required) {
        expect(CONSONANTS, `missing consonant '${c}'`).toHaveProperty(c)
      }
    })

    it('sz → U+10CE5 (OLD HUNGARIAN SMALL LETTER ESZ)', () => {
      // Source: oldhungarian.eu — SZ is one of the most common Hungarian digraphs
      expect(CONSONANTS['sz']?.codePointAt(0)?.toString(16).toUpperCase()).toBe('10CE5')
    })

    it('gy → U+10CCE (OLD HUNGARIAN SMALL LETTER EGY)', () => {
      expect(CONSONANTS['gy']?.codePointAt(0)?.toString(16).toUpperCase()).toBe('10CCE')
    })

    it('zs → U+10CF0 (OLD HUNGARIAN SMALL LETTER EZS)', () => {
      expect(CONSONANTS['zs']?.codePointAt(0)?.toString(16).toUpperCase()).toBe('10CF0')
    })
  })

  describe('phoneme map ordering', () => {
    it('dzs (3 chars) comes before dz (2 chars) which comes before d (1 char)', () => {
      const keys = PHONEME_MAP.map(([k]) => k)
      const idxDzs = keys.indexOf('dzs')
      const idxDz  = keys.indexOf('dz')
      const idxD   = keys.indexOf('d')
      expect(idxDzs).toBeLessThan(idxDz)
      expect(idxDz).toBeLessThan(idxD)
    })

    it('cs (2 chars) comes before c and s individually', () => {
      const keys = PHONEME_MAP.map(([k]) => k)
      expect(keys.indexOf('cs')).toBeLessThan(keys.indexOf('c'))
      expect(keys.indexOf('cs')).toBeLessThan(keys.indexOf('s'))
    })
  })

  describe('numbers', () => {
    // Source: Unicode 8.0 U+10CFA–U+10CFF
    it('has codepoints for 1, 5, 10, 50, 100, 1000', () => {
      expect(NUMBERS['1']?.codePointAt(0)?.toString(16).toUpperCase()).toBe('10CFA')
      expect(NUMBERS['5']?.codePointAt(0)?.toString(16).toUpperCase()).toBe('10CFB')
      expect(NUMBERS['10']?.codePointAt(0)?.toString(16).toUpperCase()).toBe('10CFC')
      expect(NUMBERS['50']?.codePointAt(0)?.toString(16).toUpperCase()).toBe('10CFD')
      expect(NUMBERS['100']?.codePointAt(0)?.toString(16).toUpperCase()).toBe('10CFE')
      expect(NUMBERS['1000']?.codePointAt(0)?.toString(16).toUpperCase()).toBe('10CFF')
    })
  })
})
