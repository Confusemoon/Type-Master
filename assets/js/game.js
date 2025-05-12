const words = await fetch('words.json').then(res => res.json());
const input = document.getElementById('input');
const wordDisplay = document.getElementById('word');
const timeDisplay = document.getElementById('time');
const scoreDisplay = document.getElementById('score');
const startBtn = document.getElementById('start');
const restartBtn = document.getElementById('restart');
const scoresDialog = document.getElementById('scores-dialog');
const scoresList = document.getElementById('scores-list');

const bgm = new Audio('./assets/media/loop.mp3');


let time = 60;
let score = 0;
let currentWord = '';
let isPlaying = false;
let timer;

// Load scores from localStorage
let scores = JSON.parse(localStorage.getItem('scores')) || [];

function updateScoreDisplay() {
    scoreDisplay.textContent = score;
}

function updateTimeDisplay() {
    timeDisplay.textContent = time;
}

function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
}

function newWord() {
    currentWord = getRandomWord();
    wordDisplay.textContent = currentWord;
    input.value = '';
}

function gameOver() {
    isPlaying = false;
    clearInterval(timer);
    input.disabled = true;
    
    // Save score
    const accuracy = Math.round(score / (score + (words.length - score)) * 100);
    scores.push({ hits: score, percentage: accuracy });
    
    // Sort and keep top 9
    scores.sort((a, b) => b.hits - a.hits);
    scores = scores.slice(0, 9);
    
    localStorage.setItem('scores', JSON.stringify(scores));
    showScores();
    
    restartBtn.style.display = 'inline';
    startBtn.style.display = 'none';
}

function updateTimer() {
    time--;
    updateTimeDisplay();
    
    if(time === 0) {
        gameOver();
    }
}

function startGame() {
    bgm.play();
    isPlaying = true;
    time = 60;
    score = 0;
    updateScoreDisplay();
    updateTimeDisplay();
    input.disabled = false;
    input.focus();
    newWord();
    
    timer = setInterval(updateTimer, 1000);
    
    startBtn.style.display = 'none';
    restartBtn.style.display = 'inline';
}

function showScores() {
    scoresList.innerHTML = '';
    scores.forEach((score, index) => {
        const div = document.createElement('div');
        div.className = 'score-item';
        div.innerHTML = `#${index + 1} - Hits: ${score.hits} (${score.percentage}%)`;
        scoresList.appendChild(div);
    });
    scoresDialog.showModal();
}

// Event Listeners
startBtn.addEventListener('click', startGame);

restartBtn.addEventListener('click', () => {
    time = 60;
    score = 0;
    startGame();
});

input.addEventListener('input', () => {
    if(input.value === currentWord) {
        score++;
        updateScoreDisplay();
        newWord();
    }
});

document.getElementById('show-scores').addEventListener('click', showScores);

document.getElementById('close-dialog').addEventListener('click', () => {
    scoresDialog.close();
});