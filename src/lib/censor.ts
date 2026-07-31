/**
 * Content filter — swear words and curses only.
 * Names are no longer censored.
 */

const SWEAR_WORDS = [
  // English
  "fuck", "fucker", "fucking", "fucked", "fucks",
  "shit", "shitty", "bullshit",
  "bitch", "bitches", "bitching",
  "ass", "asshole", "arse",
  "damn", "dammit",
  "cunt", "cunts",
  "dick", "dicks",
  "cock", "cocks",
  "pussy", "pussies",
  "bastard", "bastards",
  "piss", "pissed",
  "crap",
  "whore", "whores",
  "slut", "sluts",
  // Nigerian/Pidgin common curses
  "oloshi", "olosho", "ode", "oloriburuku", "werey",
  "mumu", "idiot", "foolish", "stupid",
  "ashewo", "ashawo",
  "joor", "nonsense",
];

// Build a regex that matches whole words, case-insensitive
const SWEAR_RE = new RegExp(
  `\\b(${SWEAR_WORDS.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`,
  "gi"
);

function mask(word: string): string {
  if (word.length <= 2) return word[0] + "*";
  return word[0] + "*".repeat(word.length - 2) + word[word.length - 1];
}

/**
 * Masks swear words in text.
 * "What the fuck" → "What the f**k"
 * "That's bullshit" → "That's b******t"
 */
export function censorNames(text: string): string {
  return text.replace(SWEAR_RE, (match) => mask(match));
}

/** Not used for names anymore — returns 0 always. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function countNamePatterns(_text?: string): number {
  return 0;
}
