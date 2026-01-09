const inputField = document.querySelector('#input-field');
const paragraphBox = document.querySelector('#paragraph-box');
const startBtn = document.querySelector('#start-bttn');

const wpmBox = document.querySelector('#wpm_con');
const timeBox = document.querySelector('#time_con');
const accBox = document.querySelector('#acc_con');

const words = [
  "JavaScript is the only language that I'm aware of that people feel they don't need to learn before they start using it.",
  "Be humble, communicate clearly, and respect others. It costs nothing to be kind, but the impact is priceless.",
  "If people do not believe that mathematics is simple, it is only because they do not realize how complicated life is.",
  "I make mistakes because I'm always operating at my limit. If I only stay in comfortable territory all the time, that's not so much fun.",
  "If you learn how to solve problems, you can go through life and do pretty well.",
  "To be successful, you want to surround yourself with very talented folks whose skills blend very well. That's the secret of success.",
  "Good judgement comes from experience. Experience comes from bad judgement."
];

let timer;
let seconds = 0;
let wrongCount = 0;

/* BLOCK ENTER KEY */
inputField.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') e.preventDefault();
});

function focusInput() {
  inputField.focus();
}

function randomText() {
  return words[Math.floor(Math.random() * words.length)];
}

function init() {
  paragraphBox.innerHTML = '';
  randomText().split('').forEach(char => {
    const span = document.createElement('span');
    span.innerHTML = char === ' ' ? '&nbsp;' : char;
    paragraphBox.appendChild(span);
  });
}

function startAgain() {
  reset();
  init();
  focusInput();
  startTimer();
  startBtn.innerText = 'Again';
}

function reset() {
  clearInterval(timer);
  inputField.value = '';
  seconds = 0;
  wrongCount = 0;
  timeBox.innerText = '0';
  wpmBox.innerText = '';
  accBox.innerText = '';
  paragraphBox.scrollLeft = 0;
}

function startTimer() {
  timer = setInterval(() => {
    seconds++;
    timeBox.innerText = seconds;
  }, 1000);
}

/* AUTO SCROLL */
function autoScroll(cursorSpan) {
  const boxRight = paragraphBox.scrollLeft + paragraphBox.clientWidth;
  const spanRight = cursorSpan.offsetLeft + cursorSpan.offsetWidth;

  if (spanRight > boxRight - 10) {
    paragraphBox.scrollLeft += cursorSpan.offsetWidth;
  }

  if (cursorSpan.offsetLeft < paragraphBox.scrollLeft) {
    paragraphBox.scrollLeft = cursorSpan.offsetLeft;
  }
}

function checkTyping() {
  const inputChars = inputField.value.replace(/\n/g, '').split('');
  const spans = paragraphBox.querySelectorAll('span');
  wrongCount = 0;

  spans.forEach((span, index) => {
    span.classList.remove('correct', 'wrong', 'cursor-highlight');

    if (inputChars[index] == null) return;

    const expected = span.innerText === '\u00A0' ? ' ' : span.innerText;

    if (inputChars[index] === expected) {
      span.classList.add('correct');
    } else {
      span.classList.add('wrong');
      wrongCount++;
    }
  });

  if (spans[inputChars.length]) {
    const cursor = spans[inputChars.length];
    cursor.classList.add('cursor-highlight');
    autoScroll(cursor);
  }

  if (inputChars.length === spans.length) {
    clearInterval(timer);
    calculateStats();
  }
}

function calculateStats() {
  const total = paragraphBox.children.length;
  accBox.innerText = Math.round(((total - wrongCount) / total) * 100) + '%';
  wpmBox.innerText = Math.round((total / 5) / (seconds / 60));
}

paragraphBox.innerText = "Press Start button to begin...";
