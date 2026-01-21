const words = 'Be humble communicate clearly and respect others It costs nothing to be kind but the impact is priceless make mistakes because Im always operating at my limit To be successful you want to surround yourself with very talented folks whose skills blend very well'.split(' ');

const wordsCount = words.length;

const gameTime = 30 * 1000;
window.timer = null;
window.gameStart = null;


function getRandomWords() {
    const randomIdx = Math.floor(Math.random() * wordsCount);
    return words[randomIdx];
}

function formatWord(word) {
    return `<div class="word"><span class="char">${word.split('').join('</span><span class="char">')}</span></div>`;
}

function addClass(el, name) {
    el.classList.add(name);
}

function removeClass(el, name) {
    el.classList.remove(name);

}

function newGame() {
    const wordsEl = document.getElementById('words');
    wordsEl.innerHTML = '';
    wordsEl.style.marginTop = '0px';

    for (let i = 0; i < 200; i++) {
        wordsEl.innerHTML += formatWord(getRandomWords());
    }

    addClass(document.querySelector('.word'), 'current');
    addClass(document.querySelector('.char'), 'current');

    document.getElementById('time_con').innerHTML = '30';
    document.getElementById('wpm_con').innerHTML = '';
    document.getElementById('acc_con').innerHTML = '';

    removeClass(document.getElementById('game'), 'over');

    clearInterval(window.timer);
    window.timer = null;
    window.gameStart = null;

    document.getElementById('game').focus();
}

function getWpm() {
    const correctCharacters = document.querySelectorAll('.char.correct').length;
    const minutes = gameTime / 1000 /60;
    return Math.round((correctCharacters / 5) / minutes);
}

function gameOver() {
    clearInterval(window.timer);
    addClass(document.getElementById('game'), 'over');
    const wpm = getWpm();
    document.getElementById('wpm_con').innerHTML = `${wpm}`;
}

document.getElementById('game').addEventListener('keyup', ev => {
    const key = ev.key
    const currentWord = document.querySelector('.word.current');
    const currentCharacter = document.querySelector('.char.current');
    const expectedCharacter = currentCharacter?.innerHTML || ' ';
    const ischaracter = key.length === 1 && key != ' ';
    const isSpace = key === ' ';
    const isBackspace = key === 'Backspace';
    const isFirstCharacter = currentCharacter === currentWord.firstChild;

    if (document.querySelector('#game.over')) {
        return;
    }

    console.log({ key, expectedCharacter });

    if (!window.timer && ischaracter) {
        window.timer = setInterval(() => {
            if (!window.gameStart) {
                window.gameStart = (new Date()).getTime();
            }
            const currentTime = (new Date()).getTime();
            const msPassed = currentTime - window.gameStart;
            const secondPassed = Math.round(msPassed / 1000);
            const secondLeft = (gameTime / 1000) - secondPassed;
            if (secondLeft <= 0) {
                gameOver();
            }
            document.getElementById('time_con').innerHTML = secondLeft + '';
        }, 1000);
    }

    if (ischaracter) {
        if (currentCharacter) {
            addClass(currentCharacter, key === expectedCharacter ? 'correct' : 'incorrect');
            removeClass(currentCharacter, 'current');
            if (currentCharacter.nextSibling) {
                addClass(currentCharacter.nextSibling, 'current')
            }
        } else {
            const incorrectCharacter = document.createElement('span');
            incorrectCharacter.innerHTML = key;
            incorrectCharacter.className = 'char incorrect extra';
            currentWord.appendChild(incorrectCharacter);
        }
    }

    if (isSpace) {
        const charactersToInvalidate =
            [...document.querySelectorAll('.word.current .char:not(.correct)')];

        charactersToInvalidate.forEach(character => {
            addClass(character, 'incorrect');
        });

        removeClass(currentWord, 'current');

        if (currentWord.nextSibling) {
            addClass(currentWord.nextSibling, 'current');
            addClass(currentWord.nextSibling.querySelector('.char'), 'current');
        }
        if (currentCharacter) {
            removeClass(currentCharacter, 'current');
        }
        addClass(currentWord.nextSibling.firstChild, 'current');
    }

    if (isBackspace) {
        if (currentCharacter && isFirstCharacter) {
            removeClass(currentWord, 'current');
            addClass(currentWord.previousSibling, 'current');
            removeClass(currentCharacter, 'current');
            addClass(currentWord.previousSibling.lastChild, 'current');
            removeClass(currentWord.previousSibling.lastChild, 'incorrect');
            removeClass(currentWord.previousSibling.lastChild, 'correct');
        }
        if (currentCharacter && !isFirstCharacter) {
            removeClass(currentCharacter, 'current');
            addClass(currentCharacter.previousSibling, 'current');
            removeClass(currentCharacter.previousSibling, 'incorrect');
            removeClass(currentCharacter.previousSibling, 'correct');
        }
        if (!currentCharacter) {
            addClass(currentWord.lastChild, 'current');
            removeClass(currentWord.lastChild, 'incorrect');
            removeClass(currentWord.lastChild, 'correct');
        }

    }

    // move lines or word
    if (currentWord.getBoundingClientRect().top > 250) {
        const words = document.getElementById('words');
        const margin = parseInt(words.style.marginTop || '0px');
        words.style.marginTop = (margin - 35) + 'px';
    }

    //move cursor
    const nextCharacter = document.querySelector('.char.current');
    const nextWord = document.querySelector('.word.current');
    const cursor = document.getElementById('cursor');

    cursor.style.top = (nextCharacter || nextWord).getBoundingClientRect().top + 2 +'px';
    cursor.style.left = (nextCharacter || nextWord).getBoundingClientRect()[nextCharacter ? 'left' : 'right'] + 'px';

})
document.getElementById('start_btn').addEventListener('click', newGame); 

