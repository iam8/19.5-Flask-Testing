# Ioana A Mititean
# Exercise 19.5 - Flask Testing (Boggle)

"""
Main code for Boggle application - Flask setup, routes, and view functions.
"""

from flask import Flask, request, render_template, session, jsonify
from flask_debugtoolbar import DebugToolbarExtension

from boggle import Boggle

app = Flask(__name__)
app.config["SECRET_KEY"] = "ceva foarte secreta"
debug = DebugToolbarExtension(app)

BOARD_KEY = "board"
MAX_SCORE_KEY = "max"
NUM_GAMES = "num_games"

boggle_game = Boggle()
guesses = set()


@app.route("/", methods=["GET"])
def homepage():
    """
    Display the homepage, where the Boggle board and user inputs will be located.

    Store the Boggle board in session and clear user guesses.
    """

    board = boggle_game.make_board()
    session[BOARD_KEY] = board
    guesses.clear()

    return render_template("/boggle_home.jinja2", board=board)


@app.route("/process_guess", methods=["POST"])
def process_guess():
    """
    Retrieve and process guess input by user.

    Return JSON that contains the word validity:
    - {"result": "ok"} | {"result": "not-word"} | {"result": not-on-board} | {"result":
     "duplicate"}
    """

    request_data = request.get_json()
    guess = request_data["guess"]

    if guess in guesses:
        result = "duplicate"
    else:
        guesses.add(guess)
        board = session[BOARD_KEY]
        result = boggle_game.check_valid_word(board, guess)

    return jsonify(result=result)


@app.route("/update_stats", methods=["POST"])
def update_stats():
    """
    Update player statistics:
    - Retrieve user score and update max score in session.
    - Update session with number of total games this user has played.
    """

    request_data = request.get_json()
    score = request_data["score"]

    # curr_max = session.get(MAX_SCORE_KEY, 0)
    # is_new_max = False

    # if score > curr_max:
    #     is_new_max = True
    #     session[MAX_SCORE_KEY] = score
    #     curr_max = score

    curr_max = update_max_score(score)
    curr_num_games = update_num_games()

    return jsonify(max_score=curr_max,
                   num_games=curr_num_games)


def update_max_score(score):
    """
    Determine if the given score is a new maximum for this user and update user's max game
    score in session accordingly.

    Return the new maximum score.
    """

    if score > session.get(MAX_SCORE_KEY, 0):
        session[MAX_SCORE_KEY] = score

    return session[MAX_SCORE_KEY]


def update_num_games():
    """
    Increment the total number of games this user has played in session and return the updated
    total.
    """

    session[NUM_GAMES] = session.get(NUM_GAMES, 0) + 1

    return session[NUM_GAMES]
