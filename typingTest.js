const words = 'Be humble communicate clearly and respect others It costs nothing to be kind but the impact is priceless make mistakes because Im always operating at my limit To be successful you want to surround yourself with very talented folks whose skills blend very well'.split(' ');

const wordsCount = words.length;

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
}

document.getElementById('game').addEventListener('keyup', ev => {
    const key = ev.key 
    const currentWord = document.querySelector('.word.current');
    const currentCharacter = document.querySelector('.char.current');
    const expectedCharacter = currentCharacter?.innerHTML || ' ';
    const ischaracter = key.length === 1 && key != ' ';
    const isSpace = key === ' ';

    console.log({ key, expectedCharacter });

    if (ischaracter) {
        if (currentCharacter) {
            addClass(currentCharacter, key === expectedCharacter ? 'correct' : 'incorrect');
            removeClass(currentCharacter, 'current');
            if(currentCharacter.nextSibling){
                addClass(currentCharacter.nextSibling, 'current')
            }
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
        if(currentCharacter){
            removeClass(currentCharacter, 'current');
        }
        addClass(currentWord.nextSibling.firstChild, 'current');
    }



















})

newGame();
