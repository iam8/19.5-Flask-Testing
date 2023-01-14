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

const TIMERLENGTH = 60;  // Seconds
let timerID;
let scoreTotal = 0;


// Submit the word guess to the server at '/process_guess' and return the server response
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
// Disable the 'submit guess' button if timer expires
let startCountDown = function() {
    let timeRem = TIMERLENGTH;
    $timeRem.text(`Time remaining: ${timeRem}`);

    let decrementTime = function() {
        timeRem--;
        $timeRem.text(`Time remaining: ${timeRem}`);

        if (timeRem <= 0) {
            $timeRem.text("Time's up!");
            clearInterval(timerID);
            $formButton.attr("disabled", true);
        }
    };

    timerID = setInterval(decrementTime, 1000);
}


// Upon submission of word guess form, send the guess to the server (via Axios)
// Update the app homepage with a message declaring the validity of the word guess (ok, not on
// board, not word)
// Update the app homepage with updated score
// Display the current guess on page
// Reset the 60-second timer
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
