import { EMOJI as E } from "https://jspm.dev/unicode-emoji-regex";
const EMOJI = new RegExp(E.source, "gu");

const input = document.getElementById("input");
const output = document.getElementById("output");

const config = {
  emoji_url: "https://static.revolt.chat/emoji/mutant/",
};

/** @param {string} text */
const codepoints = (text) => [...text].map((c) => c.codePointAt(0));

/** @param {string} text */
const codepointString = (text) =>
  codepoints(text)
    .map((c) => c.toString(16))
    .join("-");

/** @param {string} text */
const Emoji = (text) => {
  let el = document.createElement("span");
  el.classList.add("emoji");
  el.innerText = text;

  let codepoints = codepointString(text);
  el.style.backgroundImage = `url(${config.emoji_url}${codepoints}.svg)`;

  return el;
};

/** @param {string} text */
function parseEmojis(text) {
  let matches = text.matchAll(EMOJI) ?? [];
  let output = [];
  let lastPos = 0;
  for (let match of matches) {
    let emoji = match[0];
    output.push(text.slice(lastPos, match.index));
    output.push(Emoji(emoji));
    lastPos = match.index + emoji.length;
  }
  output.push(text.slice(lastPos));
  return output;
}

function update() {
  let parsed = parseEmojis(input.value);
  output.replaceChildren();
  output.append(...parsed);
}

input.oninput = update;
update();
