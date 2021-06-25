export function regex({ raw: texts }, ...insertions) {
  const derivedFlags = new Set();
  const regex = [];
  for (let i = 0; i < insertions.length; i++) {
    const insertion = insertions[i];
    [...insertion.flags].forEach((flag) => derivedFlags.add(flag));
    regex.push(texts[i], `(?:${insertion.source})`);
  }
  regex.push(texts[texts.length - 1]);
  return (flags) => {
    if (!flags) {
      flags = [...derivedFlags].join("");
    }
    return new RegExp(regex.join(""), flags);
  };
}
// 1.4.1 Emoji Characters
export const EMOJI_CHARACTER = /\p{Emoji}|[\u{100000}-\u{10FFFD}]/u;
// 1.4.2 Emoji Presentation
export const DEFAULT_EMOJI_PRESENTATION_CHARACTER =
  /\p{Emoji_Presentation}|[\u{100000}-\u{10FFFD}]/u;
export const DEFAULT_TEXT_PRESENTATION_CHARACTER =
  /\P{Emoji_Presentation}|[\u{100000}-\u{10FFFD}]/u;
// 1.4.3 Emoji and Text Presentation Sequences
export const TEXT_PRESENTATION_SELECTOR = /\u{FE0E}/u;
export const TEXT_PRESENTATION_SEQUENCE =
  regex`${EMOJI_CHARACTER}${TEXT_PRESENTATION_SELECTOR}`();
export const EMOJI_PRESENTATION_SELECTOR = /\u{FE0F}/u;
export const EMOJI_PRESENTATION_SEQUENCE =
  regex`${EMOJI_CHARACTER}${EMOJI_PRESENTATION_SELECTOR}`();
// 1.4.4 Emoji Modifiers
export const EMOJI_MODIFIER = /\p{Emoji_Modifier}/u;
export const EMOJI_MODIFIER_BASE = /\p{Emoji_Modifier_Base}/u;
export const EMOJI_MODIFIER_SEQUENCE =
  regex`${EMOJI_MODIFIER_BASE}${EMOJI_MODIFIER}`();
// 1.4.5 Emoji Sequences
export const REGIONAL_INDICATOR = /\p{Regional_Indicator}/u;
export const EMOJI_FLAG_SEQUENCE =
  regex`${REGIONAL_INDICATOR}${REGIONAL_INDICATOR}`();
export const TAG_BASE =
  regex`${EMOJI_PRESENTATION_SEQUENCE}|${EMOJI_MODIFIER_SEQUENCE}|${EMOJI_CHARACTER}`();
export const TAG_SPEC = /[\u{E0020}-\u{E007E}]+/u;
export const TAG_END = /\u{E007F}/u;
export const EMOJI_TAG_SEQUENCE = regex`${TAG_BASE}${TAG_SPEC}${TAG_END}`();
export const EMOJI_KEYCAP_SEQUENCE = /[0-9#*]\u{FE0F}\u{20E3}/u;
// EMOJI_CORE_SEQUENCE DOES NOT HAVE ${EMOJI_CHARACTER} DUE TO NOT BEING WHAT THE USER (I) WANTS
// PLEASE OPEN AN ISSUE IF YOU NEED THIS FIXED
export const EMOJI_CORE_SEQUENCE =
  regex`${EMOJI_FLAG_SEQUENCE}|${EMOJI_MODIFIER_SEQUENCE}|${EMOJI_KEYCAP_SEQUENCE}|${EMOJI_PRESENTATION_SEQUENCE}`();
export const EMOJI_ZWJ_ELEMENT =
  regex`${EMOJI_MODIFIER_SEQUENCE}|${EMOJI_PRESENTATION_SEQUENCE}|${EMOJI_CHARACTER}`();
export const ZWJ = /\u{200d}/u;
export const EMOJI_ZWJ_SEQUENCE =
  regex`${EMOJI_ZWJ_ELEMENT}(?:${ZWJ}${EMOJI_ZWJ_ELEMENT})+`();
export const EMOJI_SEQUENCE =
  regex`${EMOJI_TAG_SEQUENCE}|${EMOJI_ZWJ_SEQUENCE}|${EMOJI_CORE_SEQUENCE}`();

export const EMOJI_COLOR_MODIFIER = /[\u{1f3fb}-\u{1f3ff}]/u;

export const MUTANT_MORPH_MODIFIER = /[\u{101650}-\u{101652}]/u;
export const MUTANT_COLOR_MODIFIER =
  regex`[\u{101600}-\u{10162c}]|${EMOJI_COLOR_MODIFIER}`();

export const MUTANT_MODIFIER =
  regex`${MUTANT_MORPH_MODIFIER}|${MUTANT_COLOR_MODIFIER}`();

export const MUTANT_SEQUENCE =
  regex`${EMOJI_MODIFIER_BASE}${MUTANT_MORPH_MODIFIER}?${MUTANT_COLOR_MODIFIER}?`();

// non-standard convenience regex
// however it matches all the emoji in `./emoji_test.ts` correctly
export const EMOJI =
  regex`${EMOJI_SEQUENCE}|\p{Emoji_Presentation}|\p{Extended_Pictographic}|[\u{100000}-\u{10FFFD}]`('gu');

export const MUTANT_EMOJI = regex`${MUTANT_SEQUENCE}|${EMOJI}`('gu');
