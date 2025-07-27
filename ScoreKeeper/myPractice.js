const p1Score = document.querySelector('#p1Score');
const p2Score = document.querySelector('#p2Score');
const p1Btn = document.querySelector('#p1Btn');
const p2Btn = document.querySelector('#p2Btn');
const rstBtn = document.querySelector('#rstBtn');
const playto = document.querySelector('#playto');

let p1total = 0;
let p2total = 0;
let totalWin = parseInt(playto.value);
let isGameOver = false;

playto.addEventListener('change', reset)

p1Btn.addEventListener('click', function() {
    if(!isGameOver) {
        p1total += 1;
        p1Score.innerText = p1total;
        if (p1total === totalWin){
            isGameOver = true;
            p1Score.classList.add('winner');
            p2Score.classList.add('loser');
        }
    }
})

p2Btn.addEventListener('click', function() {
    if(!isGameOver) {
        p2total += 1;
        p2Score.innerText = p2total;
        if (p2total === totalWin){
            isGameOver = true;
            p2Score.classList.add('winner');
            p1Score.classList.add('loser');
        }
    }
})

rstBtn.addEventListener('click', reset)

function reset() {
    isGameOver = false;
    p1total = 0;
    p1Score.innerText = p1total;
    p2total = 0;
    p2Score.innerText = p2total;
    p1Score.classList.remove('winner', 'loser');
    p2Score.classList.remove('winner', 'loser');
}