// Ioana A Mititean
// Exercise 19.5 - Flask Testing (Boggle)
// JS script for Boggle app.

"use strict";

const $guessForm = $("#guess-form");
const $wordInput = $("#word-input");

async function submitGuess(word) {
    const response = await axios.post(
        "/process_guess",
        {
            "guess": word
        }
    );

    console.log(response);
}

// Upon submission of word guess form, send the guess to the server (via Axios)
$guessForm.on("submit", async function (evt) {
    evt.preventDefault();
    const word_guess = $wordInput.val();

    await submitGuess(word_guess);
})
