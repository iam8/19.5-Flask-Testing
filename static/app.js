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

    console.log(response)
}

// Upon submission of word guess form, send the guess to the server (via Axios)
$guessForm.on("submit", async function (evt) {
    evt.preventDefault();
    console.log("Submitted guess form");
    const word_guess = $wordInput.val();
    console.log(word_guess);

    // Call function to do axios post request here
    await submitGuess(word_guess);
})

