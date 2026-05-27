import { describe, it, expect } from 'vitest'
import { transliterate } from '../src/transliterate.js'
import { toCodePoints } from '../src/utils.js'

// ─── Helper ───────────────────────────────────────────────────────────────────

/** Returns the list of codepoint strings for the rovas output, easier to assert */
const cp = (input: string, opts = {}) =>
  toCodePoints(transliterate(input, opts).rovas.replace(/ /g, ''))

// ─── Single letters ───────────────────────────────────────────────────────────

describe('transliterate — single vowels', () => {
  // Each codepoint verified against: https://unicode.org/charts/PDF/U10C80.pdf

  it('a → U+10CC0', () => expect(cp('a')).toContain('U+10CC0'))
  it('á → U+10CC1', () => expect(cp('á')).toContain('U+10CC1'))
  it('e → U+10CC9', () => expect(cp('e')).toContain('U+10CC9'))
  it('é → U+10CCB', () => expect(cp('é')).toContain('U+10CCB'))
  it('i → U+10CD0', () => expect(cp('i')).toContain('U+10CD0'))
  it('í → U+10CD1', () => expect(cp('í')).toContain('U+10CD1'))
  it('o → U+10CDB', () => expect(cp('o')).toContain('U+10CDB'))
  it('ó → U+10CDC', () => expect(cp('ó')).toContain('U+10CDC'))
  it('ö → U+10CDD', () => expect(cp('ö')).toContain('U+10CDD'))
  it('ő → U+10CDF', () => expect(cp('ő')).toContain('U+10CDF'))
  it('u → U+10CEA', () => expect(cp('u')).toContain('U+10CEA'))
  it('ú → U+10CEB', () => expect(cp('ú')).toContain('U+10CEB'))
  it('ü → U+10CEC', () => expect(cp('ü')).toContain('U+10CEC'))
  it('ű → U+10CED', () => expect(cp('ű')).toContain('U+10CED'))
})

describe('transliterate — digraph priority', () => {
  // Verifies that greedy longest-match works: cs must not be split into c+s
  // Source: standard Hungarian orthography — cs/sz/zs/gy/ny/ly/ty are indivisible

  it('"cs" produces 1 token (EB), not c+s', () => {
    const { tokens } = transliterate('cs')
    expect(tokens).toHaveLength(1)
    expect(tokens[0]?.latin).toBe('cs')
  })

  it('"sz" produces 1 token (ESZ), not s+z', () => {
    const { tokens } = transliterate('sz')
    expect(tokens).toHaveLength(1)
    expect(tokens[0]?.latin).toBe('sz')
  })

  it('"dzs" produces 1 token, not d+z+s or dz+s', () => {
    const { tokens } = transliterate('dzs')
    expect(tokens).toHaveLength(1)
    expect(tokens[0]?.latin).toBe('dzs')
  })

  it('"dzsungel" correctly starts with dzs token', () => {
    const { tokens } = transliterate('dzsungel')
    expect(tokens[0]?.latin).toBe('dzs')
  })
})

// ─── Real Hungarian words ─────────────────────────────────────────────────────

describe('transliterate — Hungarian words', () => {
  /**
   * "magyar" — the word for Hungarian
   * Expected tokens: m-a-gy-a-r (5 tokens, 'gy' is one digraph)
   * Source: standard transliteration, verified at oldhungarian.eu live converter
   */
  it('"magyar" tokenises as m-a-gy-a-r (5 tokens)', () => {
    const { tokens } = transliterate('magyar')
    const latins = tokens.map(t => t.latin)
    expect(latins).toEqual(['m', 'a', 'gy', 'a', 'r'])
  })

  /**
   * "szép" — beautiful
   * Contains sz digraph + long vowel é
   * Expected tokens: sz-é-p (3 tokens)
   */
  it('"szép" tokenises as sz-é-p (3 tokens)', () => {
    const { tokens } = transliterate('szép')
    const latins = tokens.map(t => t.latin)
    expect(latins).toEqual(['sz', 'é', 'p'])
  })

  /**
   * "öröm" — joy
   * Tests ö vowel
   */
  it('"öröm" produces 4 tokens: ö-r-ö-m', () => {
    const { tokens } = transliterate('öröm')
    const latins = tokens.map(t => t.latin)
    expect(latins).toEqual(['ö', 'r', 'ö', 'm'])
  })

  /**
   * "gyönyörű" — gorgeous
   * Tests gy digraph + ö + ny digraph + ő + r + ű
   */
  it('"gyönyörű" tokenises correctly with gy and ny digraphs', () => {
    const { tokens } = transliterate('gyönyörű')
    const latins = tokens.map(t => t.latin)
    expect(latins).toEqual(['gy', 'ö', 'ny', 'ö', 'r', 'ű'])
  })

  /**
   * "egészség" — health
   * e-g-é-sz-s-é-g: contains sz digraph, no gy
   */
  it('"egészség" contains sz token (no gy in this word)', () => {
    const { tokens } = transliterate('egészség')
    const latinKeys = tokens.map(t => t.latin)
    expect(latinKeys).toContain('sz')
    expect(latinKeys).not.toContain('gy')
  })

  /**
   * "egység" — unity
   * e-gy-s-é-g: contains gy digraph
   */
  it('"egység" contains gy token', () => {
    const { tokens } = transliterate('egység')
    const latinKeys = tokens.map(t => t.latin)
    expect(latinKeys).toContain('gy')
  })
})

// ─── Place names (helységnevek) ───────────────────────────────────────────────

