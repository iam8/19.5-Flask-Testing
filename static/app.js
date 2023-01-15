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
const $numGames = $("#num-games");

const TIMERLENGTH = 60;  // Seconds
let timerID;
let scoreTotal = 0;


// SENDING REQUESTS TO SERVER ---------------------------------------------------------------------

/**
 * Submit user word guess:
 * - Send the user word guess to the server at '/process_guess' and return the server response.
 */
async function submitGuess(word) {
    const response = await axios.post(
        "/process_guess",
        {
            "guess": word.toLowerCase()
        }
    );

    return response;
}


// Update player stats: current game score and number of games played
/**
 * Update user's statistics:
 * - Submit user's final game score to the server at 'update_stats/' and return the server
 * response.
 */
async function updateStats(score) {
    const response = await axios.post(
        "/update_stats",
        {
            "score": score
        }
    );

    return response;
}

// ------------------------------------------------------------------------------------------------


// STARTING/ENDING GAME ---------------------------------------------------------------------------

/**
 * Start countdown timer:
 * - Count down from global variable TIMERLENGTH (seconds).
 * - Display remaining time on page.
 * - End game when time expires.
 */
let startCountDown = function() {
    let timeRem = TIMERLENGTH;
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


/**
 * End current game:
 * - Clear timer
 * - Update player stats
 * - Disable guess input button
 * - Update text on page to reflect end-of-game
*/
async function endGame() {
    clearInterval(timerID);

    const response = await updateStats(scoreTotal);
    const numGames = response.data["num_games"];
    const maxScore = response.data["max_score"];

    $formButton.attr("disabled", true);
    $timeRem.text("Time's up!");
    $numGames.text(`Total games played: ${numGames}`);
    $highestScore.text(`Highest score: ${maxScore}`);
}

// ------------------------------------------------------------------------------------------------


// HELPER FUNCTIONS -------------------------------------------------------------------------------

/**
 * Retrieve word validity from server response and return an appropriate validity message.
 */
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


/**
 * Determine the score for a word guess that has the given validity message.
 */
function calculateScore(word, validityMsg) {
    if (validityMsg === "The word is valid!") {
        return word.length;
    }

    return 0;
}

// ------------------------------------------------------------------------------------------------


// EVENT HANDLING ---------------------------------------------------------------------------------

// Handle click of word guess input button
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
})

// ------------------------------------------------------------------------------------------------


// MAIN -------------------------------------------------------------------------------------------

// On DOM load, start countdown timer
$(startCountDown);

// ------------------------------------------------------------------------------------------------
