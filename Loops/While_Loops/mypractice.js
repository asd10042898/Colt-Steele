//write a game to guess a number
//include a random number and how many times you guess
//and also have a string "q" that you can quit the game
let maximum = parseInt(prompt("Let's have a guess number game!\nIf you want to quit the game, enter 'q'.\nInput a maximum number!"));
while (!maximum) {
    maximum = parseInt(prompt("input a valid number!"))
}

let targetNum = Math.floor(Math.random()*maximum + 1);
let guess = parseInt(prompt("input your first guess!"));
while (!guess) {
    guess = parseInt(prompt("guess a valid number!"))
}
let times = 1;

while (parseInt(guess) !== targetNum) {
    if (guess === "q") break;
    if (guess > targetNum) {
        guess = prompt("Guess lower guess again!");
        times += 1;
    } else {
        guess = prompt("Guess bigger guess again!");
        times += 1;
    }
}


if (guess === "q") {
    alert("You quit the game!")
} else {
    alert(`You Got It!\nYou guess ${times} guesses.The target number is ${targetNum}.`)
}

