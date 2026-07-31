/**
 * Name censoring engine.
 *
 * Detects and masks real names in post text before it hits the database.
 * Runs synchronously — no API calls, no model, just pattern matching.
 *
 * Strategy:
 * 1. Title + Name patterns: "Mr Victory" → "Mr V*****"
 * 2. Full capitalized names: "Adeola Ibrahim" → "A***** I******"
 * 3. Known Nigerian name prefixes catch edge cases
 *
 * This is a best-effort filter, not foolproof. The AI moderation layer
 * catches what this misses contextually.
 */

// Common Nigerian and English titles
const TITLES = [
  "mr", "mrs", "ms", "miss", "dr", "prof", "professor", "engr", "engineer",
  "barr", "barrister", "hon", "honourable", "pastor", "reverend", "rev",
  "alhaji", "alhaja", "chief", "otunba", "oloye", "sir", "madam", "mister",
  "uncle", "aunty", "auntie", "brother", "sister", "bro", "sis",
];

const TITLE_RE = new RegExp(
  `\\b(${TITLES.join("|")})\\.?\\s+([A-Z][a-zA-Z]{1,})`,
  "gi"
);

// Two consecutive capitalized words that look like "Firstname Lastname"
// Must be 2+ chars each, not at start of sentence after period
const FULLNAME_RE = /(?<![.!?]\s)(?<=\s|^)([A-Z][a-z]{1,})[\s]+([A-Z][a-z]{1,})(?=[\s,.!?;:'")\]]|$)/g;

// Common words that look like names but aren't — don't censor these
const FALSE_POSITIVES = new Set([
  // Common sentence starters / proper nouns that aren't personal names
  "University", "Lagos", "Nigeria", "Faculty", "Science", "Engineering",
  "Campus", "Board", "Student", "Union", "Library", "Department",
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
  "January", "February", "March", "April", "June", "July", "August",
  "September", "October", "November", "December",
  "Google", "Apple", "WhatsApp", "Twitter", "Instagram", "Facebook",
  "Mass", "Comm", "Computer", "Medical", "Clinical", "Social",
  "West", "East", "North", "South", "New", "Old", "Main", "General",
  "Hall", "Block", "Gate", "Road", "Street", "Avenue",
  "The", "This", "That", "These", "Those", "Some", "Many", "Most",
  "First", "Second", "Third", "Last", "Next",
  "CampusBoard", "Supabase", "Vercel",
]);

function isLikelyName(word: string): boolean {
  if (word.length < 2) return false;
  if (FALSE_POSITIVES.has(word)) return false;
  // Must start uppercase, rest mostly lowercase
  if (!/^[A-Z][a-z]+$/.test(word)) return false;
  return true;
}

function mask(name: string): string {
  if (name.length <= 1) return name;
  return name[0] + "*".repeat(name.length - 1);
}

/**
 * Censor names in text. Returns the censored version.
 *
 * Examples:
 *   "Mr Victory is here"       → "Mr V****** is here"
 *   "Prof Adeyemi said"        → "Prof A****** said"
 *   "Adeola Ibrahim posted"    → "A***** I****** posted"
 *   "The wifi is down"         → "The wifi is down" (no change)
 */
export function censorNames(text: string): string {
  let result = text;

  // Pass 1: Title + Name (highest confidence)
  result = result.replace(TITLE_RE, (_match, title: string, name: string) => {
    return `${title} ${mask(name)}`;
  });

  // Pass 2: Firstname Lastname pairs
  // Run on the already-title-censored text so we don't double-censor
  result = result.replace(FULLNAME_RE, (_match, first: string, last: string) => {
    const f = isLikelyName(first);
    const l = isLikelyName(last);
    if (f && l) return `${mask(first)} ${mask(last)}`;
    if (f) return `${mask(first)} ${last}`;
    if (l) return `${first} ${mask(last)}`;
    return `${first} ${last}`;
  });

  return result;
}

/**
 * Check if text contains potential names (for flagging, not blocking).
 * Returns the count of detected name-like patterns.
 */
export function countNamePatterns(text: string): number {
  let count = 0;
  const titleMatches = text.match(TITLE_RE);
  if (titleMatches) count += titleMatches.length;

  const nameMatches = text.match(FULLNAME_RE);
  if (nameMatches) {
    for (const m of nameMatches) {
      const parts = m.trim().split(/\s+/);
      if (parts.length >= 2 && parts.every((p) => isLikelyName(p))) {
        count++;
      }
    }
  }
  return count;
}
"// v1.0"  
