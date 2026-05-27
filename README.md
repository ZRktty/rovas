# rovas 𐳢𐳛𐳮𐳁𐳤

Magyar rovásírás Unicode transliteráció — TypeScript/JavaScript könyvtár.

[![npm](https://img.shields.io/npm/v/rovas)](https://www.npmjs.com/package/rovas)
[![license](https://img.shields.io/npm/l/rovas)](./LICENSE)

---

## Mi ez?

A `rovas` csomag a latin betűs magyar szöveget **székely–magyar rovásírás** Unicode karakterekké alakítja, és vissza. A rovásírás 2015 óta az Unicode 8.0 szabvány része (`U+10C80–U+10CFF` blokk).

A könyvtár:
- felismeri a magyar digráfokat (`cs`, `sz`, `zs`, `gy`, `ny`, `ly`, `ty`, `dz`, `dzs`)
- kezeli a hosszú magánhangzókat (`á`, `é`, `í`, `ó`, `ő`, `ú`, `ű`)
- visszafelé is tud fordítani (rovás → latin)
- számmá alakítást is tartalmaz (kvázi-római additív rendszer)
- ESM + CJS formátumban érhető el, Browser / Node / Deno / Bun kompatibilis

---

## Telepítés

```bash
# pnpm
pnpm add rovas

# npm
npm install rovas

# yarn
yarn add rovas
```

---

## Használat

### Alap átírás

```ts
import { transliterate } from 'rovas'

const result = transliterate('magyar')
console.log(result.rovas)   // 𐳞𐳀𐳎𐳀𐳤  (RTL szöveg)
console.log(result.tokens)  // [{ latin: 'm', rovas: '𐳞' }, ...]
```

### Helységnevek

```ts
transliterate('Budapest').rovas     // 𐳁𐳪𐳇𐳀𐳠𐳉𐳤𐳦
transliterate('Pécs').rovas         // 𐳠𐳟𐳂
transliterate('Győr').rovas         // 𐳎𐳟𐳢
transliterate('Nyíregyháza').rovas  // 𐳚𐳑𐳢𐳉𐳎𐳇𐳁𐳯𐳀
```

### Gyors API — `toRovas` / `toLatin`

```ts
import { toRovas, toLatin } from 'rovas'

toRovas('magyar')          // → '𐳞𐳀𐳎𐳀𐳢'  (string)
toRovas('szép', { longVowels: 'classical' }) // opciókkal is

toLatin(toRovas('szép'))   // → 'szép'
```

> A `toRovas` a `transliterate(...).rovas` rövidítése, a `toLatin` a `reverse` alias neve. A teljes `TransliterateResult` objektumhoz (tokenek, stb.) használd a `transliterate()` függvényt.

### Visszafordítás (rovás → latin)

```ts
import { transliterate, reverse } from 'rovas'

const rovas = transliterate('szép').rovas
reverse(rovas) // → 'szép'
```

⚠️ A visszafordítás **veszteséges**, ha `vowelOmission: true` opcióval készült a rovás szöveg — a kihagyott magánhangzók nem állíthatók vissza.

### Opciók

```ts
transliterate('egészség', {
  vowelOmission: false,    // default: false — modern, olvasható forma
  longVowels: 'modern',   // 'modern' | 'classical' — klasszikusban á = a, stb.
  mirrorPunctuation: false // rovás tükrözött vesszőt/idézőjelet használ RTL-ben
})
```

### Számok

A rovásírásban kvázi-római, additív számrendszer létezik:

```ts
import { convertNumber } from 'rovas'

convertNumber(1)    // 𐳺
convertNumber(10)   // 𐳼
convertNumber(1848) // 𐳿𐳾𐳾𐳾𐳾𐳾𐳾𐳾𐳾𐳻𐳼𐳼𐳼𐳼
```

### Segédfüggvények

```ts
import { isRovas, isLatin, toCodePoints } from 'rovas'

isRovas('𐳞𐳀𐳎𐳀𐳤')  // true
isLatin('magyar')   // true

toCodePoints('𐳞𐳀')  // ['U+10CDE', 'U+10CC0']
```

---

## Megjelenítés

A rovásírás **jobbról balra** olvasandó. A Unicode string balról jobbra tárolódik a memóriában (ahogy a szabvány előírja), de megjelenítéskor RTL irányt kell alkalmazni:

```html
<span dir="rtl" lang="hu-Hung">𐳞𐳀𐳎𐳀𐳤</span>
```

```css
.rovas {
  unicode-bidi: bidi-override;
  direction: rtl;
  font-family: 'Noto Sans Old Hungarian', serif;
}
```

Font: [Noto Sans Old Hungarian](https://fonts.google.com/noto/specimen/Noto+Sans+Old+Hungarian) (Google Fonts, ingyenes)

---

## API

### `transliterate(input, options?)`

| Paraméter | Típus | Leírás |
|---|---|---|
| `input` | `string` | Latin betűs magyar szöveg |
| `options.vowelOmission` | `boolean` | Magánhangzók elhagyása (default: `false`) |
| `options.longVowels` | `'modern' \| 'classical'` | Hosszú magánhangzók kezelése (default: `'modern'`) |
| `options.mirrorPunctuation` | `boolean` | Vesszők, idézőjelek tükrözése (default: `false`) |

**Visszatérési érték:** `TransliterateResult`

```ts
interface TransliterateResult {
  rovas:  string                              // a rovás Unicode string
  latin:  string                              // normalizált (kisbetűs) input
  tokens: Array<{ latin: string; rovas: string }> // fonéma szintű bontás
}
```

### `reverse(rovas)`

Rovás Unicode string visszaalakítása latin betűs szöveggé. Best-effort, veszteséges (vowel omission esetén).

### `convertNumber(n)`

Egész számot (`n >= 0`) rovás számmá alakít additív rendszerben.

### `isRovas(text)` / `isLatin(text)`

Detektálja, hogy a szöveg tartalmaz-e rovás Unicode karaktereket.

### `toCodePoints(text)`

Visszaadja a szöveg karaktereinek Unicode kódpontjait (`['U+10CC0', ...]` formátumban).

---

## Betűkészlet forrás

Az `alphabet.ts` teljes betűkészlete az alábbi forrásokból épül fel:
- [Unicode 8.0 szabvány — U10C80.pdf](https://unicode.org/charts/PDF/U10C80.pdf)
- [oldhungarian.eu](https://oldhungarian.eu) — kortárs unicode rovásírás referencia
- [ScriptSource — Old Hungarian](https://scriptsource.org/cms/scripts/page.php?item_id=script_detail&key=Hung)

---

## Fejlesztés

```bash
pnpm install
pnpm test          # vitest
pnpm test:watch    # watch mode
pnpm build         # tsup → dist/
```

---

## Licensz

MIT © Zoltán Rakottyai

---

## Háttér

A székely–magyar rovásírás az egyik legrégibb, magyar nyelvet lejegyző írásrendszer. A latin ábécé bevezetése (kb. Kr. u. 1000) után fokozatosan kiszorult, de Erdélyben évszázadokig használták. Ma is él: Magyarországon és Erdélyben táblaként jelennek meg helységneveink rovással, és az írást iskolákban is oktatják.

> „A rovásírás a magyarság régi írása, nemzeti kulturális örökségünk." — Forrai Sándor
