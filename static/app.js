// Ioana A Mititean
// Exercise 19.5 - Flask Testing (Boggle)
// JS script for Boggle app.

"use strict";

const $guessForm = $("#guess-form");
const $wordInput = $("#word-input");
const $validityMsg = $("#validity-msg");
const $scoreTotal = $("#score-total");
const $guessDisplay = $("#guess-display");
const $formButton = $("#submit-button");
const $timeRem = $("#time-remaining");
const $highestScore = $("#highest-score");

const TIMERLENGTH = 60;  // Seconds
let timerID;
let scoreTotal = 0;


// Submit the word guess to the server at '/process_guess' and return the server response
// Server response: JSON; contains a key for 'result' and a value indicating the word's validity
async function submitGuess(word) {
    const response = await axios.post(
        "/process_guess",
        {
            "guess": word.toLowerCase()
        }
    );

    return response;
}


// Get the validity of the word from the server response data and return the appropriate validity
// message depending on the validity
function getValidityMsg(response) {
    const validity = response.data["result"];

    if (validity === "ok") {
        return "The word is valid!"
    }

    if (validity === "not-on-board") {
        return "The word doesn't exist on the board - try again!"
    }

    return "Your guess is not a word - try again!"
}


// Determine the score for a word guess with the given validity message
function calculateScore(word, validityMsg) {
    if (validityMsg === "The word is valid!") {
        return word.length;
    }

    return 0;
}


// Start the countdown timer
// Display time remaining on screen each second
// End the game if timer expires
let startCountDown = function() {
    let timeRem = 15;
    $timeRem.text(`Time remaining: ${timeRem}`);

    let decrementTime = async function() {
        timeRem--;
        $timeRem.text(`Time remaining: ${timeRem}`);

        if (timeRem <= 0) {
            await endGame();
        }
    };

    timerID = setInterval(decrementTime, 1000);
}


// Send request to server with Axios with the current score so that the player's max score can
// be updated
async function updateMaxScore(score) {
    const response = await axios.post(
        "/update_max_score",
        {
            "score": score
        }
    );

    console.log(response.data);
    return response;
}

// Reminder: for now, game ends after timer runs out at any point
// Clean up after game ends
// Update text on screen to show it is endgame
// Disable form button
// Clear timer
async function endGame() {
    $timeRem.text("Time's up!");
    clearInterval(timerID);
    $formButton.attr("disabled", true);
    const response = await updateMaxScore(scoreTotal);
    const maxScore = response.data["max_score"];
    $highestScore.text(`Highest score: ${maxScore}`);
}


// Upon submission of word guess form, send the guess to the server (via Axios)
// Update the app homepage with a message declaring the validity of the word guess (ok, not on
// board, not word)
// Update the app homepage with updated score
// Display the current guess on page
// Reset the 60-second timer
// Update highest score on page if needed
$guessForm.on("submit", async function (evt) {
    evt.preventDefault();
    const wordGuess = $wordInput.val();
    $(this).trigger("reset");

    $guessDisplay.text(`You guessed: ${wordGuess}`);

    const response = await submitGuess(wordGuess);
    const validity = getValidityMsg(response);
    $validityMsg.text(validity);

    scoreTotal += calculateScore(wordGuess, validity);
    $scoreTotal.text(`Current score total: ${scoreTotal}`);

    // Reset timer
    clearInterval(timerID);
    startCountDown();
})


// On DOM load, start countdown timer
$(startCountDown);
