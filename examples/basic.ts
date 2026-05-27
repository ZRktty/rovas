/**
 * rovas — példák / examples
 *
 * Run: node --input-type=module < examples/basic.mjs
 * Or with tsx: npx tsx examples/basic.ts
 */

import { transliterate, reverse, isRovas, toCodePoints, convertNumber } from '../src/index.js'

// ── 1. Alaphasználat / Basic usage ────────────────────────────────────────────

const result = transliterate('magyar')
console.log('Input:  magyar')
console.log('Rovás:  ', result.rovas)
console.log('Tokens: ', result.tokens.map(t => `${t.latin}→${t.rovas}`).join(' | '))
console.log()

// ── 2. Helységnevek / Place names ─────────────────────────────────────────────

const places = ['Budapest', 'Pécs', 'Győr', 'Nyíregyháza', 'Székesfehérvár', 'Debrecen']
console.log('── Helységnevek ──')
for (const place of places) {
  const { rovas } = transliterate(place)
  console.log(`${place.padEnd(18)} → ${rovas}`)
}
console.log()

// ── 3. Klasszikus mód (magánhangzó elhagyás) ──────────────────────────────────

console.log('── Klasszikus mód (vowelOmission: true) ──')
const word = 'egészség'
const modern    = transliterate(word)
const classical = transliterate(word, { vowelOmission: true })
console.log(`Modern:     ${modern.rovas}`)
console.log(`Klasszikus: ${classical.rovas}`)
console.log()

// ── 4. Visszafordítás / Reverse ───────────────────────────────────────────────

console.log('── Visszafordítás ──')
const rovas = transliterate('szép').rovas
console.log('Rovás input:', rovas)
console.log('Latin back: ', reverse(rovas))
console.log()

// ── 5. Unicode kódpontok / Codepoints ────────────────────────────────────────

console.log('── Kódpontok / Codepoints ──')
const sampleRovas = transliterate('gy').rovas
console.log(`"gy" rovás: ${sampleRovas}`)
console.log(`Codepoints: ${toCodePoints(sampleRovas).join(', ')}`)
console.log()

// ── 6. Számok / Numbers ───────────────────────────────────────────────────────

console.log('── Számok / Numbers ──')
for (const n of [1, 5, 10, 42, 1000, 1848]) {
  console.log(`${String(n).padStart(5)} → ${convertNumber(n)}`)
}
console.log()

// ── 7. Detektálás / Detection ─────────────────────────────────────────────────

const testStrings = ['hello', transliterate('hello').rovas]
console.log('── Detektálás / Detection ──')
for (const s of testStrings) {
  console.log(`"${s}" isRovas: ${isRovas(s)}`)
}
