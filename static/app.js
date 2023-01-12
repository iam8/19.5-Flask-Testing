// Ioana A Mititean
// Exercise 19.5 - Flask Testing (Boggle)
// JS script for Boggle app.

"use strict";

const $guessForm = $("#guess-form");
const $wordInput = $("#word-input");
const $validityMsg = $("#validity-msg")


// Submit the word guess to the server at '/process_guess' and return the server response
async function submitGuess(word) {
    const response = await axios.post(
        "/process_guess",
        {
            "guess": word
        }
    );

    return response;
}


// Get the validity of the word from the server response data
function getWordValidity(response) {
    return response.data["result"];
}


// Upon submission of word guess form, send the guess to the server (via Axios)
// Update the app homepage with a message declaring the validity of the word guess (ok, not on
// board, not word)
$guessForm.on("submit", async function (evt) {
    evt.preventDefault();
    const word_guess = $wordInput.val();
    $(this).trigger("reset");

    const response = await submitGuess(word_guess);
    const validity = getWordValidity(response);
    $validityMsg.text(`The word is ${validity}`);

})
