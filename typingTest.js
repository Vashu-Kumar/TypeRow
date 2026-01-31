const words = 'Be humble communicate clearly and respect others It costs nothing to be kind but the impact is priceless make mistakes because Im always operating at my limit To be successful you want to surround yourself with very talented folks whose skills blend very well  not school set they state high life consider on and not come what also for set point can want as while with of order child about school thing never hold find order each too between program work end you home place around while place problem end begin interest while public or where see time those increase interest be give end think seem small as both another a child same eye you between way do who into again good fact than under very head become real possible some write know however late each that with because that place nation only for each change form consider we would interest with world so order or run more open that large write turn never over open each over change still old take hold need give by consider line only leave while what set up number part form want against great problem can because head'.split(' ');

const wordsCount = words.length;

const gameTime = 30 * 1000;
let timer = null;
let gameStart = null;

function getRandomWords() {
    const randomIdx = Math.floor(Math.random() * wordsCount);
    return words[randomIdx];
}

function formatWord(word) {
    return `<div class="word"><span class="char">${word.split('').join('</span><span class="char">')}</span></div>`;
}

function addClass(el, name) {
    el?.classList.add(name);
}

function removeClass(el, name) {
    el?.classList.remove(name);
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

    clearInterval(timer);
    timer = null;
    gameStart = null;

    document.getElementById('game').focus();
}

function getWpm() {
    const correctCharacters = document.querySelectorAll('.char.correct').length;
    const minutes = gameTime /1000 /60;
    return Math.round((correctCharacters / 5) / minutes);
}

function gameOver() {
    clearInterval(timer);
    addClass(document.getElementById('game'), 'over');

    const correct = document.querySelectorAll('.char.correct').length;
    const incorrect = document.querySelectorAll('.char.incorrect').length;

    const wpm = getWpm();
    const acc =
        correct + incorrect === 0
            ? 0
            : Math.round((correct / (correct + incorrect)) * 100);

    document.getElementById('wpm_con').innerText = wpm;
    document.getElementById('acc_con').innerText = acc + '%';
}

document.getElementById('game').addEventListener('keydown', ev => {
    const key = ev.key
    const currentWord = document.querySelector('.word.current');
    const currentCharacter = document.querySelector('.char.current');
    const expectedCharacter = currentCharacter?.innerHTML || ' ';
    const ischaracter = key.length === 1 && key != ' ';
    const isBackspace = key === 'Backspace';
    const isFirstCharacter = currentCharacter === currentWord.firstChild;

    if (document.querySelector('#game.over')) {
        return;
    }

    console.log({ key, expectedCharacter });

    //  TIMER START 
if (!timer && ischaracter) {
    gameStart = Date.now();

    timer = setInterval(() => {
        const msPassed = Date.now() - gameStart;
        const secondLeft = Math.ceil(
            (gameTime - msPassed) / 1000
        );

        document.getElementById('time_con').innerText = secondLeft;

        if (secondLeft <= 0) {
            clearInterval(timer);
            timer = null;
            gameOver();
        }
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

    if (key === ' ') {
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
            if (!currentWord.previousSibling) return;
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

    // SCROLL WORDS 
     if (currentWord.getBoundingClientRect().top > 150 ) {
         const wordsBox = document.getElementById('words');
         const margin = parseInt(wordsBox.style.marginTop || '0px');
         wordsBox.style.marginTop = margin - 35 + 'px';
     }

    //  CURSOR POSITION 
    const cursor = document.getElementById('cursor');
    const target =
        document.querySelector('.char.current') ||
        document.querySelector('.word.current');

    const rect = target.getBoundingClientRect();
    const gameRect = document.getElementById('game').getBoundingClientRect();

    cursor.style.top = rect.top - gameRect.top + 'px';
    cursor.style.left =
        (target.classList.contains('char') ? rect.left : rect.right) -
        gameRect.left +
        'px';
})
document.getElementById('start_btn').addEventListener('click', newGame); 

newGame();

