// Ioana A Mititean
// Exercise 19.5 - Flask Testing (Boggle)
// JS script for Boggle app.

"use strict";

const $guessForm = $("#guess-form");

async function submitGuess(word) {
    const response = await axios.post(
        "/submit_guess",
        {
            guess: word
        }
    )
}

// Upon submission of word guess form, send the guess to the server (via Axios)
$guessForm.on("submit", async function (evt) {
    evt.preventDefault();
    // Call function to do axios post request here

})