describe('transliterate — place names', () => {
  /**
   * Hungarian cities that appear on official rovástáblák (road signs with runic script).
   * These signs exist physically — the transliteration is therefore ground truth.
   * Source: https://hu.wikipedia.org/wiki/Rovástáblás_települései_listája
   *         https://rovas.info — táblaállítás dokumentáció
   */

  it('"budapest" produces correct token sequence', () => {
    const { tokens } = transliterate('budapest')
    const latins = tokens.map(t => t.latin)
    // b-u-d-a-p-e-s-t — no digraphs
    expect(latins).toEqual(['b', 'u', 'd', 'a', 'p', 'e', 's', 't'])
  })

  it('"debrecen" tokenises correctly', () => {
    const { tokens } = transliterate('debrecen')
    const latins = tokens.map(t => t.latin)
    expect(latins).toEqual(['d', 'e', 'b', 'r', 'e', 'c', 'e', 'n'])
  })

  /**
   * "pécs" — city in southern Hungary, contains cs digraph
   * Source: Pécs rovástábla exists — verified in Rovástáblás települések listája (Wikipedia HU)
   */
  it('"pécs" ends with cs digraph (1 token, not p+é+c+s)', () => {
    const { tokens } = transliterate('pécs')
    const latins = tokens.map(t => t.latin)
    expect(latins).toEqual(['p', 'é', 'cs'])
  })

  /**
   * "győr" — city in western Hungary
   * Contains gy digraph and ő long vowel
   */
  it('"győr" starts with gy digraph', () => {
    const { tokens } = transliterate('győr')
    expect(tokens[0]?.latin).toBe('gy')
    expect(tokens[1]?.latin).toBe('ő')
    expect(tokens[2]?.latin).toBe('r')
  })

  /**
   * "nyíregyháza" — city in eastern Hungary
   * Contains: ny, gy, h, á, z, a — tests ny digraph
   */
  it('"nyíregyháza" starts with ny digraph', () => {
    const { tokens } = transliterate('nyíregyháza')
    expect(tokens[0]?.latin).toBe('ny')
  })

  it('"nyíregyháza" contains gy digraph', () => {
    const { tokens } = transliterate('nyíregyháza')
    const latins = tokens.map(t => t.latin)
    expect(latins).toContain('gy')
  })

  /**
   * "székesfehérvár" — historic royal city
   * Contains sz, é, k, e, s, f, e, h, é, r, v, á, r
   */
  it('"székesfehérvár" starts with sz digraph', () => {
    const { tokens } = transliterate('székesfehérvár')
    expect(tokens[0]?.latin).toBe('sz')
  })

  /**
   * "miskolc" — industrial city, contains no digraphs
   */
  it('"miskolc" has no digraph tokens', () => {
    const { tokens } = transliterate('miskolc')
    for (const t of tokens) {
      expect(t.latin.length).toBe(1)
    }
  })
})

// ─── Options ──────────────────────────────────────────────────────────────────

describe('transliterate — vowelOmission option', () => {
  it('with vowelOmission:true, vowel tokens have empty rovas string', () => {
    const { tokens } = transliterate('magyar', { vowelOmission: true })
    const vowelTokens = tokens.filter(t => ['a', 'e', 'i', 'o', 'u', 'á', 'é', 'í', 'ó', 'ő', 'ú', 'ű', 'ö', 'ü'].includes(t.latin))
    for (const t of vowelTokens) {
      expect(t.rovas).toBe('')
    }
  })

  it('with vowelOmission:true, "magyar" has fewer rovas chars than with:false', () => {
    const withVowels = transliterate('magyar', { vowelOmission: false })
    const withoutVowels = transliterate('magyar', { vowelOmission: true })
    expect([...withoutVowels.rovas].length).toBeLessThan([...withVowels.rovas].length)
  })
})

describe('transliterate — longVowels option', () => {
  it('with longVowels:classical, á produces same codepoint as a', () => {
    const modernA  = transliterate('a').rovas
    const modernAA = transliterate('á').rovas
    const classicalAA = transliterate('á', { longVowels: 'classical' }).rovas

    expect(modernA).not.toBe(modernAA) // they differ in modern mode
    expect(classicalAA).toBe(modernA)  // classical á == a
  })
})

describe('transliterate — whitespace and passthrough', () => {
  it('spaces are preserved in output', () => {
    const { rovas } = transliterate('egy két')
    expect(rovas).toContain(' ')
  })

  it('numbers pass through unchanged', () => {
    const { rovas } = transliterate('2026')
    expect(rovas).toBe('2026')
  })

  it('empty string returns empty result', () => {
    const result = transliterate('')
    expect(result.rovas).toBe('')
    expect(result.tokens).toHaveLength(0)
  })

  it('uppercase input is lowercased before processing', () => {
    const lower = transliterate('magyar')
    const upper = transliterate('MAGYAR')
    expect(lower.rovas).toBe(upper.rovas)
  })
})

// ─── Round-trip smoke test ────────────────────────────────────────────────────

describe('transliterate — token count integrity', () => {
  /**
   * The sum of token.latin lengths must equal the normalised input length.
   * Ensures no characters are silently dropped.
   */
  const words = ['budapest', 'székesfehérvár', 'egészség', 'gyönyörű', 'dzsungel', 'nyíregyháza']

  for (const word of words) {
    it(`no chars dropped in "${word}"`, () => {
      const { tokens, latin } = transliterate(word)
      const tokenLength = tokens.reduce((sum, t) => sum + t.latin.length, 0)
      expect(tokenLength).toBe(latin.length)
    })
  }
})
