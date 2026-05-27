/**
 * Options for transliterate()
 */
export interface TransliterateOptions {
  /**
   * When true, vowels are omitted from output — classical/historical style.
   * Modern Hungarian rovásírás (and all road signs) writes vowels.
   * Default: false
   */
  vowelOmission?: boolean

  /**
   * 'modern'    — long vowels (á, é, í, ó, ő, ú, ű) get their own Unicode codepoints.
   * 'classical' — long vowels are written identically to their short counterparts,
   *               as in historical inscriptions.
   * Default: 'modern'
   */
  longVowels?: 'modern' | 'classical'

  /**
   * Whether to mirror punctuation (, and ") to their RTL rovás equivalents.
   * Default: false (pass-through)
   */
  mirrorPunctuation?: boolean
}

/**
 * Result object returned by transliterate()
 */
export interface TransliterateResult {
  /** The rovásírás string (Unicode SMP codepoints) */
  rovas: string
  /** Original input, lowercased and normalised */
  latin: string
  /** Phoneme-by-phoneme breakdown for debugging / educational display */
  tokens: Array<{ latin: string; rovas: string }>
}