newGame();










// const words = 'Be humble communicate clearly and respect others It costs nothing to be kind but the impact is priceless make mistakes because Im always operating at my limit To be successful you want to surround yourself with very talented folks whose skills blend very well'.split(' ');

// const gameTime = 30 * 1000;
// let timer = null;
// let gameStart = null;

// function getRandomWord() {
//     return words[Math.floor(Math.random() * words.length)];
// }

// function formatWord(word) {
//     return `<div class="word">
//         <span class="char">${word.split('').join('</span><span class="char">')}</span>
//     </div>`;
// }

// function newGame() {
//     const wordsEl = document.getElementById('words');
//     wordsEl.innerHTML = '';
//     wordsEl.style.marginTop = '0px';

//     for (let i = 0; i < 200; i++) {
//         wordsEl.innerHTML += formatWord(getRandomWord());
//     }

//     document.querySelector('.word').classList.add('current');
//     document.querySelector('.char').classList.add('current');

//     document.getElementById('time_con').innerText = 30;
//     document.getElementById('wpm_con').innerText = 0;
//     document.getElementById('acc_con').innerText = '0%';

//     document.getElementById('game').classList.remove('over');

//     clearInterval(timer);
//     timer = null;
//     gameStart = null;

//     document.getElementById('game').focus();
// }

// function gameOver() {
//     clearInterval(timer);
//     document.getElementById('game').classList.add('over');

//     const correct = document.querySelectorAll('.char.correct').length;
//     const incorrect = document.querySelectorAll('.char.incorrect').length;

//     const wpm = Math.round((correct / 5) / (gameTime / 60000));
//     const acc = correct + incorrect === 0 ? 0 : Math.round((correct / (correct + incorrect)) * 100);

//     document.getElementById('wpm_con').innerText = wpm;
//     document.getElementById('acc_con').innerText = acc + '%';
// }

// document.getElementById('game').addEventListener('keyup', e => {
//     const key = e.key;
//     const currentWord = document.querySelector('.word.current');
//     const currentChar = document.querySelector('.char.current');

//     if (document.querySelector('#game.over')) return;

//     if (!timer && key.length === 1) {
//         gameStart = Date.now();
//         timer = setInterval(() => {
//             const timeLeft = Math.ceil((gameTime - (Date.now() - gameStart)) / 1000);
//             document.getElementById('time_con').innerText = timeLeft;
//             if (timeLeft <= 0) gameOver();
//         }, 1000);
//     }

//     if (key.length === 1 && key !== ' ') {
//         if (currentChar) {
//             currentChar.classList.add(key === currentChar.innerText ? 'correct' : 'incorrect');
//             currentChar.classList.remove('current');
//             if (currentChar.nextSibling) currentChar.nextSibling.classList.add('current');
//         }
//     }

//     if (key === ' ') {
//         currentWord.classList.remove('current');
//         currentWord.nextSibling.classList.add('current');
//         currentWord.nextSibling.firstChild.classList.add('current');
//     }

//     /* ===== Cursor positioning ===== */
//     const cursor = document.getElementById('cursor');
//     const target = document.querySelector('.char.current') || document.querySelector('.word.current');
//     const rect = target.getBoundingClientRect();
//     const gameRect = document.getElementById('game').getBoundingClientRect();

//     cursor.style.top = rect.top - gameRect.top + 'px';
//     cursor.style.left = (target.classList.contains('char') ? rect.left : rect.right) - gameRect.left + 'px';
// });

// document.getElementById('start_btn').addEventListener('click', newGame);

// newGame();


