/**
 * Old Hungarian (Rovásírás) alphabet map
 *
 * Source: Unicode 8.0 standard, block U+10C80–U+10CFF
 * Reference: https://oldhungarian.eu  |  https://unicode.org/charts/PDF/U10C80.pdf
 *
 * Capital letters used throughout (U+10C80–U+10CB2).
 * Lowercase equivalents exist at U+10CC0–U+10CF2 — same phoneme values,
 * different glyph variants (historical). This library uses capitals by default
 * to match contemporary signage practice (rovástáblák).
 *
 * Key rules baked into this map:
 *  1. Digraphs (cs, sz, zs, ny, ly, gy, ty, dz, dzs) MUST be matched before
 *     their component single letters. The transliterate engine processes longest
 *     match first.
 *  2. Long vowels (á, é, í, ó, ő, ú, ű) have dedicated codepoints in the modern
 *     Unicode standard. Classical texts omitted the distinction — controlled via
 *     the `longVowels` option.
 *  3. The two K variants (EK = word-initial/medial, AK = word-final) exist in
 *     the historical record. For simplicity v1 uses EK (U+10C93) everywhere;
 *     positional K is a future enhancement.
 *  4. Numbers follow a quasi-Roman additive system with dedicated codepoints.
 */

// ─── Vowels ──────────────────────────────────────────────────────────────────

export const VOWELS: Record<string, string> = {
  a:  '\u{10CC0}', // 𐳀 OLD HUNGARIAN SMALL LETTER A
  á:  '\u{10CC1}', // 𐳁 OLD HUNGARIAN SMALL LETTER AA  (long A)
  e:  '\u{10CC9}', // 𐳉 OLD HUNGARIAN SMALL LETTER E
  é:  '\u{10CCB}', // 𐳋 OLD HUNGARIAN SMALL LETTER EE  (long E)
  i:  '\u{10CD0}', // 𐳐 OLD HUNGARIAN SMALL LETTER I
  í:  '\u{10CD1}', // 𐳑 OLD HUNGARIAN SMALL LETTER II  (long I)
  o:  '\u{10CDB}', // 𐳛 OLD HUNGARIAN SMALL LETTER O
  ó:  '\u{10CDC}', // 𐳜 OLD HUNGARIAN SMALL LETTER OO  (long O)
  ö:  '\u{10CDD}', // 𐳝 OLD HUNGARIAN SMALL LETTER NIKOLSBURG OE
  ő:  '\u{10CDF}', // 𐳟 OLD HUNGARIAN SMALL LETTER OEE (long OE)
  u:  '\u{10CEA}', // 𐳪 OLD HUNGARIAN SMALL LETTER U
  ú:  '\u{10CEB}', // 𐳫 OLD HUNGARIAN SMALL LETTER UU  (long U)
  ü:  '\u{10CEC}', // 𐳬 OLD HUNGARIAN SMALL LETTER NIKOLSBURG UE
  ű:  '\u{10CED}', // 𐳭 OLD HUNGARIAN SMALL LETTER RUDIMENTA UE (long UE)
}

// ─── Consonants (digraphs first — longest match priority) ────────────────────

