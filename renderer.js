const io = require('socket.io-client');
const socket = io(`http://localhost:${process.env.SOCKET_PORT}`);

const hoursOutput = document.querySelector('#hours');
const minutesOutput = document.querySelector('#minutes');
const secondsOutput = document.querySelector('#seconds');
const output = document.querySelector('#messageHint');

var gamePaused = false;

// Set the amount of time for a game
const timer = 60;               // Minutes

// Reset the game
resetGame();

function startGame(){

    // If the game is paused break from code block
    if (gamePaused) {
        return;
    }

    // If the game has ended
    if (millis <= 0){

        // Update the time
        updateTime(millis);
        return;
    }

    // Update the time
    updateTime(millis);
    
    // Decrement the milliseconds by 1 second
    millis -= 1000;

    // Call the startGame function every second using the setTimeout timer
    setTimeout(startGame, 1000);
}

function pauseGame(){

    // Clear the timer set on the startGame function
    clearTimeout(startGame);
}

function resetGame(){

    // Set new milliseconds time
    millis = timer * 60000;

    // Set the hint text as blank
    output.innerHTML = "";

    // Update the time
    updateTime(millis);
}

// Convert time remaining and update HTML elements
function updateTime(timeRemaining){

    // Calculate the hours, minutes and seconds from the milliseconds
    var s = Math.floor(timeRemaining / 1000);
    var m = Math.floor(s / 60);
    var h = Math.floor(m / 60);

    // Get remaining
    h %= 24;
    m %= 60;
    s %= 60;

    // Add a 0 to the output if less than 10
    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;

    // Update HTML elements
    hoursOutput.innerHTML = h;
    minutesOutput.innerHTML = m;
    secondsOutput.innerHTML = s;

    //console.log(`Hours: ${h} Minutes: ${m} Seconds: ${s}`);
}

// Socket IO
socket.on('start-game', message => {
    //console.log("starting timer");
    gamePaused = false;
    startGame();
})

socket.on('pause-game', message => {
    //console.log("pausing timer");
    gamePaused = true;
})

socket.on('reset-game', message => {
    //console.log("resetting game");
    gamePaused = true;
    pauseGame();
    resetGame();
})

socket.on('message', message => {
    //console.log(`Displaying message: ${message}`);
    output.innerHTML = message;
})
