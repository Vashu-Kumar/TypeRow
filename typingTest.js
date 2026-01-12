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
    document.getElementById('words').innerHTML = '';
    for (let i = 0; i < 200; i++) {
        document.getElementById('words').innerHTML += formatWord(getRandomWords());
    }

    addClass(document.querySelector('.word'), 'current');
    addClass(document.querySelector('.char'), 'current');
    window.timer = null;
    
}
function getWpm() {
    return;
}

function gameOver() {
    clearInterval(window.timer);
    addClass(document.getElementById('game'), 'over');
    document.getElementById('wpm_con').innerHTML = ``
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

    cursor.style.top = (nextCharacter || nextWord).getBoundingClientRect().top + 2 + 'px';
    cursor.style.left = (nextCharacter || nextWord).getBoundingClientRect()[nextCharacter ? 'left' : 'right'] + 'px';

})

newGame();