export const CONSONANTS: Record<string, string> = {
  // 3-letter digraph
  dzs: '\u{10CC7}\u{10CCF}', // D+ZS ligature composition (D=𐳇, ZS=𐳰) — no single codepoint

  // 2-letter digraphs
  cs:  '\u{10CC6}', // 𐳆 OLD HUNGARIAN SMALL LETTER ECS
  dz:  '\u{10CC7}\u{10CCF}', // D+Z composition; 𐳇+𐳯
  gy:  '\u{10CCE}', // 𐳎 OLD HUNGARIAN SMALL LETTER EGY
  ly:  '\u{10CD7}', // 𐳗 OLD HUNGARIAN SMALL LETTER ELY
  ny:  '\u{10CDA}', // 𐳚 OLD HUNGARIAN SMALL LETTER ENY
  sz:  '\u{10CE5}', // 𐳥 OLD HUNGARIAN SMALL LETTER ESZ
  ty:  '\u{10CE8}', // 𐳨 OLD HUNGARIAN SMALL LETTER ETY
  zs:  '\u{10CF0}', // 𐳰 OLD HUNGARIAN SMALL LETTER EZS

  // Single consonants
  b:   '\u{10CC2}', // 𐳂 — note: CS and B share EB; CS digraph takes priority
  c:   '\u{10CC4}', // 𐳄 OLD HUNGARIAN SMALL LETTER EC
  d:   '\u{10CC7}', // 𐳇 OLD HUNGARIAN SMALL LETTER ED
  f:   '\u{10CCC}', // 𐳌 OLD HUNGARIAN SMALL LETTER EF
  g:   '\u{10CCD}', // 𐳍 OLD HUNGARIAN SMALL LETTER EG
  h:   '\u{10CCF}', // 𐳏 OLD HUNGARIAN SMALL LETTER EH
  j:   '\u{10CD2}', // 𐳒 OLD HUNGARIAN SMALL LETTER EJ
  k:   '\u{10CD3}', // 𐳓 OLD HUNGARIAN SMALL LETTER EK  (word-initial K)
  l:   '\u{10CD6}', // 𐳖 OLD HUNGARIAN SMALL LETTER EL
  m:   '\u{10CD8}', // 𐳘 OLD HUNGARIAN SMALL LETTER EM
  n:   '\u{10CD9}', // 𐳙 OLD HUNGARIAN SMALL LETTER EN
  p:   '\u{10CE0}', // 𐳠 OLD HUNGARIAN SMALL LETTER EP
  r:   '\u{10CE2}', // 𐳢 OLD HUNGARIAN SMALL LETTER ER
  s:   '\u{10CE4}', // 𐳤 OLD HUNGARIAN SMALL LETTER ES
  t:   '\u{10CE6}', // 𐳦 OLD HUNGARIAN SMALL LETTER ET
  v:   '\u{10CEE}', // 𐳮 OLD HUNGARIAN SMALL LETTER EV
  z:   '\u{10CEF}', // 𐳯 OLD HUNGARIAN SMALL LETTER EZ
}

// ─── Numbers (quasi-Roman additive system) ───────────────────────────────────
// Source: Unicode 8.0 U+10CFA–U+10CFF

export const NUMBERS: Record<string, string> = {
  '1':    '\u{10CFA}', // 𐳺
  '5':    '\u{10CFB}', // 𐳻
  '10':   '\u{10CFC}', // 𐳼
  '50':   '\u{10CFD}', // 𐳽
  '100':  '\u{10CFE}', // 𐳾
  '1000': '\u{10CFF}', // 𐳿
}

// ─── Punctuation helpers ──────────────────────────────────────────────────────
// Rovásírás uses mirrored punctuation for RTL rendering contexts

export const PUNCTUATION: Record<string, string> = {
  ',':  '\u{2E41}', // ⹁ REVERSED COMMA
  '"':  '\u{2E42}', // ⹂ DOUBLE REVERSED COMMA (closing quote equivalent)
  // Other punctuation (. ! ? space) passes through unchanged in modern usage
}

// ─── Reverse map (Rovás → Latin) — auto-derived ──────────────────────────────
// Built at module load time from the above maps.
// Digraph compositions (dzs, dz) need special handling since they map to
// multi-codepoint strings — the reverse engine handles these separately.

export function buildReverseMap(): Map<string, string> {
  const map = new Map<string, string>()

  for (const [latin, rovas] of Object.entries({ ...VOWELS, ...CONSONANTS })) {
    // Only single-codepoint entries go into the simple reverse map.
    // Multi-codepoint (dz, dzs) are handled by the reverse engine directly.
    if ([...rovas].length === 1) {
      map.set(rovas, latin)
    }
  }

  return map
}

// ─── All phonemes sorted longest-first for greedy matching ───────────────────

export const PHONEME_MAP: [string, string][] = Object.entries({
  ...CONSONANTS,
  ...VOWELS,
}).sort((a, b) => b[0].length - a[0].length)
