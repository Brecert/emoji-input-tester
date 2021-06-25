import { EMOJI, MUTANT_EMOJI } from "./emoji.js";

const input = document.getElementById("input");
const output = document.getElementById("output");
const styleForm = document.getElementById("styleForm");

const config = {
  emoji_url: "https://static.revolt.chat/emoji",
};

const state = {
  emojiStyle: "mutant",
};

styleForm.oninput = (e) => {
  state.emojiStyle = styleForm.elements.namedItem("emoji style").value;
  update();
};

/** @param {string} emoji */
const codepoints = (emoji) => [...emoji].map((c) => c.codePointAt(0));

/** @param {string} emoji */
const codepointString = (emoji) =>
  codepoints(emoji)
    .map((c) => c.toString(16))
    .join("-");

/** @param {string} text */
const Emoji = ({ emoji, style = state.emojiStyle } = {}) => {
  let el = document.createElement("span");
  el.classList.add("emoji");
  el.textContent = emoji;

  let codepoints = codepointString(emoji);
  el.style.setProperty(
    "--emoji-url",
    `url("${config.emoji_url}/${style}/${codepoints}.svg")`
  );

  return el;
};

/** @param {string} text */
function parseEmojis(text) {
  let matches = text.matchAll(state.emojiStyle === "mutant" ? MUTANT_EMOJI : EMOJI) ?? [];
  let output = [];
  let lastPos = 0;
  for (let match of matches) {
    let emoji = match[0];
    output.push(text.slice(lastPos, match.index));
    output.push(Emoji({ emoji }));
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

class Breemoji extends HTMLElement {
  constructor() {
    super();
    const style = this.dataset.style;
    const emoji = Emoji({ style, emoji: this.dataset.emoji });
    this.append(emoji);
  }
}

customElements.define("bree-moji", Breemoji);
